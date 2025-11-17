# Digital Dr

**Healthcare Management Platform for Doctors**

A comprehensive web and mobile application designed to help doctors manage patient records, appointments, medical histories, and leverage AI-powered assistance through custom GPT integrations.

---

## 📋 Project Overview

**Developer:** Omar Rafael Pérez Gallardo (Samy Salamy)
**Email:** digitaldrstore@digitaldoctor.com
**Domains:** 
- digitaldrqro.com.mx
- digitaldrqro.com
**Hosting:** Hostinger Business Starter
**License:** MIT

### Core Features

✅ **Patient Management**
- Complete patient records with medical history
- Appointment scheduling and calendar integration
- Patient information search and filtering

✅ **GPT-Powered Assistance**
- Digital Dr Custom GPT for medical insights
- Abril Mental Helper for mental health support
- Real-time AI recommendations

✅ **Medical Tools**
- Appointment management
- Medical history tracking
- Treatment notes and documentation
- Automated patient follow-ups

✅ **Monetization**
- PayPal integration for premium features
- Subscription management
- Access control via custom GPTs

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT + OAuth 2.0
- **API:** RESTful with Express

### Frontend
- **Framework:** React Native / React
- **UI Design:** Figma (components ready)
- **State Management:** Redux or Context API
- **Styling:** Tailwind CSS

### AI Integration
- **GPT Assistant:** Custom GPT - Digital Dr
- **Mental Health:** Abril Mental Helper GPT
- **API:** OpenAI API (GPT-4)

### Hosting & Deployment
- **Backend:** Heroku / Railway / AWS
- **Frontend:** Vercel / Netlify
- **Database:** AWS RDS (PostgreSQL)
- **Domain:** Hostinger

---

## 📁 Project Structure

```
Digital-Dr/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── routes/
│   │   ├── doctors.js
│   │   ├── patients.js
│   │   ├── appointments.js
│   │   └── gpt.js
│   ├── controllers/
│   ├── middleware/
│   └── db/
│       └── schema.sql
├── frontend/
│   ├── App.js
│   ├── screens/
│   ├── components/
│   └── services/
├── figma/
│   └── designs/ (All UI components)
├── docs/
│   ├── API.md
│   ├─┐ SETUP.md
│   └── DATABASE.md
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- Git
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SamySalamy87x/Digital-Dr.git
cd Digital-Dr/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/digital_dr
OPENAI_API_KEY=sk-...
JWT_SECRET=your_jwt_secret_key
PAYPAL_CLIENT_ID=your_paypal_id
PAYPAL_SECRET=your_paypal_secret
EOF

# Start development server
npm run dev
```

---

## 📊 Database Schema

```sql
-- Doctors table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(100),
  license_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  doctor_id INT REFERENCES doctors(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  medical_history TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  doctor_id INT REFERENCES doctors(id),
  patient_id INT REFERENCES patients(id),
  appointment_date TIMESTAMP NOT NULL,
  duration INT DEFAULT 30,
  status VARCHAR(20) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GPT Conversations
CREATE TABLE gpt_conversations (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES patients(id),
  doctor_id INT REFERENCES doctors(id),
  message TEXT NOT NULL,
  response TEXT,
  gpt_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🤖 Custom GPTs

### Digital Dr GPT
- **URL:** https://chatgpt.com/g/g-67c8ec28f8a0819185da1d361184409f-digital-dr
- **Access:** Private with PayPal integration
- **Purpose:** Medical insights and diagnostic assistance

### Abril Mental Helper
- **URL:** https://chatgpt.com/g/g-hfKTdCmcI-abril-mental-helper
- **Access:** Public
- **Purpose:** Mental health support and recommendations

---

## 💳 Payment Integration

### PayPal Setup
1. Integrate PayPal API for subscription management
2. Link premium features to Digital Dr GPT access
3. Automatic renewal handling
4. Invoice generation

---

## 📈 Roadmap

### Phase 1: Backend Foundation (Week 1-2)
- [ ] Express server setup
- [ ] PostgreSQL configuration
- [ ] JWT authentication
- [ ] Basic API routes

### Phase 2: Core Features (Week 2-3)
- [ ] Patient management API
- [ ] Appointment system
- [ ] Medical history storage
- [ ] User authentication

### Phase 3: GPT Integration (Week 3-4)
- [ ] Digital Dr GPT integration
- [ ] Abril Mental Helper integration
- [ ] Conversation logging
- [ ] AI recommendations engine

### Phase 4: Frontend (Week 4-5)
- [ ] React/React Native setup
- [ ] Figma design implementation
- [ ] API integration
- [ ] Authentication UI

### Phase 5: Monetization (Week 5-6)
- [ ] PayPal integration
- [ ] Subscription management
- [ ] Billing dashboard
- [ ] Access control

### Phase 6: Deployment (Week 6-7)
- [ ] Backend deployment (Heroku/Railway)
- [ ] Frontend deployment (Vercel)
- [ ] Database setup (AWS RDS)
- [ ] Domain configuration

### Phase 7: Testing & Launch (Week 7-8)
- [ ] QA testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Public launch

---

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Environment variable protection
- CORS configuration
- SQL injection prevention
- Rate limiting
- HIPAA compliance considerations

---

## 📞 Contact & Support

**Developer:** Omar Rafael Pérez Gallardo
**Email:** digitaldrstore@digitaldoctor.com
**Phone:** +52 442-286-1825
**Domains:**
- digitaldrqro.com.mx
- digitaldrqro.com

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙌 Acknowledgments

- Custom GPT development by Digital Dr team
- UI/UX design in Figma
- Built with Node.js, React, and PostgreSQL
- Powered by OpenAI API

---

**Status:** Active Development 🚀
**Last Updated:** November 17, 2025
