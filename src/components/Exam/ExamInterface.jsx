import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from './Timer';
import Question from './Question';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const ExamInterface = ({ examData, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examData.duration * 60);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إنهاء الامتحان؟')) {
      onFinish(answers);
    }
  };

  const currentQuestion = examData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;

  useEffect(() => {
    if (timeLeft === 0) {
      onFinish(answers);
    }
  }, [timeLeft, onFinish, answers]);

  return (
    <div className="card p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
          {examData.title}
        </h2>
        <Timer initialTime={timeLeft} onTimeUpdate={setTimeLeft} />
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-secondary-600 dark:text-secondary-400">
            سؤال {currentQuestionIndex + 1} من {examData.questions.length}
          </span>
          <span className="font-medium text-primary-600 dark:text-primary-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Question
            question={currentQuestion}
            userAnswer={answers[currentQuestion.id]}
            onAnswer={handleAnswerChange}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-secondary-200 dark:border-secondary-700">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="btn-secondary flex items-center space-x-2 space-x-reverse disabled:opacity-50"
        >
          <ArrowRight className="w-4 h-4" />
          <span>السابق</span>
        </button>

        {currentQuestionIndex === examData.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 space-x-reverse"
          >
            <CheckCircle className="w-4 h-4" />
            <span>إنهاء وتسليم</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-primary flex items-center space-x-2 space-x-reverse"
          >
            <span>التالي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamInterface;
