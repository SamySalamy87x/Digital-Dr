'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { GlassButton } from './ui/GlassButton';

const PLANS = [
  {
    id: 'freemium',
    name: 'Freemium',
    alias: 'Plan Gratuito',
    price: 0,
    description: 'Perfecto para probar',
    features: [
      'Máximo 5 pacientes',
      'Registros médicos básicos',
      'Gestor de citas simple',
      'Sin acceso a Asistente GPT',
      'Sin Abril Mental Helper',
      'Almacenamiento 1 GB'
    ],
    popular: false,
    cta: 'Comenzar Gratis'
  },
  {
    id: 'basico',
    name: 'Básico',
    price: 199,
    description: 'Para doctores independientes',
    features: [
      'Hasta 50 pacientes',
      'Registros médicos completos',
      'Gestor de citas inteligente',
      'Asistente GPT avanzado',
      'Abril Mental Helper con voz Maya',
      'Búsqueda de doctores',
      'Almacenamiento 10 GB',
      'Soporte por email'
    ],
    popular: false,
    cta: 'Suscribirse Ahora'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 499,
    description: 'Todas las funciones con avatar',
    features: [
      'Hasta 200 pacientes',
      'Registros médicos avanzados',
      'Citas con notificaciones inteligentes',
      'Asistente GPT con contexto médico',
      'Abril + voz clonada + avatar HeyGen',
      'Analytics avanzados',
      'Almacenamiento 100 GB',
      'Soporte prioritario 24/7'
    ],
    popular: true,
    cta: 'Suscribirse Ahora'
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    price: null,
    description: 'Para clínicas y hospitales',
    features: [
      'Pacientes ilimitados',
      'Acceso API completo',
      'Branding personalizado',
      'Integración SSO/LDAP',
      'Todos los features Premium',
      'Almacenamiento ilimitado',
      'Soporte dedicado 24/7',
      'SLA 99.9% garantizado'
    ],
    popular: false,
    cta: 'Contactar Ventas'
  }
];

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <section className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-turquoise/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-neon-turquoise via-neon-purple to-neon-pink bg-clip-text text-transparent">
            Planes para Cada Necesidad
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Elige el plan perfecto para tu práctica médica. Desde doctores independientes hasta grandes clínicas.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-neon-turquoise text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-neon-turquoise text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Anual (10% desc.)
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {PLANS.map((plan) => (
            <motion.div key={plan.id} variants={cardVariants}>
              <GlassCard 
                className={`h-full flex flex-col p-8 ${
                  plan.popular ? 'border-2 border-neon-turquoise lg:scale-105' : ''
                }`}
                variant={plan.popular ? 'primary' : 'secondary'}
              >
                {plan.popular && (
                  <div className="mb-4 inline-block">
                    <span className="bg-gradient-to-r from-neon-turquoise to-neon-purple px-3 py-1 rounded-full text-sm font-semibold text-black">
                      Más Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  {plan.price !== null ? (
                    <>
                      <span className="text-5xl font-bold text-neon-turquoise">
                        ${plan.price}
                      </span>
                      <span className="text-slate-400 ml-2">/mes</span>
                      {billingCycle === 'annual' && (
                        <p className="text-sm text-neon-pink mt-2">
                          ${Math.round(plan.price * 12 * 0.9)}/año
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-3xl font-bold text-neon-purple">
                      Personalizado
                    </div>
                  )}
                </div>

                <GlassButton 
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full mb-8 font-semibold"
                >
                  {plan.cta}
                </GlassButton>

                {/* Features List */}
                <div className="flex-grow">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-4">Incluye:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-300">
                        <span className="inline-block w-5 h-5 mr-3 mt-0.5">
                          <svg className="w-full h-full text-neon-turquoise" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ or CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <p className="text-slate-300 mb-6">
            ¿No encuentras lo que necesitas? 
          </p>
          <GlassButton variant="primary" className="inline-block">
            Contacta a Nuestro Equipo
          </GlassButton>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
