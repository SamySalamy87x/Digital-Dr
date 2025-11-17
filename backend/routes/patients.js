const express = require('express');
const { query } = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/patients - Obtener todos los pacientes del doctor
router.get('/', authMiddleware, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const result = await query(
      'SELECT * FROM patients WHERE user_id = $1 ORDER BY created_at DESC',
      [doctorId]
    );
    
    res.status(200).json({
      status: 'success',
      count: result.rows.length,
      patients: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener pacientes' });
  }
});

// POST /api/v1/patients - Crear nuevo paciente
router.post('/', authMiddleware, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { firstName, lastName, email, phone, dateOfBirth, gender, medicalHistory, allergies, currentMedications } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ status: 'error', message: 'Nombre y apellido requeridos' });
    }

    const result = await query(
      `INSERT INTO patients (user_id, first_name, last_name, email, phone, date_of_birth, gender, medical_history, allergies, current_medications)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [doctorId, firstName, lastName, email, phone, dateOfBirth, gender, medicalHistory, allergies, currentMedications]
    );

    res.status(201).json({
      status: 'success',
      message: 'Paciente creado exitosamente',
      patient: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando paciente:', error);
    res.status(500).json({ status: 'error', message: 'Error al crear paciente' });
  }
});

// GET /api/v1/patients/:id - Obtener paciente por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    const result = await query(
      'SELECT * FROM patients WHERE id = $1 AND user_id = $2',
      [id, doctorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Paciente no encontrado' });
    }

    res.status(200).json({
      status: 'success',
      patient: result.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo paciente:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener paciente' });
  }
});

// PUT /api/v1/patients/:id - Actualizar paciente
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;
    const { firstName, lastName, email, phone, dateOfBirth, gender, medicalHistory, allergies, currentMedications } = req.body;

    const result = await query(
      `UPDATE patients 
       SET first_name = $1, last_name = $2, email = $3, phone = $4, date_of_birth = $5, gender = $6, 
           medical_history = $7, allergies = $8, current_medications = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [firstName, lastName, email, phone, dateOfBirth, gender, medicalHistory, allergies, currentMedications, id, doctorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Paciente no encontrado' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Paciente actualizado exitosamente',
      patient: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando paciente:', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar paciente' });
  }
});

// DELETE /api/v1/patients/:id - Eliminar paciente
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    const result = await query(
      'DELETE FROM patients WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, doctorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Paciente no encontrado' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Paciente eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando paciente:', error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar paciente' });
  }
});

module.exports = router;
