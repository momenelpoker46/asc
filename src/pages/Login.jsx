import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('يرجى ملء جميع الحقول');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError('فشل تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور.');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            مرحباً بك مرة أخرى في منصة حلهالي
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="admin@halhali.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10 pr-10"
                placeholder="admin123"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>

          {/* Links */}
          <div className="text-center space-y-2">
            <Link
              to="/forgot-password"
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              نسيت كلمة المرور؟
            </Link>
            <div className="text-secondary-600 dark:text-secondary-400">
              ليس لديك حساب؟{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                سجل الآن
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
