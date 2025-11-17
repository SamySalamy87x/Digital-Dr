# Digital Dr - API Documentation

## 📋 Descripción General

API REST para la plataforma **Digital Dr** - Sistema de gestión de pacientes, citas y asistencia médica con IA para doctores.

**Desarrollador:** Omar Rafael Pérez Gallardo (Samy Salamy)
**Email:** digitaldrstore@digitaldoctor.com
**Teléfono:** 4422861825
**Dominios:** digitaldrqro.com.mx | digitaldrqro.com

---

## 🔐 Autenticación

Todos los endpoints (excepto auth) requieren un **JWT Token** en el header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📍 Endpoints

### 1. AUTENTICACIÓN (`/api/v1/auth`)

#### POST - Registrar Doctor
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "secure_password",
  "firstName": "Juan",
  "lastName": "Pérez",
  "specialization": "Cardiología",
  "licenseNumber": "MED123456",
  "phone": "+52 442 286 1825"
}

Response: 201 Created
{
  "status": "success",
  "message": "Doctor registrado exitosamente",
  "user": {...}
}
```

#### POST - Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "secure_password"
}

Response: 200 OK
{
  "status": "success",
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "doctor@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "specialization": "Cardiología",
    "role": "doctor"
  }
}
```

#### POST - Refrescar Token
```
POST /api/v1/auth/refresh
Authorization: Bearer <current_token>

Response: 200 OK
{
  "status": "success",
  "message": "Token refrescado",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST - Logout
```
POST /api/v1/auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "message": "Logout exitoso. Por favor elimina el token del cliente."
}
```

---

### 2. PACIENTES (`/api/v1/patients`)

#### GET - Listar Todos los Pacientes
```
GET /api/v1/patients
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "count": 15,
  "patients": [...]
}
```

#### POST - Crear Paciente
```
POST /api/v1/patients
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "María",
  "lastName": "García",
  "email": "maria@example.com",
  "phone": "+52 442 111 2222",
  "dateOfBirth": "1990-05-15",
  "gender": "F",
  "medicalHistory": "Diabetes tipo 2",
  "allergies": "Penicilina",
  "currentMedications": "Metformina 500mg"
}

Response: 201 Created
{
  "status": "success",
  "message": "Paciente creado exitosamente",
  "patient": {...}
}
```

#### GET - Obtener Paciente por ID
```
GET /api/v1/patients/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "patient": {...}
}
```

#### PUT - Actualizar Paciente
```
PUT /api/v1/patients/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "María",
  "lastName": "García",
  ... (campos a actualizar)
}

Response: 200 OK
{
  "status": "success",
  "message": "Paciente actualizado exitosamente",
  "patient": {...}
}
```

#### DELETE - Eliminar Paciente
```
DELETE /api/v1/patients/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "message": "Paciente eliminado exitosamente"
}
```

---

### 3. CITAS (EN DESARROLLO)

```
GET    /api/v1/appointments       - Listar citas
POST   /api/v1/appointments       - Crear cita
GET    /api/v1/appointments/:id   - Obtener cita
PUT    /api/v1/appointments/:id   - Actualizar cita
DELETE /api/v1/appointments/:id   - Eliminar cita
```

---

### 4. REGISTROS MÉDICOS (PRÓXIMAMENTE)

```
GET    /api/v1/medical-records       - Listar registros
POST   /api/v1/medical-records       - Crear registro
GET    /api/v1/medical-records/:id   - Obtener registro
```

---

### 5. INTEGRACIÓN GPT (PRÓXIMAMENTE)

```
POST   /api/v1/gpt/chat              - Chat con Digital Dr GPT
POST   /api/v1/gpt/mental-health     - Asistente de salud mental
GET    /api/v1/gpt/history           - Historial de interacciones
```

---

## 🔗 Integración

### Digital Dr GPT
**Link:** https://chatgpt.com/g/g-67c8ec28f8a0819185da1d361184409f-digital-dr

### Abril Mental Helper
**Link:** https://chatgpt.com/g/g-hfKTdCmcI-abril-mental-helper

---

## 💳 PayPal Integration

(En desarrollo)

---

## 🛠️ Stack Tecnológico

- **Backend:** Node.js + Express.js
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT + Bcryptjs
- **APIs Externas:** OpenAI, PayPal
- **Hosting:** Hostinger Business Starter

---

## 📌 Notas de Seguridad

✅ Todas las contraseñas están hasheadas con bcrypt
✅ Los tokens JWT expiran en 7 días
✅ Solo doctores pueden acceder a sus propios pacientes
✅ Validación de campos en todos los endpoints
✅ Manejo robusto de errores

---

**Última actualización:** 17 de noviembre, 2025
**Estado:** Phase 3 - Rutas de autenticación y pacientes completadas
