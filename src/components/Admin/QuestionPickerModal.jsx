import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { X, Search, Plus } from 'lucide-react';

const generateMockQuestions = (count) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    text: faker.lorem.sentence(10) + '؟',
    subject: faker.helpers.arrayElement(['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء']),
    grade: faker.helpers.arrayElement(['الاول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي']),
    type: faker.helpers.arrayElement(['mcq-single', 'mcq-multiple', 'true-false']),
  }));
};

const allQuestions = generateMockQuestions(100);

const QuestionPickerModal = ({ onClose, onAddQuestions, existingQuestions }) => {
  const [selectedIds, setSelectedIds] = useState(() => new Set(existingQuestions.map(q => q.id)));
  const [filters, setFilters] = useState({ search: '', subject: 'all', grade: 'all' });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectQuestion = (questionId) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleAdd = () => {
    const selectedQuestions = allQuestions.filter(q => selectedIds.has(q.id));
    onAddQuestions(selectedQuestions);
  };

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const searchMatch = filters.search === '' || q.text.toLowerCase().includes(filters.search.toLowerCase());
      const subjectMatch = filters.subject === 'all' || q.subject === filters.subject;
      const gradeMatch = filters.grade === 'all' || q.grade === filters.grade;
      return searchMatch && subjectMatch && gradeMatch;
    });
  }, [filters]);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-secondary-800 rounded-2xl border border-secondary-700 w-full max-w-4xl h-[80vh] flex flex-col"
      >
        <header className="p-4 border-b border-secondary-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">اختيار أسئلة من البنك</h3>
          <button onClick={onClose} className="text-secondary-400 hover:text-white"><X /></button>
        </header>

        <div className="p-4 border-b border-secondary-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input type="text" name="search" placeholder="بحث..." value={filters.search} onChange={handleFilterChange} className="input-field-admin pl-8" />
            </div>
            <select name="subject" value={filters.subject} onChange={handleFilterChange} className="input-field-admin">
              <option value="all">كل المواد</option>
              <option>الرياضيات</option><option>الفيزياء</option><option>الكيمياء</option><option>الأحياء</option>
            </select>
            <select name="grade" value={filters.grade} onChange={handleFilterChange} className="input-field-admin">
              <option value="all">كل المراحل</option>
              <option>الاول الثانوي</option><option>الثاني الثانوي</option><option>الثالث الثانوي</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredQuestions.map(q => (
            <label key={q.id} className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg cursor-pointer transition-colors ${selectedIds.has(q.id) ? 'bg-primary-900/50' : 'hover:bg-secondary-700/50'}`}>
              <input type="checkbox" checked={selectedIds.has(q.id)} onChange={() => handleSelectQuestion(q.id)} className="form-checkbox h-5 w-5 rounded bg-secondary-700 border-secondary-600 text-primary-500 focus:ring-primary-500"/>
              <span className="text-white flex-1 truncate">{q.text}</span>
              <span className="text-xs text-secondary-400 bg-secondary-700 px-2 py-1 rounded">{q.subject}</span>
            </label>
          ))}
        </div>

        <footer className="p-4 border-t border-secondary-700 flex justify-between items-center">
          <span className="text-secondary-300">تم اختيار {selectedIds.size} سؤال</span>
          <div className="flex space-x-3 space-x-reverse">
            <button onClick={onClose} className="btn-secondary-admin">إلغاء</button>
            <button onClick={handleAdd} className="btn-primary-admin">
              <Plus className="w-5 h-5"/>
              <span>إضافة الأسئلة المختارة</span>
            </button>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default QuestionPickerModal;
