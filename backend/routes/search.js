// routes/search.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Search doctors by specialty with pagination
router.get('/specialty', auth, async (req, res) => {
  try {
    const { specialty, limit = 10, offset = 0 } = req.query;

    // Validate input
    if (!specialty || specialty.trim() === '') {
      return res.status(400).json({ 
        error: 'La especialidad es requerida' 
      });
    }

    // Query to find doctors by specialty
    const query = `
      SELECT id, name, email, specialty, phone, bio, years_experience, profile_photo
      FROM doctors
      WHERE LOWER(specialty) LIKE LOWER($1) AND is_active = true
      ORDER BY years_experience DESC
      LIMIT $2 OFFSET $3
    `;

    const doctors = await db.query(query, [`%${specialty}%`, limit, offset]);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total FROM doctors
      WHERE LOWER(specialty) LIKE LOWER($1) AND is_active = true
    `;
    const countResult = await db.query(countQuery, [`%${specialty}%`]);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: doctors.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching doctors by specialty:', error);
    res.status(500).json({ error: 'Error en la busqueda de doctores por especialidad' });
  }
});

// Search doctors by location with pagination
router.get('/location', auth, async (req, res) => {
  try {
    const { city, state, limit = 10, offset = 0 } = req.query;

    // Validate input
    if (!city || city.trim() === '') {
      return res.status(400).json({ 
        error: 'La ciudad es requerida' 
      });
    }

    // Build dynamic query based on provided filters
    let whereClause = 'is_active = true';
    let params = [];
    let paramCount = 1;

    if (city && city.trim() !== '') {
      whereClause += ` AND LOWER(city) LIKE LOWER($${paramCount})`;
      params.push(`%${city}%`);
      paramCount++;
    }

    if (state && state.trim() !== '') {
      whereClause += ` AND LOWER(state) LIKE LOWER($${paramCount})`;
      params.push(`%${state}%`);
      paramCount++;
    }

    params.push(limit);
    params.push(offset);

    const query = `
      SELECT id, name, email, specialty, phone, bio, years_experience, city, state, profile_photo
      FROM doctors
      WHERE ${whereClause}
      ORDER BY name ASC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const doctors = await db.query(query, params);

    // Get total count
    const countParams = params.slice(0, -2);
    const countQuery = `
      SELECT COUNT(*) as total FROM doctors
      WHERE ${whereClause.replace(`LIMIT $${paramCount} OFFSET $${paramCount + 1}`, '')}
    `;
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: doctors.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching doctors by location:', error);
    res.status(500).json({ error: 'Error en la busqueda de doctores por ubicacion' });
  }
});

// Advanced search with filters
router.get('/filter', auth, async (req, res) => {
  try {
    const { specialty, rating_min = 0, years_min = 0, limit = 10, offset = 0 } = req.query;

    // Build dynamic filter query
    let whereClause = 'is_active = true';
    let params = [];
    let paramCount = 1;

    if (specialty && specialty.trim() !== '') {
      whereClause += ` AND LOWER(specialty) LIKE LOWER($${paramCount})`;
      params.push(`%${specialty}%`);
      paramCount++;
    }

    if (rating_min && rating_min > 0) {
      whereClause += ` AND rating >= $${paramCount}`;
      params.push(parseFloat(rating_min));
      paramCount++;
    }

    if (years_min && years_min > 0) {
      whereClause += ` AND years_experience >= $${paramCount}`;
      params.push(parseInt(years_min));
      paramCount++;
    }

    params.push(limit);
    params.push(offset);

    const query = `
      SELECT id, name, email, specialty, phone, bio, years_experience, rating, city, profile_photo
      FROM doctors
      WHERE ${whereClause}
      ORDER BY rating DESC, years_experience DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const doctors = await db.query(query, params);

    // Get total count
    const countParams = params.slice(0, -2);
    const countQuery = `
      SELECT COUNT(*) as total FROM doctors
      WHERE ${whereClause.replace(`LIMIT $${paramCount} OFFSET $${paramCount + 1}`, '')}
    `;
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: doctors.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / limit)
      },
      filters: {
        specialty: specialty || 'Todas',
        min_rating: rating_min,
        min_experience: years_min
      }
    });
  } catch (error) {
    console.error('Error in advanced search:', error);
    res.status(500).json({ error: 'Error en la busqueda avanzada' });
  }
});

// Get doctor profile with full details
router.get('/:doctorId', auth, async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Validate ID format
    if (!doctorId || isNaN(doctorId)) {
      return res.status(400).json({ error: 'ID de doctor invalido' });
    }

    const query = `
      SELECT id, name, email, specialty, phone, bio, years_experience, 
             rating, total_reviews, city, state, profile_photo, is_active, created_at
      FROM doctors
      WHERE id = $1 AND is_active = true
    `;

    const result = await db.query(query, [doctorId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor no encontrado' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ error: 'Error al obtener el perfil del doctor' });
  }
});

module.exports = router;
