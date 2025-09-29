import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import QuestionPickerModal from './QuestionPickerModal';

const ExamModal = ({ exam, onClose, onSave }) => {
  const [examData, setExamData] = useState(exam || {
    id: faker.string.uuid(),
    subject: 'الرياضيات',
    grade: 'الثالث الثانوي',
    type: 'مراجعة',
    dateAdded: new Date(),
    mode: 'retry-highest',
    timingMode: 'general',
    duration: 60,
    questions: [],
  });
  
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name, value) => {
    setExamData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddQuestions = (newQuestions) => {
    const newQuestionIds = new Set(newQuestions.map(q => q.id));
    const existingQuestions = examData.questions.filter(q => !newQuestionIds.has(q.id));
    setExamData(prev => ({ ...prev, questions: [...existingQuestions, ...newQuestions] }));
    setIsPickerOpen(false);
  };
  
  const handleRemoveQuestion = (questionId) => {
    setExamData(prev => ({ ...prev, questions: prev.questions.filter(q => q.id !== questionId) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({...examData, questionCount: examData.questions.length});
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-secondary-900 rounded-2xl border border-secondary-700 w-full max-w-3xl max-h-[90vh] flex flex-col"
        >
          <header className="p-6 border-b border-secondary-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              {exam ? 'تعديل امتحان' : 'إضافة امتحان جديد'}
            </h3>
            <button onClick={onClose} className="text-secondary-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </header>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">المادة</label>
                <select name="subject" value={examData.subject} onChange={handleChange} className="input-field-admin">
                  <option>الرياضيات</option>
                  <option>الفيزياء</option>
                  <option>الكيمياء</option>
                  <option>الأحياء</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">المرحلة</label>
                <select name="grade" value={examData.grade} onChange={handleChange} className="input-field-admin">
                  <option>الاول الثانوي</option>
                  <option>الثاني الثانوي</option>
                  <option>الثالث الثانوي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">النوع</label>
                <select name="type" value={examData.type} onChange={handleChange} className="input-field-admin">
                  <option>مراجعة</option>
                  <option>امتحان شهري</option>
                  <option>امتحان نهائي</option>
                </select>
              </div>
            </div>

            {/* Question Management */}
            <div>
              <label className="block text-lg font-semibold text-white mb-2">الأسئلة</label>
              <div className="bg-secondary-800 p-4 rounded-lg border border-secondary-700 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-secondary-300">
                    تم اختيار {examData.questions.length} سؤال
                  </p>
                  <button type="button" onClick={() => setIsPickerOpen(true)} className="btn-primary-admin text-sm">
                    بحث في بنك الأسئلة
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {examData.questions.length === 0 ? (
                    <p className="text-center text-secondary-500 py-4">لم يتم إضافة أسئلة بعد</p>
                  ) : (
                    examData.questions.map((q, index) => (
                      <div key={q.id} className="bg-secondary-700 p-2 rounded flex justify-between items-center">
                        <p className="text-white text-sm truncate flex-1">{q.text}</p>
                        <button type="button" onClick={() => handleRemoveQuestion(q.id)} className="text-red-400 hover:text-red-300 p-1">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Exam Mode */}
            <div>
              <label className="block text-lg font-semibold text-white mb-2">وضع الامتحان</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <RadioCard name="mode" value="retry-highest" checked={examData.mode === 'retry-highest'} onChange={handleRadioChange} title="إعادة (الأعلى)" description="يمكن للطالب الإعادة، وتُحتسب أعلى درجة." />
                <RadioCard name="mode" value="retry-first" checked={examData.mode === 'retry-first'} onChange={handleRadioChange} title="إعادة (الأولى)" description="يمكن للطالب الإعادة، وتُحتسب درجة أول محاولة فقط." />
                <RadioCard name="mode" value="restricted" checked={examData.mode === 'restricted'} onChange={handleRadioChange} title="محاولة واحدة" description="لا يمكن للطالب إعادة الامتحان مرة أخرى." />
              </div>
            </div>

            {/* Timing Mode */}
            <div>
              <label className="block text-lg font-semibold text-white mb-2">وضع التوقيت</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <RadioCard name="timingMode" value="general" checked={examData.timingMode === 'general'} onChange={handleRadioChange} title="توقيت عام" description="مدة زمنية كلية للامتحان." />
                <RadioCard name="timingMode" value="per-question" checked={examData.timingMode === 'per-question'} onChange={handleRadioChange} title="توقيت لكل سؤال" description="مدة محددة لكل سؤال على حدة." />
              </div>
              {examData.timingMode === 'general' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-secondary-300 mb-1">المدة الكلية (بالدقائق)</label>
                  <input type="number" name="duration" value={examData.duration} onChange={handleChange} className="input-field-admin" min="1" />
                </div>
              )}
            </div>
          </form>

          <footer className="p-6 border-t border-secondary-700 flex justify-end space-x-3 space-x-reverse">
            <button type="button" onClick={onClose} className="btn-secondary-admin">إلغاء</button>
            <button type="submit" onClick={handleSubmit} className="btn-primary-admin">
              <Save className="w-5 h-5"/>
              <span>حفظ الامتحان</span>
            </button>
          </footer>
        </motion.div>
      </div>
      <AnimatePresence>
        {isPickerOpen && (
          <QuestionPickerModal
            onClose={() => setIsPickerOpen(false)}
            onAddQuestions={handleAddQuestions}
            existingQuestions={examData.questions}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const RadioCard = ({ name, value, checked, onChange, title, description }) => (
  <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${checked ? 'border-primary-500 bg-primary-900/30' : 'border-secondary-700 hover:border-secondary-600'}`}>
    <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(name, value)} className="hidden" />
    <h4 className="font-semibold text-white">{title}</h4>
    <p className="text-sm text-secondary-400 mt-1">{description}</p>
  </label>
);

export default ExamModal;
