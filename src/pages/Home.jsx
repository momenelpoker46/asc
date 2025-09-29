import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  CheckCircle,
  Star,
  ArrowLeft
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'امتحانات تفاعلية',
      description: 'امتحانات حديثة ومتطورة لجميع المراحل الدراسية'
    },
    {
      icon: Users,
      title: 'متابعة شخصية',
      description: 'تتبع تقدمك ونقاط القوة والضعف في كل مادة'
    },
    {
      icon: Trophy,
      title: 'نتائج فورية',
      description: 'احصل على النتائج والتقييم فور انتهاء الامتحان'
    },
    {
      icon: CheckCircle,
      title: 'محتوى معتمد',
      description: 'جميع الامتحانات معدة من قبل خبراء تعليميين'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'طالب مسجل' },
    { number: '500+', label: 'امتحان متاح' },
    { number: '98%', label: 'نسبة رضا الطلاب' },
    { number: '24/7', label: 'دعم فني' }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-secondary-900 dark:text-white">
            <span className="text-primary-600">حل</span>هالي
          </h1>
          <p className="text-xl md:text-2xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
            منصة الامتحانات التعليمية الحديثة - استعد لامتحاناتك بطريقة ذكية وتفاعلية
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/register" className="btn-primary text-lg px-8 py-4">
            ابدأ الآن مجاناً
          </Link>
          <Link to="/pricing" className="btn-secondary text-lg px-8 py-4">
            تصفح الباقات
          </Link>
        </div>

        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">جرب لمدة 7 أيام مجاناً!</h3>
            <p className="text-primary-100">
              احصل على وصول كامل لجميع الامتحانات والميزات لمدة أسبوع كامل
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            لماذا نحن الأفضل؟
          </h2>
          <p className="text-xl text-secondary-600 dark:text-secondary-300">
            نقدم تجربة تعليمية متكاملة ومتطورة
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white p-12 rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-primary-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            ماذا يقول طلابنا؟
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'أحمد محمد',
              grade: 'الثالث الثانوي',
              rating: 5,
              text: 'منصة رائعة ساعدتني كثيراً في التحضير للامتحانات. الأسئلة واقعية والنتائج دقيقة.'
            },
            {
              name: 'فاطمة علي',
              grade: 'الثاني الثانوي',
              rating: 5,
              text: 'أحب طريقة عرض النتائج وتحليل نقاط القوة والضعف. أصبحت أعرف مستواي الحقيقي.'
            },
            {
              name: 'محمد حسن',
              grade: 'الأول الثانوي',
              rating: 5,
              text: 'التصميم جميل والاستخدام سهل جداً. الامتحانات متنوعة وتغطي المنهج بالكامل.'
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                "{testimonial.text}"
              </p>
              <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
                <div className="font-semibold text-secondary-900 dark:text-white">
                  {testimonial.name}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  {testimonial.grade}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-12 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ابدأ رحلتك التعليمية اليوم
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف الطلاب الذين يحققون نتائج مميزة مع منصة حلهالي
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center space-x-2 space-x-reverse bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary-50 transition-colors"
          >
            <span>سجل الآن</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
