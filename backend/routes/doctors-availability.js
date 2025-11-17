// routes/doctors-availability.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Middleware to ensure only doctors can access these routes
const doctorOnly = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Acceso denegado. Solo doctores pueden acceder.' });
  }
  next();
};

// Set doctor specialties
router.post('/specialties', auth, doctorOnly, async (req, res) => {
  try {
    const { specialties } = req.body;
    const doctorId = req.user.id;

    // Validate input
    if (!specialties || !Array.isArray(specialties) || specialties.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos una especialidad' });
    }

    // Convert to comma-separated string
    const specialtyString = specialties.join(',');

    // Update doctor specialties
    const query = `
      UPDATE doctors
      SET specialty = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, specialty
    `;

    const result = await db.query(query, [specialtyString, doctorId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor no encontrado' });
    }

    res.json({
      success: true,
      message: 'Especialidades actualizadas correctamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating specialties:', error);
    res.status(500).json({ error: 'Error al actualizar especialidades' });
  }
});

// Get doctor specialties
router.get('/specialties', auth, doctorOnly, async (req, res) => {
  try {
    const doctorId = req.user.id;

    const query = `
      SELECT specialty FROM doctors WHERE id = $1
    `;

    const result = await db.query(query, [doctorId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor no encontrado' });
    }

    const specialties = result.rows[0].specialty ? result.rows[0].specialty.split(',').map(s => s.trim()) : [];

    res.json({
      success: true,
      data: specialties
    });
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({ error: 'Error al obtener especialidades' });
  }
});

// Set work hours (availability schedule)
router.post('/hours', auth, doctorOnly, async (req, res) => {
  try {
    const { day, start_time, end_time } = req.body;
    const doctorId = req.user.id;

    // Validate input
    if (!day || !start_time || !end_time) {
      return res.status(400).json({ error: 'Dia, hora de inicio y fin son requeridos' });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return res.status(400).json({ error: 'Formato de hora invalido (HH:MM)' });
    }

    // Validate day name
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ error: 'Dia invalido' });
    }

    // Check if already exists
    const checkQuery = `
      SELECT id FROM doctor_availability
      WHERE doctor_id = $1 AND day_of_week = $2
    `;

    const existingRecord = await db.query(checkQuery, [doctorId, day]);

    if (existingRecord.rows.length > 0) {
      // Update existing
      const updateQuery = `
        UPDATE doctor_availability
        SET start_time = $1, end_time = $2, updated_at = NOW()
        WHERE doctor_id = $3 AND day_of_week = $4
        RETURNING *
      `;

      const result = await db.query(updateQuery, [start_time, end_time, doctorId, day]);
      return res.json({
        success: true,
        message: 'Horario actualizado',
        data: result.rows[0]
      });
    }

    // Insert new record
    const insertQuery = `
      INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await db.query(insertQuery, [doctorId, day, start_time, end_time]);

    res.status(201).json({
      success: true,
      message: 'Horario creado correctamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error setting work hours:', error);
    res.status(500).json({ error: 'Error al establecer horario de trabajo' });
  }
});

// Get doctor's work hours
router.get('/hours', auth, doctorOnly, async (req, res) => {
  try {
    const doctorId = req.user.id;

    const query = `
      SELECT id, day_of_week, start_time, end_time, updated_at
      FROM doctor_availability
      WHERE doctor_id = $1
      ORDER BY 
        CASE day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END
    `;

    const result = await db.query(query, [doctorId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching work hours:', error);
    res.status(500).json({ error: 'Error al obtener horarios de trabajo' });
  }
});

// Delete work hours for a specific day
router.delete('/hours/:day', auth, doctorOnly, async (req, res) => {
  try {
    const { day } = req.params;
    const doctorId = req.user.id;

    // Validate day name
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ error: 'Dia invalido' });
    }

    const query = `
      DELETE FROM doctor_availability
      WHERE doctor_id = $1 AND day_of_week = $2
      RETURNING id
    `;

    const result = await db.query(query, [doctorId, day]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado para ese dia' });
    }

    res.json({
      success: true,
      message: 'Horario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error deleting work hours:', error);
    res.status(500).json({ error: 'Error al eliminar horario de trabajo' });
  }
});

// Check doctor availability for a specific date/time
router.get('/check/:doctorId', auth, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, time } = req.query;

    // Validate inputs
    if (!date || !time) {
      return res.status(400).json({ error: 'Fecha y hora son requeridas' });
    }

    // Parse date and get day of week
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: 'Formato de fecha invalido' });
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[dateObj.getDay()];

    // Check availability for this day
    const query = `
      SELECT * FROM doctor_availability
      WHERE doctor_id = $1 AND day_of_week = $2
    `;

    const result = await db.query(query, [doctorId, dayOfWeek]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        available: false,
        message: 'Doctor no disponible ese dia'
      });
    }

    // Check if time falls within working hours
    const availability = result.rows[0];
    const available = time >= availability.start_time && time <= availability.end_time;

    res.json({
      success: true,
      available,
      day_of_week: dayOfWeek,
      start_time: availability.start_time,
      end_time: availability.end_time,
      message: available ? 'Doctor disponible' : 'Doctor no disponible a esa hora'
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Error al verificar disponibilidad' });
  }
});

module.exports = router;
