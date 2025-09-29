import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  CreditCard, 
  BarChart3,
  Calendar,
  Trophy,
  TrendingUp,
  Eye,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { faker } from '@faker-js/faker';

const Account = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Mock data for exam attempts and analytics
  const examAttempts = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    examTitle: `امتحان ${['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء'][index % 4]}`,
    subject: ['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء'][index % 4],
    score: faker.number.float({ min: 60, max: 100, fractionDigits: 1 }),
    totalScore: 100,
    date: faker.date.recent({ days: 30 }),
    duration: faker.number.int({ min: 45, max: 120 }),
    questionsCount: faker.number.int({ min: 20, max: 50 })
  }));

  const subjectAnalytics = [
    { subject: 'الرياضيات', attempts: 15, avgScore: 85.5, strength: 'قوي', trend: 'up' },
    { subject: 'الفيزياء', attempts: 12, avgScore: 78.2, strength: 'جيد', trend: 'up' },
    { subject: 'الكيمياء', attempts: 10, avgScore: 72.8, strength: 'متوسط', trend: 'down' },
    { subject: 'الأحياء', attempts: 8, avgScore: 89.1, strength: 'ممتاز', trend: 'up' }
  ];

  const paymentRequests = [
    {
      id: 1,
      amount: 80,
      plan: 'الباقة المميزة',
      status: 'approved',
      date: '2025-01-10',
      transferNumber: 'TXN123456789'
    },
    {
      id: 2,
      amount: 120,
      plan: 'الباقة الذهبية',
      status: 'pending',
      date: '2025-01-15',
      transferNumber: 'TXN987654321'
    }
  ];

  const handleProfileSave = () => {
    // Here you would normally send the data to your API
    setEditingProfile(false);
    // Show success message
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'مقبول';
      case 'pending': return 'قيد المراجعة';
      case 'rejected': return 'مرفوض';
      default: return 'غير محدد';
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'ممتاز': return 'text-green-600';
      case 'قوي': return 'text-blue-600';
      case 'جيد': return 'text-yellow-600';
      case 'متوسط': return 'text-orange-600';
      case 'ضعيف': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'attempts', label: 'محاولاتي', icon: Trophy },
    { id: 'analytics', label: 'التحليلات', icon: TrendingUp },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
    { id: 'payments', label: 'المدفوعات', icon: CreditCard }
  ];

  if (!user) {
    return (
      <div className="text-center py-20">
        <User className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          يجب تسجيل الدخول أولاً
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {user.firstName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              {user.grade} - {user.track}
            </p>
            {user.subscription?.active && (
              <div className="mt-2">
                <span className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                  {user.subscription.plan} - ينتهي في {user.subscription.expiresAt}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-0 overflow-hidden">
        <div className="border-b border-secondary-200 dark:border-secondary-700">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-2">
                    إجمالي المحاولات
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {examAttempts.length}
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-400 mb-2">
                    متوسط الدرجات
                  </h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {(examAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / examAttempts.length).toFixed(1)}%
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-400 mb-2">
                    أفضل درجة
                  </h3>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.max(...examAttempts.map(a => a.score)).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Recent Attempts */}
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                  آخر المحاولات
                </h3>
                <div className="space-y-3">
                  {examAttempts.slice(0, 5).map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-secondary-900 dark:text-white">
                          {attempt.examTitle}
                        </h4>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {attempt.date.toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                          {attempt.score.toFixed(1)}%
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-secondary-400">
                          {attempt.duration} دقيقة
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Attempts Tab */}
          {activeTab === 'attempts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                جميع محاولات الامتحانات
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50 dark:bg-secondary-800">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-secondary-900 dark:text-white">
                        الامتحان
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-secondary-900 dark:text-white">
                        الدرجة
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-secondary-900 dark:text-white">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-secondary-900 dark:text-white">
                        المدة
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-secondary-900 dark:text-white">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                    {examAttempts.map((attempt) => (
                      <tr key={attempt.id}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-secondary-900 dark:text-white">
                              {attempt.examTitle}
                            </div>
                            <div className="text-sm text-secondary-600 dark:text-secondary-400">
                              {attempt.subject}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                            {attempt.score.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-secondary-700 dark:text-secondary-300">
                          {attempt.date.toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 text-center text-secondary-700 dark:text-secondary-300">
                          {attempt.duration} د
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="flex items-center space-x-1 space-x-reverse text-primary-600 hover:text-primary-700 dark:text-primary-400">
                            <Eye className="w-4 h-4" />
                            <span>عرض</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                تحليل الأداء حسب المادة
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {subjectAnalytics.map((subject, index) => (
                  <div key={index} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">
                        {subject.subject}
                      </h4>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <TrendingUp className={`w-4 h-4 ${subject.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={getStrengthColor(subject.strength)}>
                          {subject.strength}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400">عدد المحاولات</span>
                        <span className="font-medium text-secondary-900 dark:text-white">{subject.attempts}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400">متوسط الدرجات</span>
                        <span className="font-medium text-primary-600 dark:text-primary-400">
                          {subject.avgScore}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${subject.avgScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  إعدادات الحساب
                </h3>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="btn-secondary flex items-center space-x-2 space-x-reverse"
                  >
                    <Edit className="w-4 h-4" />
                    <span>تعديل</span>
                  </button>
                )}
              </div>

              <div className="card p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!editingProfile}
                      className="input-field disabled:bg-secondary-100 dark:disabled:bg-secondary-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      الاسم الأخير
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!editingProfile}
                      className="input-field disabled:bg-secondary-100 dark:disabled:bg-secondary-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!editingProfile}
                      className="input-field disabled:bg-secondary-100 dark:disabled:bg-secondary-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!editingProfile}
                      className="input-field disabled:bg-secondary-100 dark:disabled:bg-secondary-800"
                    />
                  </div>
                </div>

                {editingProfile && (
                  <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="btn-secondary flex items-center space-x-2 space-x-reverse"
                    >
                      <X className="w-4 h-4" />
                      <span>إلغاء</span>
                    </button>
                    <button
                      onClick={handleProfileSave}
                      className="btn-primary flex items-center space-x-2 space-x-reverse"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                طلبات الدفع
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50 dark:bg-secondary-800">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-secondary-900 dark:text-white">
                        الباقة
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-secondary-900 dark:text-white">
                        المبلغ
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-secondary-900 dark:text-white">
                        رقم التحويل
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-secondary-900 dark:text-white">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-secondary-900 dark:text-white">
                        الحالة
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                    {paymentRequests.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 font-medium text-secondary-900 dark:text-white">
                          {payment.plan}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-primary-600 dark:text-primary-400">
                          {payment.amount} EGP
                        </td>
                        <td className="px-6 py-4 text-center text-secondary-700 dark:text-secondary-300">
                          {payment.transferNumber}
                        </td>
                        <td className="px-6 py-4 text-center text-secondary-700 dark:text-secondary-300">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusText(payment.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {paymentRequests.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                    لا توجد طلبات دفع
                  </h4>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    لم تقم بإرسال أي طلبات دفع حتى الآن
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
