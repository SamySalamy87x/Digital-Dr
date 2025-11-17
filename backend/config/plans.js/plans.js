// Digital Dr - Subscription Plans Configuration
// Planes de suscripción para doctores y acceso a Abril Mental Helper

const plans = {
  // Plan FREEMIUM - Acceso limitado, gratis
  freemium: {
    id: 'plan_freemium_digitaldr',
    name: 'Freemium',
    alias: 'Plan Gratuito',
    description: 'Plan gratuito para probar Digital Dr',
    price: 0,
    currency: 'MXN',
    billing_cycle: 'monthly',
    features: {
      max_patients: 5,
      medical_records: true,
      appointments: true,
      gpt_assistant: false,
      abril_mental_helper: false,
      doctor_search: false,
      voice_agent: false,
      avatar_premium: false,
      priority_support: false,
      custom_branding: false,
      api_access: false,
      max_storage_gb: 1
    },
    limitations: [
      'Máximo 5 pacientes',
      'Sin acceso a Asistente GPT',
      'Sin Abril Mental Helper',
      'Búsqueda de doctores limitada',
      'Sin soporte prioritario'
    ]
  },

  // Plan BÁSICO - Funcionalidades principales
  basico: {
    id: 'plan_basico_digitaldr',
    name: 'Básico',
    alias: 'Plan Básico',
    description: 'Plan esencial para doctores independientes',
    price: 199,
    currency: 'MXN',
    billing_cycle: 'monthly',
    paypal_plan_id: process.env.PAYPAL_PLAN_BASICO,
    features: {
      max_patients: 50,
      medical_records: true,
      appointments: true,
      gpt_assistant: true,
      abril_mental_helper: true,
      doctor_search: true,
      voice_agent: false,
      avatar_premium: false,
      priority_support: false,
      custom_branding: false,
      api_access: false,
      max_storage_gb: 10
    },
    benefits: [
      'Hasta 50 pacientes',
      'Registros médicos completos',
      'Gestor de citas inteligente',
      'Asistente GPT avanzado',
      'Abril Mental Helper con voz de Maya',
      'Búsqueda de doctores activada',
      'Almacenamiento 10 GB',
      'Soporte por email'
    ]
  },

  // Plan PREMIUM - Todas las funcionalidades con avatar
  premium: {
    id: 'plan_premium_digitaldr',
    name: 'Premium',
    alias: 'Plan Premium',
    description: 'Plan completo con avatar y voz premium de HeyGen',
    price: 499,
    currency: 'MXN',
    billing_cycle: 'monthly',
    paypal_plan_id: process.env.PAYPAL_PLAN_PREMIUM,
    features: {
      max_patients: 200,
      medical_records: true,
      appointments: true,
      gpt_assistant: true,
      abril_mental_helper: true,
      doctor_search: true,
      voice_agent: true,
      avatar_premium: true,
      priority_support: true,
      custom_branding: false,
      api_access: false,
      max_storage_gb: 100
    },
    benefits: [
      'Hasta 200 pacientes',
      'Todos los registros médicos avanzados',
      'Gestor de citas con notificaciones inteligentes',
      'Asistente GPT con contexto médico',
      'Abril Mental Helper con voz clonada personal',
      'Avatar HeyGen para video respuestas',
      'Almacenamiento 100 GB',
      'Reportes analíticos avanzados',
      'Soporte prioritario 24/7',
      'Integración con redes sociales'
    ]
  },

  // Plan EMPRESARIAL - Para clínicas y hospitales
  empresarial: {
    id: 'plan_empresarial_digitaldr',
    name: 'Empresarial',
    alias: 'Plan Empresarial',
    description: 'Plan personalizado para clínicas, hospitales y redes médicas',
    price: null,
    currency: 'MXN',
    billing_cycle: 'annual',
    custom_pricing: true,
    paypal_plan_id: process.env.PAYPAL_PLAN_EMPRESARIAL,
    features: {
      max_patients: null,
      medical_records: true,
      appointments: true,
      gpt_assistant: true,
      abril_mental_helper: true,
      doctor_search: true,
      voice_agent: true,
      avatar_premium: true,
      priority_support: true,
      custom_branding: true,
      api_access: true,
      max_storage_gb: null
    },
    benefits: [
      'Pacientes ilimitados',
      'Acceso API completo',
      'Usuarios administradores ilimitados',
      'Branding personalizado completo',
      'Integración SSO/LDAP',
      'Soporte técnico dedicado 24/7',
      'Servicio en la nube escalable sin límites',
      'Analytics y reportes avanzados',
      'Capacitación y onboarding personalizado',
      'SLA garantizado 99.9%',
      'Migración de datos asistida',
      'Cumplimiento HIPAA/RGPD garantizado'
    ]
  }
};

// Funciones helper para obtener planes
const getPlanByName = (planName) => {
  return plans[planName.toLowerCase()] || null;
};

const getPlanById = (planId) => {
  return Object.values(plans).find(plan => plan.id === planId) || null;
};

const getAllPlans = () => {
  return plans;
};

const getPlanFeatures = (planName) => {
  const plan = getPlanByName(planName);
  return plan ? plan.features : null;
};

const hasPlanFeature = (planName, feature) => {
  const plan = getPlanByName(planName);
  return plan ? plan.features[feature] === true : false;
};

module.exports = {
  plans,
  getPlanByName,
  getPlanById,
  getAllPlans,
  getPlanFeatures,
  hasPlanFeature
};
