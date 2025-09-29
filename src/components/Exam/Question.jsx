import React from 'react';
import { Check, X } from 'lucide-react';

const Question = ({ question, userAnswer, onAnswer }) => {
  const handleSingleChoice = (option) => {
    onAnswer(question.id, [option]);
  };

  const handleMultipleChoice = (option) => {
    const currentAnswers = userAnswer || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter(ans => ans !== option)
      : [...currentAnswers, option];
    onAnswer(question.id, newAnswers);
  };

  const renderOptions = () => {
    switch (question.type) {
      case 'mcq-single':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSingleChoice(option)}
                className={`w-full text-right p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                  userAnswer && userAnswer[0] === option
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 hover:border-primary-400'
                }`}
              >
                <span className="text-secondary-800 dark:text-secondary-200">{option}</span>
                {userAnswer && userAnswer[0] === option && (
                  <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        );
      case 'mcq-multiple':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleMultipleChoice(option)}
                className={`w-full text-right p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                  userAnswer && userAnswer.includes(option)
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 hover:border-primary-400'
                }`}
              >
                <span className="text-secondary-800 dark:text-secondary-200">{option}</span>
                <div className={`w-6 h-6 rounded border-2 flex-shrink-0 ${userAnswer && userAnswer.includes(option) ? 'bg-primary-600 border-primary-600' : 'border-secondary-400'}`}>
                  {userAnswer && userAnswer.includes(option) && <Check className="w-5 h-5 text-white" />}
                </div>
              </button>
            ))}
          </div>
        );
      case 'true-false':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleSingleChoice('صواب')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                userAnswer && userAnswer[0] === 'صواب'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 hover:border-green-400'
              }`}
            >
              <Check className="w-8 h-8 text-green-500" />
              <span className="text-xl font-semibold text-green-700 dark:text-green-400">صواب</span>
            </button>
            <button
              onClick={() => handleSingleChoice('خطأ')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                userAnswer && userAnswer[0] === 'خطأ'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 hover:border-red-400'
              }`}
            >
              <X className="w-8 h-8 text-red-500" />
              <span className="text-xl font-semibold text-red-700 dark:text-red-400">خطأ</span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary-50 dark:bg-secondary-800 p-4 rounded-lg">
        <p className="text-lg text-secondary-800 dark:text-secondary-200 leading-relaxed">
          {question.text}
        </p>
        <span className="text-sm text-secondary-500 dark:text-secondary-400">
          ({question.points} {question.points > 2 ? 'درجات' : 'درجة'})
        </span>
      </div>
      {renderOptions()}
    </div>
  );
};

export default Question;
