const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');
const axios = require('axios');

// POST chat with Digital Dr GPT
router.post('/api/v1/gpt/chat', auth, async (req, res) => {
  try {
    const { message, patient_id, context_type } = req.body;
    const doctorId = req.user.id;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message field is required'
      });
    }
    
    // Verify patient belongs to doctor if patient_id provided
    if (patient_id) {
      const patientCheck = await db.query(
        'SELECT id FROM patients WHERE id = $1 AND doctor_id = $2',
        [patient_id, doctorId]
      );
      
      if (patientCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado: este paciente no pertenece a este doctor'
        });
      }
    }
    
    // Store interaction in database
    const query = `
      INSERT INTO gpt_interactions (
        doctor_id,
        patient_id,
        gpt_type,
        message_content,
        response_content,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;
    
    // Send request to OpenAI API (using the GPT Custom link endpoint)
    // Note: This requires setting up OpenAI API integration
    // Digital Dr GPT: https://chatgpt.com/g/g-67c8ec28f8a0819185da1d361184409f-digital-dr
    
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are Digital Dr, a helpful medical assistant for healthcare professionals.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const responseText = gptResponse.data.choices[0].message.content;
    
    const result = await db.query(query, [
      doctorId,
      patient_id || null,
      'digital_dr',
      message,
      responseText
    ]);
    
    res.json({
      success: true,
      data: {
        interaction_id: result.rows[0].id,
        message: message,
        response: responseText,
        gpt_type: 'Digital Dr',
        timestamp: result.rows[0].created_at
      }
    });
  } catch (error) {
    console.error('Error in GPT chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing GPT request',
      error: error.message
    });
  }
});

// POST chat with Abril Mental Helper
router.post('/api/v1/gpt/mental-health', auth, async (req, res) => {
  try {
    const { message, patient_id } = req.body;
    const doctorId = req.user.id;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message field is required'
      });
    }
    
    // Verify patient belongs to doctor if patient_id provided
    if (patient_id) {
      const patientCheck = await db.query(
        'SELECT id FROM patients WHERE id = $1 AND doctor_id = $2',
        [patient_id, doctorId]
      );
      
      if (patientCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado: este paciente no pertenece a este doctor'
        });
      }
    }
    
    // Send request to OpenAI API for mental health
    // Abril Mental Helper: https://chatgpt.com/g/g-hfKTdCmcI-abril-mental-helper
    
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are Abril Mental Health Helper, a supportive mental health assistant.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const responseText = gptResponse.data.choices[0].message.content;
    
    // Store interaction
    const query = `
      INSERT INTO gpt_interactions (
        doctor_id,
        patient_id,
        gpt_type,
        message_content,
        response_content,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;
    
    const result = await db.query(query, [
      doctorId,
      patient_id || null,
      'abril_mental_helper',
      message,
      responseText
    ]);
    
    res.json({
      success: true,
      data: {
        interaction_id: result.rows[0].id,
        message: message,
        response: responseText,
        gpt_type: 'Abril Mental Helper',
        timestamp: result.rows[0].created_at
      }
    });
  } catch (error) {
    console.error('Error in mental health GPT:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing mental health request',
      error: error.message
    });
  }
});

// GET interaction history
router.get('/api/v1/gpt/history', auth, async (req, res) => {
  try {
    const { patient_id, gpt_type, limit = 50 } = req.query;
    const doctorId = req.user.id;
    
    let query = `
      SELECT 
        id,
        doctor_id,
        patient_id,
        gpt_type,
        message_content,
        response_content,
        created_at
      FROM gpt_interactions
      WHERE doctor_id = $1
    `;
    
    const params = [doctorId];
    let paramCount = 1;
    
    if (patient_id) {
      paramCount++;
      query += ` AND patient_id = $${paramCount}`;
      params.push(patient_id);
    }
    
    if (gpt_type) {
      paramCount++;
      query += ` AND gpt_type = $${paramCount}`;
      params.push(gpt_type);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1}`;
    params.push(Math.min(parseInt(limit), 500));
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching interaction history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interaction history',
      error: error.message
    });
  }
});

// GET single interaction
router.get('/api/v1/gpt/history/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;
    
    const query = `
      SELECT 
        id,
        doctor_id,
        patient_id,
        gpt_type,
        message_content,
        response_content,
        created_at
      FROM gpt_interactions
      WHERE id = $1 AND doctor_id = $2
    `;
    
    const result = await db.query(query, [id, doctorId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Interaction not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interaction',
      error: error.message
    });
  }
});

module.exports = router;
