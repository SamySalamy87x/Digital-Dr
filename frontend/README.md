# Digital Dr - Frontend Application

> **Modern Healthcare Management Platform with AI Assistance**

**Developer:** Omar Rafael Pérez Gallardo (Samy Salamy)
**Email:** digitaldrstore@digitaldoctor.com
**Phone:** 4422861825
**Domains:** digitaldrqro.com.mx | digitaldrqro.com

---

## 📋 Project Overview

Digital Dr is a comprehensive healthcare management application featuring:
- Patient record management
- Appointment scheduling system
- Digital Dr GPT Assistant integration
- Abril Mental Health Helper for patients
- PayPal subscription management
- Mobile and web responsive design
- Futuristic UI with glass morphism effects
- Neon color scheme (turquoise, purple, pink)

---

## 🚀 Frontend Architecture

### Tech Stack
- **Framework:** React 18 + Next.js 14
- **Styling:** Tailwind CSS with custom neon theme
- **Animations:** Framer Motion
- **State Management:** Zustand
- **API Communication:** Axios with JWT authentication
- **Language:** TypeScript

### Project Structure
```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── (auth)/
│       └── login/
│           └── page.tsx    # Login page
├── components/
│   └── ui/
│       ├── GlassButton.tsx   # Glass morphism button
│       └── GlassCard.tsx     # Glass morphism card
├── lib/
│   ├── api.ts              # Axios client for backend API
│   └── store.ts            # Zustand stores
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind theme configuration
├── next.config.js          # Next.js configuration
├── postcss.config.js       # PostCSS plugins
└── .env.local              # Environment variables
```

---

## 🔗 Backend Integration

### API Connection
- **Base URL:** `http://localhost:5000/api/v1`
- **Authentication:** JWT Token-based
- **Interceptors:** Automatic token injection and 401 error handling

### Available API Endpoints

#### Authentication
- `POST /auth/register` - Doctor registration
- `POST /auth/login` - Doctor login
- `POST /auth/refresh` - Token refresh
- `POST /patients-auth/register` - Patient registration
- `POST /patients-auth/login` - Patient login

#### Patient Management
- `GET /patients` - List all patients
- `GET /patients/:id` - Get patient by ID
- `POST /patients` - Create new patient
- `PUT /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient
- `GET /search?query=` - Search patients

#### Appointments
- `GET /appointments` - List appointments
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

#### Medical Records
- `GET /medical-records?patientId=` - Get patient records
- `POST /medical-records` - Create record
- `PUT /medical-records/:id` - Update record

#### Doctors
- `GET /search?query=` - Search doctors
- `GET /doctors-availability/:id` - Get availability
- `PUT /doctors-availability` - Update availability

#### AI Assistants
- `POST /gpt` - Call Digital Dr or Abril Mental Helper

#### Notifications
- `POST /notifications` - Send notification
- `GET /notifications` - Get notifications

#### Subscriptions
- `POST /paypal` - Create PayPal subscription
- `GET /paypal/status` - Check subscription status

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend server running on `localhost:5000`

### Steps

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**
The `.env.local` file is already configured with:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_DEVELOPER_NAME=Omar Rafael Pérez Gallardo
NEXT_PUBLIC_DEVELOPER_EMAIL=digitaldrstore@digitaldoctor.com
NEXT_PUBLIC_DEVELOPER_PHONE=4422861825
NEXT_PUBLIC_APP_NAME=Digital Dr
NEXT_PUBLIC_APP_DESCRIPTION=Modern Healthcare Management Platform with AI Assistance
```

3. **Start Development Server**
```bash
npm run dev
```
Application will be available at `http://localhost:3000`

4. **Build for Production**
```bash
npm run build
npm start
```

---

## 🎨 Design System

### Color Palette (Neon Theme)
- **Turquoise (Primary):** `#00D9FF`
- **Purple (Secondary):** `#A855F7`
- **Pink (Accent):** `#EC4899`
- **Blue (Secondary):** `#0EA5E9`
- **Dark Base:** `#0F172A`

### Components
- **GlassButton:** Reusable button with glass morphism and Framer Motion animations
- **GlassCard:** Card component with backdrop blur effect
- **Login Form:** Connects to backend authentication

### Animations
- Fade-in effects
- Slide-in from different directions
- Pulse-glow for emphasis
- Spring physics with Framer Motion

---

## 📱 Features

### Implemented
- ✅ Configuration files (package.json, tsconfig, tailwind, next config)
- ✅ API client with JWT authentication
- ✅ Zustand state management store
- ✅ GlassButton UI component
- ✅ Environment variables setup
- ✅ Neon color theme configuration

### To Be Completed
- 📝 Root layout (app/layout.tsx)
- 📝 Home page (app/page.tsx)
- 📝 Login page (app/(auth)/login/page.tsx)
- 📝 GlassCard component
- 📝 Global styles with glass morphism
- 📝 Doctor dashboard
- 📝 Patient management interface
- 📝 Appointment scheduling UI
- 📝 Mobile responsive design

---

## 🔐 Security

- JWT token stored in localStorage
- Automatic token injection in all API requests
- Token refresh mechanism
- Auto-redirect to login on 401 Unauthorized
- Protected routes

---

## 📚 State Management (Zustand)

### Available Stores

1. **useAuthStore**
   - `user` - Current user object
   - `isLoading` - Loading state
   - `error` - Error message
   - Methods: `login()`, `logout()`, `setUser()`

2. **useAppStore**
   - `sidebarOpen` - Sidebar state
   - `theme` - Dark/Light theme
   - Methods: `setSidebarOpen()`, `setTheme()`

3. **usePatientsStore**
   - `patients` - List of patients
   - `currentPatient` - Selected patient
   - Methods: `setPatients()`, `setCurrentPatient()`, `addPatient()`

---

## 🚢 Deployment

### Prerequisites
1. Ensure backend is running and accessible
2. Update `.env.local` with production API URL
3. Build the application

### Deployment Steps
1. **Build:** `npm run build`
2. **Deploy to Hostinger:**
   - Upload `out/` folder (if static export)
   - Or use Next.js deployment recommendations
3. **Configure custom domain:**
   - Point DNS to hosting provider
   - Configure SSL certificate

### Environment for Production
```
NEXT_PUBLIC_API_URL=https://api.digitaldrqro.com
```

---

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running on `localhost:5000`
- Check network connectivity
- Verify API URLs in `.env.local`

### Token Errors
- Clear localStorage: `localStorage.clear()`
- Re-login to get new token

### Build Issues
- Delete `node_modules` and `.next`
- Run `npm install` and `npm run build` again

---

## 📞 Contact & Support

**Developer:** Omar Rafael Pérez Gallardo (Samy Salamy)
**Email:** digitaldrstore@digitaldoctor.com
**Phone:** 4422861825

**GPT Assistants:**
- Digital Dr: https://chatgpt.com/g/g-67c8ec28f8a0819185da1d361184409f-digital-dr
- Abril Mental Helper: https://chatgpt.com/g/g-hfKTdCmcI-abril-mental-helper

---

## 📄 License

Digital Dr - Healthcare Management Platform
Developer: Omar Rafael Pérez Gallardo

---

**Last Updated:** November 17, 2025
