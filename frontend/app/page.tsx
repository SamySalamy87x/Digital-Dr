'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassButton from '@/components/ui/GlassButton';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div variants={item} className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text leading-tight">
              Digital Dr
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Plataforma moderna de gestión sanitaria con asistencia IA. Conecta tus pacientes,
              gestiona citas y accede a registros médicos en tiempo real.
            </p>
            <div className="flex gap-4 pt-4">
              <GlassButton variant="primary" size="lg">
                Comenzar Ahora
              </GlassButton>
              <GlassButton variant="secondary" size="lg">
                Más Información
              </GlassButton>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            variants={item}
            className="relative h-96 rounded-lg glass overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-turquoise/20 to-neon-purple/20"></div>
            <div className="absolute top-8 right-8 w-32 h-32 bg-neon-turquoise/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-neon-purple/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl">🏥</div>
                <p className="text-neon-turquoise font-semibold">Healthcare Management</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.h2 variants={item} className="text-4xl font-bold gradient-text text-center mb-12">
          Características Principales
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Gestión de Pacientes',
              description: 'Administra perfiles completos con información de contacto y historial.',
              icon: '👥',
            },
            {
              title: 'Sistema de Citas',
              description: 'Programa y gestiona citas médicas de forma eficiente.',
              icon: '📅',
            },
            {
              title: 'Registros Médicos',
              description: 'Acceso rápido a historiales y documentación médica.',
              icon: '📋',
            },
            {
              title: 'Asistente IA',
              description: 'Digital Dr te ayuda con consultas y recomendaciones.',
              icon: '🤖',
            },
            {
              title: 'Soporte Mental',
              description: 'Abril Mental Helper para asistencia de salud mental.',
              icon: '💭',
            },
            {
              title: 'Notificaciones',
              description: 'Alertas en tiempo real para citas y actualizaciones.',
              icon: '🔔',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative glass p-8 rounded-xl hover:border-neon-turquoise/50 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-turquoise/0 to-neon-purple/0 group-hover:from-neon-turquoise/10 group-hover:to-neon-purple/10 rounded-xl transition-all duration-300"></div>
              <div className="relative z-10 space-y-4">
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-neon-turquoise">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 md:px-8 max-w-4xl mx-auto text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div variants={item} className="space-y-6 glass p-12 rounded-2xl">
          <h2 className="text-4xl font-bold gradient-text">
            ¿Listo para digitalizar tu práctica médica?
          </h2>
          <p className="text-xl text-gray-300">
            Únete a cientos de profesionales de la salud que ya confían en Digital Dr.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <GlassButton variant="primary" size="lg">
              Comenzar Gratis
            </GlassButton>
            <GlassButton variant="secondary" size="lg">
              Contactar Soporte
            </GlassButton>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
