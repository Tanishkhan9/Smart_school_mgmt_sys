const DEFAULT_SCALE = [
  { min: 90, grade: 'A+' },
  { min: 80, grade: 'A' },
  { min: 70, grade: 'B+' },
  { min: 60, grade: 'B' },
  { min: 50, grade: 'C' },
  { min: 40, grade: 'D' },
  { min: 0, grade: 'F' },
];

const calculatePercentage = (marks, maxMarks) => {
  if (!maxMarks || maxMarks <= 0) return 0;
  return Math.round((Number(marks) / Number(maxMarks)) * 10000) / 100;
};

const calculateGrade = (percentage, scale = DEFAULT_SCALE) => {
  const ordered = [...scale].sort((a, b) => b.min - a.min);
  const match = ordered.find((band) => percentage >= band.min);
  return match ? match.grade : 'F';
};

const isPass = (grade) => grade !== 'F';

module.exports = {
  DEFAULT_SCALE,
  calculatePercentage,
  calculateGrade,
  isPass,
};
