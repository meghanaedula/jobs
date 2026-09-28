import React, { useState } from 'react';
import { INITIAL_ASSESSMENT_QUESTIONS } from '../../data/seedData';
import { PracticeQuestion } from '../../types';
import {
  Code2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Award,
} from 'lucide-react';

export const AssessmentHub: React.FC = () => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>(INITIAL_ASSESSMENT_QUESTIONS);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Data Structures & Algorithms', 'DBMS & SQL', 'Quantitative', 'Core CS'];

  const filteredQuestions = questions.filter(
    (q) => selectedCategory === 'All' || q.category === selectedCategory
  );

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    filteredQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: filteredQuestions.length,
      percentage: Math.round((correct / filteredQuestions.length) * 100),
    };
  };

  const score = calculateScore();

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Online Assessment Simulation Lab
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulate corporate Round 1 coding screens, technical MCQs, and quantitative aptitude tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {showResults && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Test</span>
            </button>
          )}

          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Submit & Grade Assessment
            </button>
          ) : null}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedAnswers({});
              setShowResults(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result Card Banner if submitted */}
      {showResults && (
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between animate-in fade-in-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Assessment Evaluation Completed</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Answer key and algorithmic explanations revealed below for your review.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-2xl font-extrabold text-slate-900">
              {score.correct}/{score.total}
            </span>
            <span className="text-xs text-slate-400 font-mono block">({score.percentage}% Accuracy)</span>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const hasAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === q.correctOptionIndex;

          return (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-400">Q{qIndex + 1}.</span>
                  <span className="font-semibold text-slate-700">{q.category}</span>
                  <span className="text-slate-300">&middot;</span>
                  <span className="text-slate-500">{q.difficulty}</span>
                </div>

                {showResults && (
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      isCorrect ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{isCorrect ? 'Correct (+1.0)' : 'Incorrect (0.0)'}</span>
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900">{q.question}</h3>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, optIndex) => {
                  const isSelected = userAnswer === optIndex;
                  const isRightAnswer = optIndex === q.correctOptionIndex;

                  let borderClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                  if (showResults) {
                    if (isRightAnswer) {
                      borderClass = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold';
                    } else if (isSelected && !isRightAnswer) {
                      borderClass = 'border-rose-300 bg-rose-50 text-rose-900';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-slate-900 bg-slate-900 text-white font-semibold';
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-2.5 cursor-pointer ${borderClass}`}
                    >
                      <span className="font-mono text-[11px] font-bold opacity-75">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (revealed upon grading) */}
              {showResults && (
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1 bg-slate-50/70 p-3 rounded-lg">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                    Concept Explanation & Complexity Analysis
                  </span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
