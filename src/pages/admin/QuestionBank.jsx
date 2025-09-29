import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Plus, Filter, Search, Edit, Trash2, Upload, Download } from 'lucide-react';
import QuestionModal from '../../components/Admin/QuestionModal';

const generateMockQuestions = (count) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    text: faker.lorem.sentence(10) + '؟',
    subject: faker.helpers.arrayElement(['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء']),
    grade: faker.helpers.arrayElement(['الاول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي']),
    type: faker.helpers.arrayElement(['mcq-single', 'mcq-multiple', 'true-false']),
    points: faker.number.int({ min: 1, max: 5 }),
    duration: faker.helpers.arrayElement([null, 30, 60, 90]),
    options: ['إجابة 1', 'إجابة 2', 'إجابة 3', 'إجابة 4'],
    correctAnswer: ['إجابة 1'],
  }));
};

const QuestionBank = () => {
  const [questions, setQuestions] = useState(() => generateMockQuestions(40));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    subject: 'all',
    grade: 'all',
    type: 'all',
  });

  const handleOpenModal = (question = null) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = (questionData) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === questionData.id ? questionData : q));
    } else {
      setQuestions([questionData, ...questions]);
    }
    handleCloseModal();
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const searchMatch = filters.search === '' || q.text.toLowerCase().includes(filters.search.toLowerCase());
      const subjectMatch = filters.subject === 'all' || q.subject === filters.subject;
      const gradeMatch = filters.grade === 'all' || q.grade === filters.grade;
      const typeMatch = filters.type === 'all' || q.type === filters.type;
      return searchMatch && subjectMatch && gradeMatch && typeMatch;
    });
  }, [questions, filters]);

  const getQuestionTypeText = (type) => {
    const types = {
      'mcq-single': 'اختيار فردي',
      'mcq-multiple': 'اختيار متعدد',
      'true-false': 'صح وخطأ',
    };
    return types[type] || 'غير محدد';
  };

  const uniqueSubjects = [...new Set(questions.map(q => q.subject))];
  const uniqueGrades = [...new Set(questions.map(q => q.grade))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">بنك الأسئلة</h2>
        <div className="flex items-center gap-2">
          <button className="bg-secondary-700 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors">
            <Upload className="w-4 h-4" />
            <span>استيراد CSV</span>
          </button>
          <button className="bg-secondary-700 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors">
            <Download className="w-4 h-4" />
            <span>تصدير CSV</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة سؤال جديد</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-secondary-900 p-4 rounded-xl border border-secondary-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text" name="search" placeholder="بحث في نص السؤال..."
              value={filters.search} onChange={handleFilterChange}
              className="w-full bg-secondary-800 border border-secondary-700 text-white placeholder-secondary-400 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select name="subject" value={filters.subject} onChange={handleFilterChange} className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-500">
            <option value="all">كل المواد</option>
            {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="grade" value={filters.grade} onChange={handleFilterChange} className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-500">
            <option value="all">كل المراحل</option>
            {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-500">
            <option value="all">كل الأنواع</option>
            <option value="mcq-single">اختيار فردي</option>
            <option value="mcq-multiple">اختيار متعدد</option>
            <option value="true-false">صح وخطأ</option>
          </select>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-secondary-900 rounded-xl border border-secondary-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-secondary-300">
            <thead className="text-xs text-secondary-400 uppercase bg-secondary-800">
              <tr>
                <th scope="col" className="px-6 py-3 w-2/5">نص السؤال</th>
                <th scope="col" className="px-6 py-3">المادة</th>
                <th scope="col" className="px-6 py-3">المرحلة</th>
                <th scope="col" className="px-6 py-3">النوع</th>
                <th scope="col" className="px-6 py-3">النقاط</th>
                <th scope="col" className="px-6 py-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="border-b border-secondary-700 hover:bg-secondary-800/50">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap max-w-sm truncate">{q.text}</td>
                  <td className="px-6 py-4">{q.subject}</td>
                  <td className="px-6 py-4">{q.grade}</td>
                  <td className="px-6 py-4">{getQuestionTypeText(q.type)}</td>
                  <td className="px-6 py-4">{q.points}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-4 space-x-reverse">
                      <button onClick={() => handleOpenModal(q)} className="text-blue-400 hover:text-blue-300">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <QuestionModal
            question={editingQuestion}
            onClose={handleCloseModal}
            onSave={handleSaveQuestion}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionBank;
