import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Plus, Filter, Search, Edit, Trash2, X } from 'lucide-react';
import ExamModal from '../../components/Admin/ExamModal';

const generateMockExams = (count) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    subject: faker.helpers.arrayElement(['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء']),
    grade: faker.helpers.arrayElement(['الاول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي']),
    type: faker.helpers.arrayElement(['مراجعة', 'امتحان شهري', 'امتحان نهائي']),
    dateAdded: faker.date.recent({ days: 90 }),
    questionCount: faker.number.int({ min: 15, max: 50 }),
    mode: faker.helpers.arrayElement(['retry-highest', 'retry-first', 'restricted']),
    timingMode: faker.helpers.arrayElement(['general', 'per-question']),
  }));
};

const AdminExams = () => {
  const [exams, setExams] = useState(() => generateMockExams(25));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    subject: 'all',
    grade: 'all',
  });

  const handleOpenModal = (exam = null) => {
    setEditingExam(exam);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExam(null);
  };

  const handleSaveExam = (examData) => {
    if (editingExam) {
      // Update existing exam
      setExams(exams.map(ex => ex.id === examData.id ? examData : ex));
    } else {
      // Add new exam
      setExams([examData, ...exams]);
    }
    handleCloseModal();
  };

  const handleDeleteExam = (examId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الامتحان؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setExams(exams.filter(ex => ex.id !== examId));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const searchMatch = filters.search === '' || 
        exam.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        exam.type.toLowerCase().includes(filters.search.toLowerCase());
      const subjectMatch = filters.subject === 'all' || exam.subject === filters.subject;
      const gradeMatch = filters.grade === 'all' || exam.grade === filters.grade;
      return searchMatch && subjectMatch && gradeMatch;
    });
  }, [exams, filters]);

  const getModeText = (mode) => {
    switch (mode) {
      case 'retry-highest': return 'إعادة (أعلى درجة)';
      case 'retry-first': return 'إعادة (أول درجة)';
      case 'restricted': return 'محاولة واحدة';
      default: return 'غير محدد';
    }
  };

  const uniqueSubjects = [...new Set(exams.map(e => e.subject))];
  const uniqueGrades = [...new Set(exams.map(e => e.grade))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-white">إدارة الامتحانات</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة امتحان جديد</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-secondary-900 p-4 rounded-xl border border-secondary-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              name="search"
              placeholder="بحث..."
              value={filters.search}
              onChange={handleFilterChange}
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
          <button 
            onClick={() => setFilters({ search: '', subject: 'all', grade: 'all' })}
            className="bg-secondary-700 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 space-x-reverse transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>مسح الفلاتر</span>
          </button>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-secondary-900 rounded-xl border border-secondary-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-secondary-300">
            <thead className="text-xs text-secondary-400 uppercase bg-secondary-800">
              <tr>
                <th scope="col" className="px-6 py-3">المادة</th>
                <th scope="col" className="px-6 py-3">المرحلة</th>
                <th scope="col" className="px-6 py-3">النوع</th>
                <th scope="col" className="px-6 py-3">تاريخ الإضافة</th>
                <th scope="col" className="px-6 py-3">وضع الامتحان</th>
                <th scope="col" className="px-6 py-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="border-b border-secondary-700 hover:bg-secondary-800/50">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{exam.subject}</td>
                  <td className="px-6 py-4">{exam.grade}</td>
                  <td className="px-6 py-4">{exam.type}</td>
                  <td className="px-6 py-4">{new Date(exam.dateAdded).toLocaleDateString('ar-EG')}</td>
                  <td className="px-6 py-4">{getModeText(exam.mode)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-4 space-x-reverse">
                      <button onClick={() => handleOpenModal(exam)} className="text-blue-400 hover:text-blue-300">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteExam(exam.id)} className="text-red-400 hover:text-red-300">
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
          <ExamModal
            exam={editingExam}
            onClose={handleCloseModal}
            onSave={handleSaveExam}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminExams;
