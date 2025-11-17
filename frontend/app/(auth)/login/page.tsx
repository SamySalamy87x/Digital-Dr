'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import GlassButton from '@/components/ui/GlassButton';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.loginDoctor(email, password);
      const { token, doctor } = response.data;

      // Store token and user
      localStorage.setItem('token', token);
      login({ ...doctor, token });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={item} className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-turquoise to-neon-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Dr</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Digital Dr</h1>
          <p className="text-gray-400">Plataforma de Gestión Sanitaria</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          variants={item}
          onSubmit={handleLogin}
          className="glass p-8 rounded-2xl space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@example.com"
              className="w-full px-4 py-3 bg-dark-base/50 border border-neon-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-turquoise/60 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-dark-base/50 border border-neon-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-turquoise/60 transition-colors"
              required
            />
          </div>

          {error && (
            <motion.div
              variants={item}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={item} className="pt-4">
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </GlassButton>
          </motion.div>

          <motion.div variants={item} className="text-center text-sm text-gray-400">
            <p>
              ¿No tienes cuenta?{' '}
              <a href="#" className="text-neon-turquoise hover:text-neon-purple transition-colors">
                Regístrate aquí
              </a>
            </p>
          </motion.div>
        </motion.form>

        {/* Demo Credentials */}
        <motion.div variants={item} className="mt-8 p-4 glass rounded-lg text-center text-sm text-gray-400">
          <p className="font-medium text-neon-turquoise mb-2">Credenciales de Prueba</p>
          <p>Email: doctor@example.com</p>
          <p>Contraseña: password123</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
