import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Phone, Mail, GraduationCap } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    email: '',
    grade: '',
    track: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const grades = [
    'الاول الاعدادي',
    'الثاني الاعدادي', 
    'الثالث الاعدادي',
    'الاول الثانوي',
    'الثاني الثانوي',
    'الثالث الثانوي'
  ];

  const secondaryTracks = ['علمي', 'ادبي'];
  const thirdTracks = ['علمي علوم', 'علمي رياضة', 'ادبي'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      // Validation for each step
      if (step === 1) {
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
          setError('يرجى ملء جميع الحقول المطلوبة');
          return;
        }
      } else if (step === 2) {
        if (!formData.grade) {
          setError('يرجى اختيار المرحلة الدراسية');
          return;
        }
        if ((formData.grade === 'الثاني الثانوي' || formData.grade === 'الثالث الثانوي') && !formData.track) {
          setError('يرجى اختيار التخصص');
          return;
        }
      }
      
      setError('');
      setStep(step + 1);
      return;
    }

    // Final step validation
    if (!formData.password || !formData.confirmPassword) {
      setError('يرجى ملء كلمة المرور وتأكيدها');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقتين');
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(formData);
    
    if (result.success) {
      navigate('/pricing');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGradeChange = (grade) => {
    setFormData({
      ...formData,
      grade: grade,
      track: '' // Reset track when grade changes
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
            الاسم الأول *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="الاسم الأول"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
            الاسم الأوسط
          </label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            className="input-field"
            placeholder="الاسم الأوسط"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          الاسم الأخير *
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="input-field"
          placeholder="الاسم الأخير"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          رقم الهاتف *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field pl-10"
            placeholder="رقم الهاتف"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          البريد الإلكتروني *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field pl-10"
            placeholder="البريد الإلكتروني"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          المرحلة الدراسية *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {grades.map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => handleGradeChange(grade)}
              className={`p-4 text-right rounded-lg border-2 transition-all duration-200 ${
                formData.grade === grade
                  ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'border-secondary-300 bg-white hover:border-secondary-400 dark:border-secondary-600 dark:bg-secondary-800 dark:hover:border-secondary-500'
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <GraduationCap className="w-5 h-5" />
                <span className="font-medium">{grade}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {(formData.grade === 'الثاني الثانوي') && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
            التخصص *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {secondaryTracks.map((track) => (
              <button
                key={track}
                type="button"
                onClick={() => setFormData({...formData, track})}
                className={`p-4 text-center rounded-lg border-2 transition-all duration-200 ${
                  formData.track === track
                    ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'border-secondary-300 bg-white hover:border-secondary-400 dark:border-secondary-600 dark:bg-secondary-800 dark:hover:border-secondary-500'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>
      )}

      {(formData.grade === 'الثالث الثانوي') && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
            التخصص *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {thirdTracks.map((track) => (
              <button
                key={track}
                type="button"
                onClick={() => setFormData({...formData, track})}
                className={`p-4 text-center rounded-lg border-2 transition-all duration-200 ${
                  formData.track === track
                    ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'border-secondary-300 bg-white hover:border-secondary-400 dark:border-secondary-600 dark:bg-secondary-800 dark:hover:border-secondary-500'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          كلمة المرور *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field pr-10"
            placeholder="ادخل كلمة المرور"
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          تأكيد كلمة المرور *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field pr-10"
            placeholder="تأكيد كلمة المرور"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 p-4 rounded-lg dark:bg-green-900/20 dark:border-green-800">
        <p className="text-green-700 dark:text-green-400 text-sm">
          بعد إنشاء حسابك، ستتمكن من الاشتراك في إحدى الباقات للوصول إلى جميع الامتحانات.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            انضم إلى منصة حلهالي واستمتع بتجربة تعليمية مميزة
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 space-x-reverse">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-300 text-secondary-600 dark:bg-secondary-700 dark:text-secondary-400'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-12 h-1 ${
                    step > stepNumber
                      ? 'bg-primary-600'
                      : 'bg-secondary-300 dark:bg-secondary-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-secondary px-6 py-3"
              >
                السابق
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed mr-auto"
            >
              {loading 
                ? 'جاري الإنشاء...' 
                : step === 3 
                  ? 'إنشاء الحساب' 
                  : 'التالي'
              }
            </button>
          </div>

          {/* Login Link */}
          {step === 1 && (
            <div className="text-center text-secondary-600 dark:text-secondary-400">
              لديك حساب بالفعل؟{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                تسجيل الدخول
              </Link>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
