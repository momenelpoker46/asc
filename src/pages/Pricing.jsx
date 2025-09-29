import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [loading, setLoading] = useState(null);
  const [plans, setPlans] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase.from('subscription_plans').select('*').order('price');
      if (error) console.error("Error fetching plans:", error);
      else setPlans(data);
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(plan.id);
    
    // In a real app, this would redirect to a payment gateway.
    // For now, we'll simulate creating a payment request.
    const { error } = await supabase.from('payment_requests').insert({
      student_id: user.id,
      plan_id: plan.id,
      amount: plan.price,
      status: 'pending',
      transfer_number: `SIM-${Date.now()}` // Simulated transfer number
    });

    setLoading(null);
    if (error) {
      alert('حدث خطأ أثناء إنشاء طلب الدفع.');
      console.error(error);
    } else {
      alert('تم إنشاء طلب الدفع بنجاح! سيتم مراجعته من قبل الإدارة.');
      navigate('/account');
    }
  };

  const getIcon = (index) => {
    const icons = [Zap, Star, Crown];
    const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-yellow-500 to-yellow-600'];
    return { Icon: icons[index % 3] || Zap, color: colors[index % 3] || 'from-gray-500 to-gray-600' };
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white"
        >
          اختر الباقة المناسبة لك
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto"
        >
          جميع الباقات تشمل فترة تجريبية مجانية. اختر الباقة التي تناسب احتياجاتك الدراسية
        </motion.p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const { Icon, color } = getIcon(index);
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative card p-8`}
            >
              {/* Plan Header */}
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-secondary-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-secondary-600 dark:text-secondary-400 mr-2">
                      EGP / شهرياً
                    </span>
                  </div>
                </div>

                {/* Trial Info */}
                {plan.has_trial && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                      تجربة مجانية لمدة {plan.trial_days} أيام
                    </p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 my-8">
                <h4 className="font-semibold text-secondary-900 dark:text-white">
                  المميزات المتضمنة:
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 space-x-reverse">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-secondary-700 dark:text-secondary-300">
                      {plan.exam_limit === -1 ? 'امتحانات غير محدودة' : `${plan.exam_limit} امتحان شهرياً`}
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري التحميل...</span>
                  </div>
                ) : (
                  user ? 'اشترك الآن' : 'سجل واشترك'
                )}
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
};

export default Pricing;
