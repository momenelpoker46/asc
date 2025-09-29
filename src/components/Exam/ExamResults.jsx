import React from 'react';
import { motion } from 'framer-motion';
import { Award, Check, X, Repeat, LogOut, PieChart } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const ExamResults = ({ results, examData, onRetake, onExit }) => {
  const { score, totalScore, answers } = results;
  const percentage = (score / totalScore) * 100;

  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unanswered = 0;

  examData.questions.forEach(q => {
    const userAnswer = answers[q.id];
    if (!userAnswer || userAnswer.length === 0) {
      unanswered++;
      return;
    }

    let isCorrect = false;
    if (q.type === 'mcq-multiple') {
      const correct = q.correctAnswer;
      const correctCount = userAnswer.filter(ans => correct.includes(ans)).length;
      const incorrectCount = userAnswer.filter(ans => !correct.includes(ans)).length;
      if (correctCount === correct.length && incorrectCount === 0) {
        isCorrect = true;
      }
    } else {
      if (JSON.stringify(userAnswer) === JSON.stringify(q.correctAnswer)) {
        isCorrect = true;
      }
    }
    
    if (isCorrect) {
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }
  });

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { msg: 'أداء ممتاز! أنت نجم!', color: 'text-green-500' };
    if (percentage >= 75) return { msg: 'أداء رائع! استمر في التقدم!', color: 'text-blue-500' };
    if (percentage >= 50) return { msg: 'عمل جيد! يمكنك تحقيق المزيد.', color: 'text-yellow-500' };
    return { msg: 'لا تستسلم! حاول مرة أخرى لتحسين نتيجتك.', color: 'text-red-500' };
  };
  
  const performance = getPerformanceMessage();

  const chartOptions = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#94a3b8' }
    },
    series: [
      {
        name: 'تحليل الإجابات',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: { show: false },
        data: [
          { value: correctAnswers, name: 'صحيحة', itemStyle: { color: '#22c55e' } },
          { value: incorrectAnswers, name: 'خاطئة', itemStyle: { color: '#ef4444' } },
          { value: unanswered, name: 'لم تتم الإجابة', itemStyle: { color: '#64748b' } }
        ]
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-8 text-center space-y-8"
    >
      <div className="space-y-4">
        <Award className="w-20 h-20 mx-auto text-yellow-500" />
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          اكتمل الامتحان!
        </h1>
        <p className={`text-xl font-semibold ${performance.color}`}>
          {performance.msg}
        </p>
      </div>

      <div className="bg-primary-50 dark:bg-secondary-800 p-6 rounded-xl space-y-4">
        <p className="text-lg text-secondary-700 dark:text-secondary-300">درجتك النهائية هي:</p>
        <p className="text-6xl font-bold text-primary-600 dark:text-primary-400">
          {score} <span className="text-3xl text-secondary-500">/ {totalScore}</span>
        </p>
        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-secondary-50 dark:bg-secondary-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center justify-center space-x-2 space-x-reverse">
            <PieChart className="w-5 h-5"/>
            <span>ملخص الأداء</span>
          </h3>
          <div style={{ height: '200px' }}>
            <ReactECharts option={chartOptions} style={{ height: '100%' }} />
          </div>
        </div>
        <div className="bg-secondary-50 dark:bg-secondary-800 p-6 rounded-xl flex flex-col justify-center space-y-4">
            <div className="flex justify-between items-center text-lg">
                <span className="flex items-center space-x-2 space-x-reverse text-green-600 dark:text-green-400"><Check/><span>إجابات صحيحة</span></span>
                <span className="font-bold text-green-600 dark:text-green-400">{correctAnswers}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
                <span className="flex items-center space-x-2 space-x-reverse text-red-600 dark:text-red-400"><X/><span>إجابات خاطئة</span></span>
                <span className="font-bold text-red-600 dark:text-red-400">{incorrectAnswers}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
                <span className="flex items-center space-x-2 space-x-reverse text-secondary-600 dark:text-secondary-400"><X/><span>بدون إجابة</span></span>
                <span className="font-bold text-secondary-600 dark:text-secondary-400">{unanswered}</span>
            </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={onRetake}
          className="btn-primary flex items-center justify-center space-x-2 space-x-reverse py-3 px-6"
        >
          <Repeat className="w-5 h-5" />
          <span>إعادة الامتحان</span>
        </button>
        <button
          onClick={onExit}
          className="btn-secondary flex items-center justify-center space-x-2 space-x-reverse py-3 px-6"
        >
          <LogOut className="w-5 h-5" />
          <span>العودة لصفحة الامتحانات</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ExamResults;
