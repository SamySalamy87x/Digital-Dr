const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// GET all appointments for a doctor (with patient details)
router.get('/api/v1/appointments', auth, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const query = `
      SELECT 
        a.id,
        a.doctor_id,
        a.patient_id,
        a.appointment_date,
        a.appointment_time,
        a.description,
        a.status,
        a.created_at,
        a.updated_at,
        p.first_name,
        p.last_name,
        p.email,
        p.phone,
        p.date_of_birth
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = $1
      ORDER BY a.appointment_date DESC, a.appointment_time ASC
    `;
    
    const result = await db.query(query, [doctorId]);
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
});

// GET single appointment by ID
router.get('/api/v1/appointments/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;
    
    const query = `
      SELECT 
        a.id,
        a.doctor_id,
        a.patient_id,
        a.appointment_date,
        a.appointment_time,
        a.description,
        a.status,
        a.created_at,
        a.updated_at,
        p.first_name,
        p.last_name,
        p.email,
        p.phone,
        p.date_of_birth
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.id = $1 AND a.doctor_id = $2
    `;
    
    const result = await db.query(query, [id, doctorId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cita médica no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
});

// POST create new appointment
router.post('/api/v1/appointments', auth, async (req, res) => {
  try {
    const { patient_id, appointment_date, appointment_time, description } = req.body;
    const doctorId = req.user.id;
    
    // Validate required fields
    if (!patient_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: patient_id, appointment_date, appointment_time'
      });
    }
    
    // Verify patient belongs to this doctor
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
    
    const query = `
      INSERT INTO appointments (
        doctor_id,
        patient_id,
        appointment_date,
        appointment_time,
        description,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;
    
    const result = await db.query(query, [
      doctorId,
      patient_id,
      appointment_date,
      appointment_time,
      description || null,
      'programada'
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Cita médica creada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
});

// PUT update appointment
router.put('/api/v1/appointments/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { appointment_date, appointment_time, description, status } = req.body;
    const doctorId = req.user.id;
    
    // Verify appointment exists and belongs to this doctor
    const appointmentCheck = await db.query(
      'SELECT id FROM appointments WHERE id = $1 AND doctor_id = $2',
      [id, doctorId]
    );
    
    if (appointmentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cita médica no encontrada o acceso denegado'
      });
    }
    
    const query = `
      UPDATE appointments
      SET 
        appointment_date = COALESCE($1, appointment_date),
        appointment_time = COALESCE($2, appointment_time),
        description = COALESCE($3, description),
        status = COALESCE($4, status),
        updated_at = NOW()
      WHERE id = $5 AND doctor_id = $6
      RETURNING *
    `;
    
    const result = await db.query(query, [
      appointment_date || null,
      appointment_time || null,
      description || null,
      status || null,
      id,
      doctorId
    ]);
    
    res.json({
      success: true,
      message: 'Cita médica actualizada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
});

// DELETE appointment
router.delete('/api/v1/appointments/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;
    
    // Verify appointment exists and belongs to this doctor
    const appointmentCheck = await db.query(
      'SELECT id FROM appointments WHERE id = $1 AND doctor_id = $2',
      [id, doctorId]
    );
    
    if (appointmentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cita médica no encontrada o acceso denegado'
      });
    }
    
    await db.query(
      'DELETE FROM appointments WHERE id = $1 AND doctor_id = $2',
      [id, doctorId]
    );
    
    res.json({
      success: true,
      message: 'Cita médica eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message
    });
  }
});

module.exports = router;
