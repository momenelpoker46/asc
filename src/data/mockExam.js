import { faker } from '@faker-js/faker';

const generateQuestions = (count) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(['mcq-single', 'mcq-multiple', 'true-false']);
    let question = {};

    switch (type) {
      case 'mcq-single':
        question = {
          id: i + 1,
          type: 'mcq-single',
          text: `ما هي عاصمة مصر؟ (سؤال ${i + 1})`,
          options: ['القاهرة', 'الاسكندرية', 'الجيزة', 'الأقصر'],
          correctAnswer: ['القاهرة'],
          points: 2,
        };
        break;
      case 'mcq-multiple':
        question = {
          id: i + 1,
          type: 'mcq-multiple',
          text: `أي من التالي يعتبر من ألوان الطيف؟ (سؤال ${i + 1})`,
          options: ['الأحمر', 'الأسود', 'الأزرق', 'الأبيض'],
          correctAnswer: ['الأحمر', 'الأزرق'],
          points: 3,
        };
        break;
      case 'true-false':
        question = {
          id: i + 1,
          type: 'true-false',
          text: `الشمس تدور حول الأرض. (سؤال ${i + 1})`,
          options: ['صواب', 'خطأ'],
          correctAnswer: ['خطأ'],
          points: 1,
        };
        break;
    }
    questions.push(question);
  }
  return questions;
};

export const getMockExam = (id) => {
  const questions = generateQuestions(20);
  const totalScore = questions.reduce((sum, q) => sum + q.points, 0);

  return {
    id,
    title: 'امتحان تجريبي في العلوم العامة',
    subject: 'العلوم العامة',
    grade: 'الثالث الاعدادي',
    type: 'مراجعة',
    duration: 45, // minutes
    questionsCount: questions.length,
    totalScore,
    timingMode: 'general', // 'general' or 'per-question'
    questions,
  };
};
