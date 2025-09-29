import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, ListChecks, Play } from 'lucide-react';

const ExamLobby = ({ examData, onStart }) => {
  const details = [
    { icon: ListChecks, label: 'عدد الأسئلة', value: `${examData.questionsCount} سؤال` },
    { icon: Clock, label: 'مدة الامتحان', value: `${examData.duration} دقيقة` },
    { icon: Star, label: 'الدرجة الكلية', value: `${examData.totalScore} درجة` },
    { icon: BookOpen, label: 'المادة', value: examData.subject },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-8 text-center space-y-8"
    >
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          {examData.title}
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          {examData.grade} - {examData.type}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-right">
        {details.map((item, index) => (
          <div key={index} className="bg-secondary-50 dark:bg-secondary-800 p-4 rounded-lg flex items-center space-x-4 space-x-reverse">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
              <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">{item.label}</p>
              <p className="font-semibold text-secondary-900 dark:text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-yellow-700 dark:text-yellow-400 text-sm">
        <p>
          بمجرد بدء الامتحان، سيبدأ المؤقت. تأكد من أنك في مكان هادئ ولديك اتصال جيد بالإنترنت.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full md:w-1/2 mx-auto btn-primary py-4 text-lg font-semibold flex items-center justify-center space-x-2 space-x-reverse"
      >
        <Play className="w-5 h-5" />
        <span>ابدأ الامتحان الآن</span>
      </button>
    </motion.div>
  );
};

export default ExamLobby;
