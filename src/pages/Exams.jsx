import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  BookOpen, 
  Star, 
  Filter,
  Search,
  Play,
  Users,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { faker } from '@faker-js/faker';

const Exams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Generate mock exams based on user's grade
  useEffect(() => {
    const generateExams = () => {
      const subjects = ['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'العربية', 'الإنجليزية'];
      const types = ['مراجعة', 'امتحان شهري', 'امتحان نهائي', 'تدريب'];
      const difficulties = ['سهل', 'متوسط', 'صعب'];
      
      const mockExams = Array.from({ length: 24 }, (_, index) => ({
        id: index + 1,
        title: `امتحان ${subjects[index % subjects.length]} - ${types[index % types.length]}`,
        subject: subjects[index % subjects.length],
        type: types[index % types.length],
        grade: user?.grade || 'الثالث الثانوي',
        track: user?.track || 'علمي علوم',
        questionsCount: faker.number.int({ min: 15, max: 50 }),
        duration: faker.number.int({ min: 30, max: 120 }),
        totalScore: faker.number.int({ min: 50, max: 100 }),
        difficulty: difficulties[index % difficulties.length],
        attempts: faker.number.int({ min: 0, max: 1500 }),
        averageScore: faker.number.float({ min: 60, max: 95, fractionDigits: 1 }),
        dateAdded: faker.date.recent({ days: 30 }),
        isCompleted: faker.datatype.boolean({ probability: 0.3 }),
        userScore: faker.datatype.boolean({ probability: 0.3 }) ? faker.number.float({ min: 50, max: 100, fractionDigits: 1 }) : null
      }));
      
      setExams(mockExams);
      setFilteredExams(mockExams);
      setLoading(false);
    };

    if (user) {
      generateExams();
    }
  }, [user]);

  // Filter exams based on search and filters
  useEffect(() => {
    let filtered = exams;

    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(exam => exam.subject === selectedSubject);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(exam => exam.type === selectedType);
    }

    setFilteredExams(filtered);
  }, [searchTerm, selectedSubject, selectedType, exams]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'سهل': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'متوسط': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'صعب': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'مراجعة': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'امتحان شهري': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
      case 'امتحان نهائي': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'تدريب': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          يجب تسجيل الدخول أولاً
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          سجل دخولك للوصول إلى الامتحانات
        </p>
      </div>
    );
  }

  if (!user.subscription?.active) {
    return (
      <div className="text-center py-20">
        <Award className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          اشتراك مطلوب
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          تحتاج إلى اشتراك فعال للوصول إلى الامتحانات
        </p>
        <a href="/pricing" className="btn-primary">
          تصفح الباقات
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            الامتحانات المتاحة
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            {user.grade} - {user.track}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="bg-primary-100 dark:bg-primary-900/20 px-4 py-2 rounded-lg">
            <span className="text-primary-700 dark:text-primary-400 font-medium">
              {filteredExams.length} امتحان متاح
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="البحث في الامتحانات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field"
          >
            <option value="all">جميع المواد</option>
            <option value="الرياضيات">الرياضيات</option>
            <option value="الفيزياء">الفيزياء</option>
            <option value="الكيمياء">الكيمياء</option>
            <option value="الأحياء">الأحياء</option>
            <option value="العربية">العربية</option>
            <option value="الإنجليزية">الإنجليزية</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input-field"
          >
            <option value="all">جميع الأنواع</option>
            <option value="مراجعة">مراجعة</option>
            <option value="امتحان شهري">امتحان شهري</option>
            <option value="امتحان نهائي">امتحان نهائي</option>
            <option value="تدريب">تدريب</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('all');
              setSelectedType('all');
            }}
            className="btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
          >
            <Filter className="w-4 h-4" />
            <span>مسح الفلاتر</span>
          </button>
        </div>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card p-6 animate-pulse">
              <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded mb-4"></div>
              <div className="h-6 bg-secondary-200 dark:bg-secondary-700 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredExams.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
            >
              {/* Header */}
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-2 line-clamp-2">
                      {exam.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${getTypeColor(exam.type)}`}>
                        {exam.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(exam.difficulty)}`}>
                        {exam.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  {exam.isCompleted && (
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                      <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400 flex items-center space-x-1 space-x-reverse">
                      <BookOpen className="w-4 h-4" />
                      <span>الأسئلة</span>
                    </span>
                    <span className="font-medium text-secondary-900 dark:text-white">
                      {exam.questionsCount} سؤال
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400 flex items-center space-x-1 space-x-reverse">
                      <Clock className="w-4 h-4" />
                      <span>المدة</span>
                    </span>
                    <span className="font-medium text-secondary-900 dark:text-white">
                      {exam.duration} دقيقة
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400 flex items-center space-x-1 space-x-reverse">
                      <Star className="w-4 h-4" />
                      <span>الدرجة</span>
                    </span>
                    <span className="font-medium text-secondary-900 dark:text-white">
                      {exam.totalScore} درجة
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400 flex items-center space-x-1 space-x-reverse">
                      <Users className="w-4 h-4" />
                      <span>المحاولات</span>
                    </span>
                    <span className="font-medium text-secondary-900 dark:text-white">
                      {exam.attempts.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Performance */}
                {exam.userScore && (
                  <div className="bg-secondary-50 dark:bg-secondary-800 p-3 rounded-lg mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-secondary-600 dark:text-secondary-400">درجتك الأخيرة</span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        {exam.userScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link to={`/exam/${exam.id}`} className="w-full btn-primary flex items-center justify-center space-x-2 space-x-reverse mt-auto">
                <Play className="w-4 h-4" />
                <span>{exam.isCompleted ? 'إعادة الامتحان' : 'بدء الامتحان'}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            لا توجد امتحانات
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            لم يتم العثور على امتحانات تطابق البحث والفلاتر المحددة
          </p>
        </div>
      )}
    </div>
  );
};

export default Exams;
