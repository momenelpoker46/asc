import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMockExam } from '../data/mockExam';
import ExamLobby from '../components/Exam/ExamLobby';
import ExamInterface from '../components/Exam/ExamInterface';
import ExamResults from '../components/Exam/ExamResults';
import { BookOpen } from 'lucide-react';

const Exam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [examStatus, setExamStatus] = useState('lobby'); // lobby, in-progress, completed
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Simulate fetching exam data
    const data = getMockExam(id);
    if (data) {
      setExamData(data);
    }
    setLoading(false);
  }, [id]);

  const handleStartExam = () => {
    setExamStatus('in-progress');
  };

  const handleFinishExam = (finalAnswers) => {
    // Calculate score
    let score = 0;
    examData.questions.forEach(q => {
      const userAnswer = finalAnswers[q.id];
      if (!userAnswer || userAnswer.length === 0) return;

      if (q.type === 'mcq-multiple') {
        const correct = q.correctAnswer;
        const correctCount = userAnswer.filter(ans => correct.includes(ans)).length;
        const incorrectCount = userAnswer.filter(ans => !correct.includes(ans)).length;
        if (correctCount === correct.length && incorrectCount === 0) {
          score += q.points;
        }
      } else {
        if (JSON.stringify(userAnswer) === JSON.stringify(q.correctAnswer)) {
          score += q.points;
        }
      }
    });

    setResults({
      score,
      totalScore: examData.totalScore,
      answers: finalAnswers,
    });
    setExamStatus('completed');
  };

  const handleRetakeExam = () => {
    setResults(null);
    setExamStatus('lobby');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <BookOpen className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          لم يتم العثور على الامتحان
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {examStatus === 'lobby' && (
        <ExamLobby examData={examData} onStart={handleStartExam} />
      )}
      {examStatus === 'in-progress' && (
        <ExamInterface examData={examData} onFinish={handleFinishExam} />
      )}
      {examStatus === 'completed' && (
        <ExamResults 
          results={results} 
          examData={examData}
          onRetake={handleRetakeExam}
          onExit={() => navigate('/exams')}
        />
      )}
    </div>
  );
};

export default Exam;
