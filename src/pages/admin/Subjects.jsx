import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { Plus, Edit, Trash2, Book } from 'lucide-react';

const SubjectModal = ({ subject, onClose, onSave }) => {
  const [name, setName] = useState(subject ? subject.name : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...subject, name });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-secondary-900 rounded-2xl border border-secondary-700 w-full max-w-md"
      >
        <header className="p-6 border-b border-secondary-700">
          <h3 className="text-xl font-bold text-white">{subject ? 'تعديل المادة' : 'إضافة مادة جديدة'}</h3>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label className="block text-sm font-medium text-secondary-300 mb-1">اسم المادة</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-secondary-800 border border-secondary-700 text-white rounded-lg py-2 px-3"
              required
            />
          </div>
          <footer className="p-6 border-t border-secondary-700 flex justify-end space-x-3 space-x-reverse">
            <button type="button" onClick={onClose} className="bg-secondary-700 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded-lg">إلغاء</button>
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">حفظ</button>
          </footer>
        </form>
      </motion.div>
    </div>
  );
};

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('subjects').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching subjects:', error);
    } else {
      setSubjects(data);
    }
    setLoading(false);
  };

  const handleOpenModal = (subject = null) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleSaveSubject = async (subjectData) => {
    if (editingSubject) {
      // Update
      const { error } = await supabase.from('subjects').update({ name: subjectData.name }).eq('id', subjectData.id);
      if (error) console.error('Error updating subject:', error);
    } else {
      // Insert
      const { error } = await supabase.from('subjects').insert([{ name: subjectData.name }]);
      if (error) console.error('Error inserting subject:', error);
    }
    fetchSubjects();
    handleCloseModal();
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المادة؟ سيتم حذف جميع الامتحانات والأسئلة المتعلقة بها.')) {
      const { error } = await supabase.from('subjects').delete().eq('id', subjectId);
      if (error) console.error('Error deleting subject:', error);
      else fetchSubjects();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">إدارة المواد الدراسية</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 space-x-reverse"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مادة جديدة</span>
        </button>
      </div>

      {loading ? (
        <p className="text-white text-center">جاري تحميل المواد...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <motion.div
              key={subject.id}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary-900 rounded-xl border border-secondary-700 p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2 space-x-reverse">
                    <Book className="w-5 h-5 text-primary-400"/>
                    <span>{subject.name}</span>
                  </h3>
                  <p className="text-sm text-secondary-400 mt-1">
                    أضيف في: {new Date(subject.created_at).toLocaleDateString('ar-EG')}
                  </p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button onClick={() => handleOpenModal(subject)} className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-secondary-800">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDeleteSubject(subject.id)} className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-secondary-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {/* <div className="mt-4 pt-4 border-t border-secondary-700">
                <p className="text-secondary-300">
                  عدد الامتحانات: <span className="font-bold text-white">{subject.examCount || 0}</span>
                </p>
              </div> */}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <SubjectModal
            subject={editingSubject}
            onClose={handleCloseModal}
            onSave={handleSaveSubject}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Subjects;
