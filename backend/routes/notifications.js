// routes/notifications.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const db = require('../config/database');
const auth = require('../middleware/auth');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Helper function to send email
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send appointment confirmation email to patient
router.post('/appointment/confirm', auth, async (req, res) => {
  try {
    const { patientEmail, patientName, doctorName, appointmentDate, appointmentTime } = req.body;

    // Validate inputs
    if (!patientEmail || !patientName || !doctorName || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirmacion de Cita Medica</h2>
        <p>Hola <strong>${patientName}</strong>,</p>
        <p>Tu cita ha sido confirmada. Aqui estan los detalles:</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Fecha:</strong> ${appointmentDate}</p>
          <p><strong>Hora:</strong> ${appointmentTime}</p>
        </div>
        <p>Por favor, arrive 10 minutos antes de la cita.</p>
        <p>Si necesitas cancelar o reprogramar, contacta a nuestro equipo.</p>
        <p>Saludos,<br>Digital Dr</p>
      </div>
    `;

    const emailSent = await sendEmail(patientEmail, 'Confirmacion de Cita - Digital Dr', htmlContent);

    res.json({
      success: true,
      message: emailSent ? 'Correo de confirmacion enviado' : 'Error al enviar correo'
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ error: 'Error al enviar confirmacion' });
  }
});

// Send appointment reminder email (24 hours before)
router.post('/appointment/reminder', auth, async (req, res) => {
  try {
    const { patientEmail, patientName, doctorName, appointmentDate, appointmentTime } = req.body;

    // Validate inputs
    if (!patientEmail || !patientName || !doctorName || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Recordatorio de Cita Medica</h2>
        <p>Hola <strong>${patientName}</strong>,</p>
        <p>Este es un recordatorio de tu cita medica mañana:</p>
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Fecha:</strong> ${appointmentDate}</p>
          <p><strong>Hora:</strong> ${appointmentTime}</p>
        </div>
        <p>Por favor, arrive 10 minutos antes de la cita.</p>
        <p>Si no puedes asistir, por favor cancela con anticipacion.</p>
        <p>Saludos,<br>Digital Dr</p>
      </div>
    `;

    const emailSent = await sendEmail(patientEmail, 'Recordatorio de Cita - Digital Dr', htmlContent);

    res.json({
      success: true,
      message: emailSent ? 'Correo de recordatorio enviado' : 'Error al enviar correo'
    });
  } catch (error) {
    console.error('Error sending reminder email:', error);
    res.status(500).json({ error: 'Error al enviar recordatorio' });
  }
});

// Send appointment cancellation email
router.post('/appointment/cancel', auth, async (req, res) => {
  try {
    const { patientEmail, patientName, doctorName, appointmentDate, appointmentTime, reason } = req.body;

    // Validate inputs
    if (!patientEmail || !patientName || !doctorName || !appointmentDate) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Cancelacion de Cita Medica</h2>
        <p>Hola <strong>${patientName}</strong>,</p>
        <p>Tu cita ha sido cancelada.</p>
        <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545;">
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Fecha de la cita:</strong> ${appointmentDate}</p>
          ${appointmentTime ? `<p><strong>Hora de la cita:</strong> ${appointmentTime}</p>` : ''}
          ${reason ? `<p><strong>Razon:</strong> ${reason}</p>` : ''}
        </div>
        <p>Si deseas programar una nueva cita, por favor contacta a nuestro equipo.</p>
        <p>Saludos,<br>Digital Dr</p>
      </div>
    `;

    const emailSent = await sendEmail(patientEmail, 'Cancelacion de Cita - Digital Dr', htmlContent);

    res.json({
      success: true,
      message: emailSent ? 'Correo de cancelacion enviado' : 'Error al enviar correo'
    });
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    res.status(500).json({ error: 'Error al enviar cancelacion' });
  }
});

// Send doctor notification for new appointment
router.post('/doctor/new-appointment', auth, async (req, res) => {
  try {
    const { doctorEmail, doctorName, patientName, appointmentDate, appointmentTime } = req.body;

    // Validate inputs
    if (!doctorEmail || !doctorName || !patientName || !appointmentDate) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nueva Cita Agendada</h2>
        <p>Hola <strong>${doctorName}</strong>,</p>
        <p>Una nueva cita ha sido agendada en tu calendario:</p>
        <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8;">
          <p><strong>Paciente:</strong> ${patientName}</p>
          <p><strong>Fecha:</strong> ${appointmentDate}</p>
          ${appointmentTime ? `<p><strong>Hora:</strong> ${appointmentTime}</p>` : ''}
        </div>
        <p>Asegurate de revisar los detalles del paciente antes de la cita.</p>
        <p>Saludos,<br>Digital Dr</p>
      </div>
    `;

    const emailSent = await sendEmail(doctorEmail, 'Nueva Cita Agendada - Digital Dr', htmlContent);

    res.json({
      success: true,
      message: emailSent ? 'Notificacion de cita enviada' : 'Error al enviar notificacion'
    });
  } catch (error) {
    console.error('Error sending doctor notification:', error);
    res.status(500).json({ error: 'Error al enviar notificacion' });
  }
});

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query;
    if (userRole === 'doctor') {
      query = `
        SELECT * FROM notifications
        WHERE doctor_id = $1 OR is_general = true
        ORDER BY created_at DESC
        LIMIT 20
      `;
    } else {
      query = `
        SELECT * FROM notifications
        WHERE patient_id = $1 OR is_general = true
        ORDER BY created_at DESC
        LIMIT 20
      `;
    }

    const result = await db.query(query, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;

    const query = `
      UPDATE notifications
      SET is_read = true, read_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await db.query(query, [notificationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notificacion no encontrada' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Error al marcar notificacion como leida' });
  }
});

module.exports = router;
