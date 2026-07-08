"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../../context/AuthContext';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function QuizViewer() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  const lessonId = params.lessonId;
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/quizzes/lesson/${lessonId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('No quiz found for this lesson.');
          }
          throw new Error('Failed to load quiz');
        }
        
        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [lessonId]);

  const handleOptionSelect = (qIndex, optionIndex) => {
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formattedAnswers = Object.keys(answers).map(key => ({
        questionIndex: parseInt(key),
        answer: answers[key]
      }));

      const res = await fetch(`http://localhost:5000/api/quizzes/${quiz._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading quiz...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!quiz) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href={`/dashboard/courses/${courseId}/view`} className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium">
            <ArrowLeft size={20} /> Back to Lesson
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          <p className="text-gray-500 mb-8">Answer all questions to pass the lesson.</p>

          {!result ? (
            <div className="space-y-8">
              {quiz.questions.map((q, qIndex) => (
                <div key={q._id || qIndex} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{qIndex + 1}. {q.question}</h3>
                  <div className="space-y-3">
                    {q.options.map((opt, oIndex) => (
                      <label 
                        key={oIndex} 
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                          answers[qIndex] === oIndex 
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                            : 'border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          checked={answers[qIndex] === oIndex}
                          onChange={() => handleOptionSelect(qIndex, oIndex)}
                        />
                        <span className="ml-3 text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center py-8">
              <div className="flex justify-center mb-4">
                {result.passed ? (
                  <CheckCircle size={80} className="text-green-500" />
                ) : (
                  <XCircle size={80} className="text-red-500" />
                )}
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                {result.score}%
              </h2>
              <p className={`text-xl font-medium ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                {result.passed ? 'Congratulations! You passed.' : 'You did not pass. Try again.'}
              </p>
              
              <div className="flex justify-center gap-4 mt-8">
                {!result.passed && (
                  <button
                    onClick={() => {
                      setResult(null);
                      setAnswers({});
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Retry Quiz
                  </button>
                )}
                <Link
                  href={`/dashboard/courses/${courseId}/view`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Return to Course
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
