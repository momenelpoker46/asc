import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { Plus, Edit, Trash2, Crown, Star, Zap, Check, ToggleLeft, ToggleRight } from 'lucide-react';

const SubscriptionModal = ({ plan, onClose, onSave }) => {
  const [planData, setPlanData] = useState(plan || {
    name: '',
    price: 0,
    exam_limit: 0,
    has_trial: false,
    trial_days: 7,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlanData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(planData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-secondary-900 rounded-2xl border border-secondary-700 w-full max-w-lg"
      >
        <header className="p-6 border-b border-secondary-700">
          <h3 className="text-xl font-bold text-white">{plan ? 'تعديل الباقة' : 'إضافة باقة جديدة'}</h3>
        </header>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-1">اسم الباقة</label>
              <input type="text" name="name" value={planData.name} onChange={handleChange} className="input-field-admin" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-1">السعر (EGP)</label>
              <input type="number" name="price" value={planData.price} onChange={handleChange} className="input-field-admin" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-300 mb-1">عدد الامتحانات المسموح به (-1 لغير محدود)</label>
            <input type="number" name="exam_limit" value={planData.exam_limit} onChange={handleChange} className="input-field-admin" required />
          </div>
          <div className="flex items-center justify-between bg-secondary-800 p-3 rounded-lg">
            <span className="text-white">فترة تجريبية</span>
            <button type="button" onClick={() => setPlanData(p => ({...p, has_trial: !p.has_trial}))}>
              {planData.has_trial ? <ToggleRight className="w-10 h-10 text-primary-500"/> : <ToggleLeft className="w-10 h-10 text-secondary-500"/>}
            </button>
          </div>
          {planData.has_trial && (
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-1">أيام الفترة التجريبية</label>
              <input type="number" name="trial_days" value={planData.trial_days} onChange={handleChange} className="input-field-admin" />
            </div>
          )}
          <footer className="pt-4 flex justify-end space-x-3 space-x-reverse">
            <button type="button" onClick={onClose} className="btn-secondary-admin">إلغاء</button>
            <button type="submit" className="btn-primary-admin">حفظ</button>
          </footer>
        </form>
      </motion.div>
    </div>
  );
};

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('subscription_plans').select('*').order('price');
    if (error) console.error("Error fetching plans:", error);
    else setPlans(data);
    setLoading(false);
  };

  const handleOpenModal = (plan = null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleSavePlan = async (planData) => {
    if (editingPlan) {
      const { error } = await supabase.from('subscription_plans').update(planData).eq('id', editingPlan.id);
      if (error) console.error("Error updating plan:", error);
    } else {
      const { error } = await supabase.from('subscription_plans').insert([planData]);
      if (error) console.error("Error inserting plan:", error);
    }
    fetchPlans();
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) {
      const { error } = await supabase.from('subscription_plans').delete().eq('id', planId);
      if (error) console.error("Error deleting plan:", error);
      else fetchPlans();
    }
  };
  
  const getIcon = (index) => {
    const icons = [Zap, Star, Crown];
    const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-yellow-500 to-yellow-600'];
    return { Icon: icons[index % 3], color: colors[index % 3] };
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">إدارة الاشتراكات</h2>
        <button onClick={() => handleOpenModal()} className="btn-primary-admin">
          <Plus className="w-5 h-5" />
          <span>إضافة باقة جديدة</span>
        </button>
      </div>

      {loading ? <p className="text-white text-center">جاري التحميل...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const { Icon, color } = getIcon(index);
            return (
              <motion.div
                key={plan.id}
                layout
                className={`relative bg-secondary-900 rounded-xl border border-secondary-700 p-6 flex flex-col`}
              >
                <div className="flex-grow">
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  </div>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-secondary-400"> EGP / شهرياً</span>
                  </div>
                  <ul className="space-y-3 text-secondary-300">
                    <li className="flex items-center space-x-2 space-x-reverse">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>{plan.exam_limit === -1 ? 'امتحانات غير محدودة' : `${plan.exam_limit} امتحان شهرياً`}</span>
                    </li>
                    <li className="flex items-center space-x-2 space-x-reverse">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>{plan.has_trial ? `فترة تجريبية ${plan.trial_days} أيام` : 'لا توجد فترة تجريبية'}</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-secondary-700 flex justify-center space-x-3 space-x-reverse">
                  <button onClick={() => handleOpenModal(plan)} className="p-2 rounded-full text-blue-400 hover:bg-secondary-800"><Edit/></button>
                  <button onClick={() => handleDeletePlan(plan.id)} className="p-2 rounded-full text-red-400 hover:bg-secondary-800"><Trash2/></button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <SubscriptionModal
            plan={editingPlan}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSavePlan}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Subscriptions;
