import React, { useState } from 'react';
import { Plus, Trash2, Save, X, HelpCircle } from 'lucide-react';

export default function ManualCreator({ onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0
    }
  ]);
  const [error, setError] = useState('');

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: '',
        options: ['', '', '', ''],
        correctIndex: 0
      }
    ]);
  };

  const handleRemoveQuestion = (id) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleQuestionTextChange = (id, text) => {
    setQuestions(
      questions.map(q => (q.id === id ? { ...q, text } : q))
    );
  };

  const handleOptionChange = (qId, oIdx, value) => {
    setQuestions(
      questions.map(q => {
        if (q.id === qId) {
          const newOptions = [...q.options];
          newOptions[oIdx] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const handleCorrectOptionChange = (qId, correctIndex) => {
    setQuestions(
      questions.map(q => (q.id === qId ? { ...q, correctIndex } : q))
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!title.trim()) {
      setError('Please provide a quiz title.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setError(`Please fill in the text for Question #${i + 1}.`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          setError(`Please fill in all 4 options for Question #${i + 1}.`);
          return;
        }
      }
    }

    // Save quiz details
    const newQuiz = {
      id: 'manual_' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'Custom created quiz',
      questions: questions.map(q => ({
        question: q.text.trim(),
        options: q.options.map(o => o.trim()),
        correctAnswer: q.options[q.correctIndex].trim(),
        explanation: 'Correct answer selected by quiz creator.'
      })),
      createdAt: new Date().toISOString(),
      type: 'manual'
    };

    onSave(newQuiz);
  };

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 border border-white/5 relative overflow-hidden animate-modal-in">
      {/* Decorative header blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="flex justify-between items-center pb-6 border-b border-white/5 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>✏️</span> Create Custom Quiz
          </h2>
          <p className="text-sm text-gray-400 mt-1">Design a tailored quiz with custom questions and answers.</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer btn-active-scale"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Quiz Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-1">
            <label className="text-sm font-semibold text-gray-300">Quiz Settings</label>
            <p className="text-xs text-gray-500">Provide general details that players will see on their dashboard.</p>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <div>
              <label htmlFor="quiz-title" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quiz Title</label>
              <input
                id="quiz-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. JavaScript Core Concepts"
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-white/5 text-white outline-none transition-all placeholder:text-gray-650 input-focus-glow"
              />
            </div>
            
            <div>
              <label htmlFor="quiz-desc" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description (Optional)</label>
              <textarea
                id="quiz-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this quiz covers..."
                rows="2"
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-white/5 text-white outline-none transition-all placeholder:text-gray-655 resize-none input-focus-glow"
              />
            </div>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              Questions List ({questions.length})
            </h3>
            
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/30 text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition-all cursor-pointer btn-active-scale"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div 
                key={q.id} 
                className="p-6 rounded-2xl bg-gray-950/50 border border-white/5 hover:border-white/10 transition-colors relative group"
              >
                {/* Question Header */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                    Question #{qIndex + 1}
                  </span>
                  
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100 btn-active-scale"
                      title="Remove question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Question Prompt */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                    placeholder="Enter the question prompt..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-white/5 text-white outline-none transition-all placeholder:text-gray-650 font-medium input-focus-glow"
                  />
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((option, oIndex) => {
                    const optionLabel = String.fromCharCode(65 + oIndex); // A, B, C, D
                    const isChecked = q.correctIndex === oIndex;
                    
                    return (
                      <div 
                        key={oIndex} 
                        className={`flex items-center gap-3 p-3 rounded-xl bg-gray-950 border transition-all ${
                          isChecked 
                            ? 'border-emerald-500/40 bg-emerald-500/5 shadow-lg shadow-emerald-500/2' 
                            : 'border-white/5 hover:border-white/10 hover:scale-[1.01]'
                        }`}
                      >
                        {/* Radio Selector */}
                        <label className="relative flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={isChecked}
                            onChange={() => handleCorrectOptionChange(q.id, oIndex)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all">
                            {isChecked && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </label>

                        {/* Option Field */}
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500">{optionLabel}</span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(q.id, oIndex, e.target.value)}
                            placeholder={`Option ${optionLabel}`}
                            className="w-full bg-transparent border-none text-sm text-gray-200 outline-none placeholder:text-gray-700"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-all cursor-pointer btn-active-scale"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 btn-active-scale"
          >
            <Save className="w-4 h-4" /> Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
