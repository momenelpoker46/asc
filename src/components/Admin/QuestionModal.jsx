import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { X, Save, Plus, Trash2, Check } from 'lucide-react';

const QuestionModal = ({ question, onClose, onSave }) => {
  const [questionData, setQuestionData] = useState(question || {
    id: faker.string.uuid(),
    text: '',
    subject: 'الرياضيات',
    grade: 'الثالث الثانوي',
    type: 'mcq-single',
    points: 1,
    duration: null,
    options: ['', ''],
    correctAnswer: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'type') {
      // Reset options and answers when type changes
      setQuestionData(prev => ({
        ...prev,
        type: value,
        options: value === 'true-false' ? ['صواب', 'خطأ'] : ['', ''],
        correctAnswer: [],
      }));
    } else {
      setQuestionData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setQuestionData(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const removeOption = (index) => {
    const newOptions = questionData.options.filter((_, i) => i !== index);
    setQuestionData(prev => ({ ...prev, options: newOptions }));
  };

  const handleCorrectAnswerChange = (option) => {
    const { type, correctAnswer } = questionData;
    let newCorrectAnswer;

    if (type === 'mcq-multiple') {
      newCorrectAnswer = correctAnswer.includes(option)
        ? correctAnswer.filter(ans => ans !== option)
        : [...correctAnswer, option];
    } else {
      newCorrectAnswer = [option];
    }
    setQuestionData(prev => ({ ...prev, correctAnswer: newCorrectAnswer }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(questionData);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const renderAnswerEditor = () => {
    const { type, options, correctAnswer } = questionData;

    if (type === 'true-false') {
      return (
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-3 space-x-reverse p-3 bg-secondary-800 rounded-lg">
              <input type="radio" name="correctAnswer" value={option} checked={correctAnswer[0] === option} onChange={() => handleCorrectAnswerChange(option)} className="form-radio text-primary-500 bg-secondary-700 border-secondary-600"/>
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      );
    }
    
    if (type === 'mcq-single' || type === 'mcq-multiple') {
      return (
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 space-x-reverse">
              <button type="button" onClick={() => handleCorrectAnswerChange(option)} className={`w-6 h-6 flex-shrink-0 rounded-md flex items-center justify-center border-2 ${correctAnswer.includes(option) ? 'bg-green-500 border-green-500' : 'border-secondary-600'}`}>
                {correctAnswer.includes(option) && <Check className="w-4 h-4 text-white" />}
              </button>
              <input type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} placeholder={`إجابة ${index + 1}`} className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-3"/>
              {options.length > 2 && (
                <button type="button" onClick={() => removeOption(index)} className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption} className="text-primary-400 hover:text-primary-300 text-sm flex items-center space-x-1 space-x-reverse">
            <Plus className="w-4 h-4" />
            <span>إضافة إجابة</span>
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-secondary-900 rounded-2xl border border-secondary-700 w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        <header className="p-6 border-b border-secondary-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{question ? 'تعديل سؤال' : 'إضافة سؤال جديد'}</h3>
          <button onClick={onClose} className="text-secondary-400 hover:text-white"><X className="w-6 h-6" /></button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-secondary-300 mb-1">نص السؤال</label>
            <textarea name="text" value={questionData.text} onChange={handleChange} rows="3" className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-3" required></textarea>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-1">نوع السؤال</label>
              <select name="type" value={questionData.type} onChange={handleChange} className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-3">
                <option value="mcq-single">اختيار فردي</option>
                <option value="mcq-multiple">اختيار متعدد</option>
                <option value="true-false">صح وخطأ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-1">المادة</label>
              <select name="subject" value={questionData.subject} onChange={handleChange} className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-3">
                <option>الرياضيات</option><option>الفيزياء</option><option>الكيمياء</option><option>الأحياء</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-1">المرحلة</label>
              <select name="grade" value={questionData.grade} onChange={handleChange} className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-3">
                <option>الاول الثانوي</option><option>الثاني الثانوي</option><option>الثالث الثانوي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-1">النقاط</label>
              <input type="number" name="points" value={questionData.points} onChange={handleChange} min="1" className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-3"/>
            </div>
          </div>
          
          {/* Answer Editor */}
          <div>
            <label className="block text-sm font-medium text-secondary-300 mb-2">الإجابات (حدد الإجابة الصحيحة)</label>
            {renderAnswerEditor()}
          </div>
        </form>

        <footer className="p-6 border-t border-secondary-700 flex justify-end space-x-3 space-x-reverse">
          <button type="button" onClick={onClose} className="bg-secondary-700 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded-lg">إلغاء</button>
          <button type="submit" onClick={handleSubmit} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 space-x-reverse">
            <Save className="w-5 h-5"/><span>حفظ السؤال</span>
          </button>
        </footer>
      </motion.div>
    </div>
  );
};

export default QuestionModal;
