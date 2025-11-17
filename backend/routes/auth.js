const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/v1/auth/register - Registrar nuevo doctor
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, specialization, licenseNumber, phone } = req.body;

    // Validar campos requeridos
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ status: 'error', message: 'Faltan campos requeridos' });
    }

    // Verificar si el doctor ya existe
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ status: 'error', message: 'El email ya está registrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, specialization, license_number, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, first_name, last_name, specialization, role`,
      [email, hashedPassword, firstName, lastName, specialization, licenseNumber, phone, 'doctor']
    );

    const user = result.rows[0];
    res.status(201).json({
      status: 'success',
      message: 'Doctor registrado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ status: 'error', message: 'Error al registrar doctor' });
  }
});

// POST /api/v1/auth/login - Login doctor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email y password requeridos' });
    }

    // Buscar usuario
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    // Crear JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        specialization: user.specialization,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ status: 'error', message: 'Error al hacer login' });
  }
});

// POST /api/v1/auth/refresh - Refrescar token
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Token refrescado',
      token: newToken
    });
  } catch (error) {
    console.error('Error al refrescar token:', error);
    res.status(500).json({ status: 'error', message: 'Error al refrescar token' });
  }
});

// POST /api/v1/auth/logout - Logout (opcional, para limpiar en frontend)
router.post('/logout', authMiddleware, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logout exitoso. Por favor elimina el token del cliente.'
  });
});

module.exports = router;
