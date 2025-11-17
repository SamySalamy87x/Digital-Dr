const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');
const axios = require('axios');

// Helper function to get PayPal access token
const getPayPalAccessToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.PAYPAL_MODE === 'sandbox' ? 
        'https://api.sandbox.paypal.com' : 
        'https://api.paypal.com'}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw error;
  }
};

// POST create subscription
router.post('/api/v1/subscriptions/create', auth, async (req, res) => {
  try {
    const { plan_id, return_url, cancel_url } = req.body;
    const doctorId = req.user.id;
    
    if (!plan_id) {
      return res.status(400).json({
        success: false,
        message: 'plan_id field is required'
      });
    }
    
    const accessToken = await getPayPalAccessToken();
    
    // Create subscription
    const subscriptionResponse = await axios.post(
      `${process.env.PAYPAL_MODE === 'sandbox' ? 
        'https://api.sandbox.paypal.com' : 
        'https://api.paypal.com'}/v1/billing/subscriptions`,
      {
        plan_id: plan_id,
        subscriber: {
          name: {
            given_name: req.user.name || 'Doctor',
            surname: 'User'
          },
          email_address: req.user.email
        },
        application_context: {
          brand_name: 'Digital Dr',
          locale: 'es-MX',
          user_action: 'SUBSCRIBE_NOW',
          return_url: return_url || process.env.PAYPAL_RETURN_URL,
          cancel_url: cancel_url || process.env.PAYPAL_CANCEL_URL
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Store subscription in database
    const query = `
      INSERT INTO subscriptions (
        doctor_id,
        paypal_subscription_id,
        plan_id,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    
    const result = await db.query(query, [
      doctorId,
      subscriptionResponse.data.id,
      plan_id,
      'active'
    ]);
    
    // Get approval URL
    const approvalUrl = subscriptionResponse.data.links.find(
      link => link.rel === 'approve'
    )?.href;
    
    res.json({
      success: true,
      message: 'Subscription created successfully',
      data: {
        subscription_id: result.rows[0].id,
        paypal_subscription_id: subscriptionResponse.data.id,
        approval_url: approvalUrl,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message
    });
  }
});

// GET subscription status
router.get('/api/v1/subscriptions/:subscription_id', auth, async (req, res) => {
  try {
    const { subscription_id } = req.params;
    const doctorId = req.user.id;
    
    // Get subscription from database
    const query = `
      SELECT 
        id,
        doctor_id,
        paypal_subscription_id,
        plan_id,
        status,
        created_at,
        updated_at
      FROM subscriptions
      WHERE id = $1 AND doctor_id = $2
    `;
    
    const result = await db.query(query, [subscription_id, doctorId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    const subscription = result.rows[0];
    
    // Get details from PayPal
    const accessToken = await getPayPalAccessToken();
    const paypalResponse = await axios.get(
      `${process.env.PAYPAL_MODE === 'sandbox' ? 
        'https://api.sandbox.paypal.com' : 
        'https://api.paypal.com'}/v1/billing/subscriptions/${subscription.paypal_subscription_id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    res.json({
      success: true,
      data: {
        id: subscription.id,
        paypal_subscription_id: subscription.paypal_subscription_id,
        plan_id: subscription.plan_id,
        status: paypalResponse.data.status,
        created_at: subscription.created_at,
        paypal_details: paypalResponse.data
      }
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message
    });
  }
});

// POST cancel subscription
router.post('/api/v1/subscriptions/:subscription_id/cancel', auth, async (req, res) => {
  try {
    const { subscription_id } = req.params;
    const { reason } = req.body;
    const doctorId = req.user.id;
    
    // Get subscription from database
    const query = `
      SELECT paypal_subscription_id FROM subscriptions
      WHERE id = $1 AND doctor_id = $2
    `;
    
    const result = await db.query(query, [subscription_id, doctorId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    const paypalSubscriptionId = result.rows[0].paypal_subscription_id;
    const accessToken = await getPayPalAccessToken();
    
    // Cancel subscription with PayPal
    await axios.post(
      `${process.env.PAYPAL_MODE === 'sandbox' ? 
        'https://api.sandbox.paypal.com' : 
        'https://api.paypal.com'}/v1/billing/subscriptions/${paypalSubscriptionId}/cancel`,
      {
        reason: reason || 'User requested cancellation'
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Update subscription status in database
    await db.query(
      'UPDATE subscriptions SET status = $1, updated_at = NOW() WHERE id = $2',
      ['cancelled', subscription_id]
    );
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
});

// GET doctor subscriptions
router.get('/api/v1/subscriptions', auth, async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    const query = `
      SELECT 
        id,
        doctor_id,
        paypal_subscription_id,
        plan_id,
        status,
        created_at,
        updated_at
      FROM subscriptions
      WHERE doctor_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query, [doctorId]);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriptions',
      error: error.message
    });
  }
});

module.exports = router;
