'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Digital Dr - Healthcare Management',
  description: 'Modern Healthcare Platform with AI Assistance',
  keywords: 'healthcare, medical, appointments, patient records, AI assistant',
};

// Navigation Component
function Navigation() {
  const navItems = ['Pacientes', 'Citas', 'Registros', 'AI Asistente', 'Perfil'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-dark-base/30 border-b border-neon-turquoise/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-neon-turquoise to-neon-purple rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Dr</span>
          </div>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-turquoise to-neon-purple">
            Digital Dr
          </span>
        </motion.div>

        {/* Nav Items */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item}
              href="#"
              className="text-gray-300 hover:text-neon-turquoise transition-colors"
              whileHover={{ y: -2 }}
              transition={{ delay: index * 0.05 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          className="px-6 py-2 bg-gradient-to-r from-neon-turquoise/10 to-neon-blue/10 border border-neon-turquoise/50 text-neon-turquoise rounded-lg font-medium hover:shadow-lg hover:shadow-neon-turquoise/50 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ingresar
        </motion.button>
      </div>
    </nav>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="mt-20 border-t border-neon-turquoise/20 bg-dark-base/50 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
        <p>
          Digital Dr © 2025 | Desarrollado por{' '}
          <span className="text-neon-turquoise font-semibold">Omar Rafael Pérez Gallardo</span>
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Plataforma moderna de gestión sanitaria con asistencia IA
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-dark-base text-white overflow-x-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-turquoise/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="pt-24 min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
