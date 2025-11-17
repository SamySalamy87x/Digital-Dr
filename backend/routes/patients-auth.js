patients-auth.jsconst express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// PATIENT REGISTRATION
router.post('/api/v1/patients/register', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, date_of_birth, password } = req.body;

    // Validation
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: email, password, first_name, last_name'
      });
    }

    // Check if patient already exists
    const existingPatient = await db.query(
      'SELECT id FROM patients WHERE email = $1',
      [email]
    );

    if (existingPatient.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Este email ya está registrado'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create patient without doctor assignment (doctor_id will be null)
    const query = `
      INSERT INTO patients (
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        password,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, email, first_name, last_name
    `;

    const result = await db.query(query, [
      first_name,
      last_name,
      email,
      phone || null,
      date_of_birth || null,
      hashedPassword
    ]);

    // Generate JWT token
    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email, type: 'patient' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Paciente registrado exitosamente',
      data: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        first_name: result.rows[0].first_name,
        last_name: result.rows[0].last_name
      },
      token
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering patient',
      error: error.message
    });
  }
});

// PATIENT LOGIN
router.post('/api/v1/patients/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Find patient
    const query = `
      SELECT id, email, first_name, last_name, password
      FROM patients
      WHERE email = $1
    `;

    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

    const patient = result.rows[0];

    // Compare passwords
    const validPassword = await bcrypt.compare(password, patient.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: patient.id, email: patient.email, type: 'patient' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: patient.id,
        email: patient.email,
        first_name: patient.first_name,
        last_name: patient.last_name
      },
      token
    });
  } catch (error) {
    console.error('Error logging in patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

module.exports = router;
