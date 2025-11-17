const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// GET all medical records for a patient
router.get('/api/v1/medical-records/patient/:patientId', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user.id;
    
    // Verify patient belongs to this doctor
    const patientCheck = await db.query(
      'SELECT id FROM patients WHERE id = $1 AND doctor_id = $2',
      [patientId, doctorId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: este paciente no pertenece a este doctor'
      });
    }
    
    const query = `
      SELECT 
        id,
        doctor_id,
        patient_id,
        diagnosis,
        treatment,
        medications,
        notes,
        record_date,
        created_at,
        updated_at
      FROM medical_records
      WHERE patient_id = $1
      ORDER BY record_date DESC
    `;
    
    const result = await db.query(query, [patientId]);
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medical records',
      error: error.message
    });
  }
});

// GET single medical record by ID
router.get('/api/v1/medical-records/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;
    
    const query = `
      SELECT 
        m.id,
        m.doctor_id,
        m.patient_id,
        m.diagnosis,
        m.treatment,
        m.medications,
        m.notes,
        m.record_date,
        m.created_at,
        m.updated_at,
        p.first_name,
        p.last_name,
        p.email
      FROM medical_records m
      JOIN patients p ON m.patient_id = p.id
      WHERE m.id = $1 AND m.doctor_id = $2
    `;
    
    const result = await db.query(query, [id, doctorId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registro médico no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medical record',
      error: error.message
    });
  }
});

// POST create new medical record
router.post('/api/v1/medical-records', auth, async (req, res) => {
  try {
    const { patient_id, diagnosis, treatment, medications, notes, record_date } = req.body;
    const doctorId = req.user.id;
    
    // Validate required fields
    if (!patient_id || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: patient_id, diagnosis'
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
      INSERT INTO medical_records (
        doctor_id,
        patient_id,
        diagnosis,
        treatment,
        medications,
        notes,
        record_date,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
    
    const result = await db.query(query, [
      doctorId,
      patient_id,
      diagnosis,
      treatment || null,
      medications || null,
      notes || null,
      record_date || new Date()
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Registro médico creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating medical record',
      error: error.message
    });
  }
});

// PUT update medical record
router.put('/api/v1/medical-records/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, treatment, medications, notes } = req.body;
    const doctorId = req.user.id;
    
    // Verify medical record exists and belongs to this doctor
    const recordCheck = await db.query(
      'SELECT id FROM medical_records WHERE id = $1 AND doctor_id = $2',
      [id, doctorId]
    );
    
    if (recordCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registro médico no encontrado o acceso denegado'
      });
    }
    
    const query = `
      UPDATE medical_records
      SET 
        diagnosis = COALESCE($1, diagnosis),
        treatment = COALESCE($2, treatment),
        medications = COALESCE($3, medications),
        notes = COALESCE($4, notes),
        updated_at = NOW()
      WHERE id = $5 AND doctor_id = $6
      RETURNING *
    `;
    
    const result = await db.query(query, [
      diagnosis || null,
      treatment || null,
      medications || null,
      notes || null,
      id,
      doctorId
    ]);
    
    res.json({
      success: true,
      message: 'Registro médico actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating medical record',
      error: error.message
    });
  }
});

// DELETE medical record
router.delete('/api/v1/medical-records/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;
    
    // Verify medical record exists and belongs to this doctor
    const recordCheck = await db.query(
      'SELECT id FROM medical_records WHERE id = $1 AND doctor_id = $2',
      [id, doctorId]
    );
    
    if (recordCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registro médico no encontrado o acceso denegado'
      });
    }
    
    await db.query(
      'DELETE FROM medical_records WHERE id = $1 AND doctor_id = $2',
      [id, doctorId]
    );
    
    res.json({
      success: true,
      message: 'Registro médico eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting medical record',
      error: error.message
    });
  }
});

module.exports = router;
