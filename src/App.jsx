/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Plus, Play, Trash2, Clock, BarChart3, Database } from 'lucide-react';
import ActionCards from './components/ActionCards';
import ManualCreator from './components/ManualCreator';
import AiDocument from './components/AiDocument';
import SurpriseMeModal from './components/SurpriseMeModal';
import RoomLobby from './components/RoomLobby';
import QuizPlayer from './components/QuizPlayer';
import ThemeToggle from './components/ThemeToggle';



export default function App() {
  const [view, setView] = useState('dashboard'); // dashboard, manual-creator, ai-document, room-lobby, quiz-taking
  const [quizzes, setQuizzes] = useState([]);
  const [activeCard, setActiveCard] = useState('room'); // Room Quiz is glowing by default
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [initialJoinCode, setInitialJoinCode] = useState(null);

  // Check URL for room code on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      // Sanitize roomParam: trim spaces, convert to uppercase, strip non-alphanumeric
      const cleaned = roomParam.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (cleaned.length === 6) {
        setInitialJoinCode(cleaned);
        setView('room-lobby');
      }
      // Remove parameter from URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Load quizzes from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('quizverse_saved_quizzes');
      if (stored) {
        // Filter out any quizzes that were previously preloaded
        const parsedQuizzes = JSON.parse(stored).filter(q => q.type !== 'preloaded');
        setQuizzes(parsedQuizzes);
        localStorage.setItem('quizverse_saved_quizzes', JSON.stringify(parsedQuizzes));
      }
    } catch (e) {
      console.error('Failed to load quizzes:', e);
    }
  }, []);

  // Save quizzes helper
  const saveQuizzes = (updated) => {
    setQuizzes(updated);
    localStorage.setItem('quizverse_saved_quizzes', JSON.stringify(updated));
  };

  // Card select logic
  const handleSelectCard = (cardId) => {
    setActiveCard(cardId);
    
    if (cardId === 'manual') {
      setView('manual-creator');
    } else if (cardId === 'ai') {
      setView('ai-document');
    } else if (cardId === 'surprise') {
      setShowSurpriseModal(true);
    } else if (cardId === 'room') {
      setView('room-lobby');
    }
  };

  const handleSaveQuiz = (newQuiz) => {
    const updated = [newQuiz, ...quizzes];
    saveQuizzes(updated);
    setView('dashboard');
  };

  const handleDeleteQuiz = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      const updated = quizzes.filter(q => q.id !== id);
      saveQuizzes(updated);
    }
  };

  const handleStartPlay = (quiz) => {
    setActiveQuiz(quiz);
    setView('quiz-taking');
  };

  const handleSurpriseGenerate = (generatedQuiz) => {
    setShowSurpriseModal(false);
    setActiveQuiz(generatedQuiz);
    setView('quiz-taking');
  };

  const handleExitQuiz = () => {
    setView('dashboard');
    setActiveQuiz(null);
  };

  const formatDate = (isoStr) => {
    try {
      return new Date(isoStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  const getRankInfo = (count) => {
    if (count >= 8) {
      return { 
        title: 'Grandmaster Quizmaster ✨', 
        desc: 'Unrivaled scholar. Keep creating to retain dominance.',
        percentage: 100,
        label: 'MAX LEVEL',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      };
    } else if (count >= 5) {
      return { 
        title: 'Lobby Veteran 🚀', 
        desc: 'Significant command of topics. ' + (8 - count) + ' more quizzes to reach Grandmaster.',
        percentage: Math.round(((count - 5) / 3) * 100),
        label: `${count}/8 Quizzes`,
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
      };
    } else if (count >= 1) {
      return { 
        title: 'Knowledge Seeker 📚', 
        desc: 'Starting the trivia journey. ' + (5 - count) + ' more to reach Lobby Veteran.',
        percentage: Math.round(((count - 1) / 4) * 100),
        label: `${count}/5 Quizzes`,
        color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
      };
    } else {
      return {
        title: 'Novice Quiz-Taker ⏳',
        desc: 'Create or generate your first quiz to unlock user level standing.',
        percentage: 0,
        label: '0/1 Quizzes',
        color: 'text-gray-400 bg-white/5 border-white/10'
      };
    }
  };

  const rank = getRankInfo(quizzes.length);

  return (
    <>
      {/* Background Animated Gradients */}
      <div className="bg-mesh" />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-theme-header-bg backdrop-blur-md border-b border-theme-border transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2.5 text-theme-text-primary hover:opacity-90 transition-opacity cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-display font-black text-xl tracking-tight bg-gradient-to-r from-theme-text-primary to-brand-indigo bg-clip-text text-transparent">
              Quizverse
            </span>
          </button>

          <div className="flex items-center gap-4">
            {view !== 'dashboard' && (
              <button 
                onClick={() => setView('dashboard')}
                className="px-4 py-2 rounded-xl bg-theme-glass-bg border border-theme-border hover:bg-theme-card-bg-hover text-sm font-semibold text-theme-text-secondary hover:text-theme-text-primary transition-all cursor-pointer btn-active-scale"
              >
                Dashboard
              </button>
            )}

            <ThemeToggle />
            
            <button 
              onClick={() => handleSelectCard('manual')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all cursor-pointer btn-active-scale hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">        {view === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in-up">
            
            {/* Left Control Console Column */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
              
              {/* Control Console: Hero Card */}
              <div className="glass-panel rounded-3xl p-6 border border-theme-border relative overflow-hidden bg-gradient-to-b from-indigo-500/5 to-transparent text-left">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 mb-4">
                  <Sparkles className="w-3 h-3" /> Next-Gen Trivia Engine
                </div>
                <h1 className="text-3xl font-black tracking-tight text-theme-text-primary leading-tight font-display mb-2">
                  Quizverse Hub
                </h1>
                <p className="text-theme-text-muted text-xs leading-relaxed font-light">
                  Generate tailored exams manually, parse files with AI models, or play multiplayer rooms.
                </p>
              </div>

              {/* Control Console: Stats Box */}
              <div className="glass-panel rounded-3xl p-6 border border-theme-border relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-indigo-500/2 to-transparent group flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider block mb-0.5">Total Quizzes</span>
                    <span className="text-3xl font-black text-theme-text-primary font-display leading-none">{quizzes.length}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Database className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-theme-border">
                  <div>
                    <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider block mb-0.5">Total Questions</span>
                    <span className="text-3xl font-black text-theme-text-primary font-display leading-none">
                      {quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Control Console: Quizmaster Level Status */}
              <div className="glass-panel rounded-3xl p-6 border border-theme-border relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/2 to-transparent group text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider block mb-1">Quizmaster Rank</span>
                    <h3 className="text-md font-extrabold text-theme-text-primary leading-tight mb-1">
                      {rank.title}
                    </h3>
                    <p className="text-[10px] text-theme-text-muted font-light leading-relaxed">
                      {rank.desc}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[9px] text-theme-text-muted font-bold mb-1">
                    <span>Rank Progress</span>
                    <span>{rank.label}</span>
                  </div>
                  <div className="w-full h-1 bg-theme-bg/85 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                      style={{ width: `${rank.percentage}%` }}
                    />
                  </div>
                </div>
              </div>


            </div>

            {/* Right Main Panel Column */}
            <div className="lg:col-span-2 space-y-10 text-left">
              
              {/* Quick Actions grid */}
              <div className="space-y-4">
                <h2 className="text-lg font-extrabold text-theme-text-primary font-display flex items-center gap-2">
                  <span>⚡</span> Quick Actions
                </h2>
                <ActionCards activeCard={activeCard} onSelectCard={handleSelectCard} />
              </div>

              {/* Saved Quizzes Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-extrabold text-theme-text-primary font-display flex items-center gap-2">
                    <span>📁</span> Saved Quizzes
                  </h2>
                  <span className="text-xs text-theme-text-secondary bg-theme-glass-bg border border-theme-border px-2.5 py-1 rounded-full font-bold">
                    {quizzes.length} Quizzes
                  </span>
                </div>

                {quizzes.length === 0 ? (
                  <div className="glass-panel rounded-3xl p-12 text-center border border-theme-border">
                    <Database className="w-12 h-12 text-theme-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-theme-text-primary mb-1">No quizzes saved yet</h3>
                    <p className="text-sm text-theme-text-secondary max-w-sm mx-auto mb-6">
                      Create a custom quiz or upload document pages to construct one automatically.
                    </p>
                    <button
                      onClick={() => handleSelectCard('manual')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-indigo-600/10 btn-active-scale"
                    >
                      <Plus className="w-4 h-4" /> Create First Quiz
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map((quiz) => (
                      <div 
                        key={quiz.id}
                        onClick={() => handleStartPlay(quiz)}
                        className="glass-panel glass-panel-hover rounded-2xl p-6 border border-theme-border flex flex-col justify-between h-full cursor-pointer relative group btn-active-scale"
                      >
                        <div>
                          {/* Meta badge */}
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-2">
                              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border ${
                                quiz.type === 'preloaded' 
                                    ? 'text-theme-text-muted bg-theme-glass-bg border-theme-border' 
                                    : quiz.type === 'manual' 
                                      ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
                                      : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                              }`}>
                                {quiz.type || 'Custom'}
                              </span>
                              {quiz.difficulty && (
                                <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border ${
                                  quiz.difficulty === 'Easy'
                                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                    : quiz.difficulty === 'Medium'
                                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                      : 'text-rose-450 bg-rose-500/10 border-rose-500/20'
                                }`}>
                                  {quiz.difficulty}
                                </span>
                              )}
                            </div>

                            <span className="inline-flex items-center gap-1 text-xs text-theme-text-muted font-medium">
                              <Clock className="w-3.5 h-3.5" /> {formatDate(quiz.createdAt)}
                            </span>
                          </div>

                          <h3 className="text-md font-bold text-theme-text-primary mb-2 group-hover:text-indigo-400 transition-colors">
                            {quiz.title}
                          </h3>

                          <p className="text-xs text-theme-text-secondary leading-relaxed font-light mb-6 line-clamp-2">
                            {quiz.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-theme-border">
                          <span className="text-xs font-bold text-theme-text-muted flex items-center gap-1.5">
                            <BarChart3 className="w-4 h-4 text-indigo-400" />
                            {quiz.questions?.length || 0} Questions
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {/* Delete button */}
                            <button
                              onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                              className="p-2 rounded-lg bg-theme-glass-bg border border-theme-border hover:bg-rose-500/10 hover:border-rose-500/20 text-theme-text-muted hover:text-rose-400 transition-all cursor-pointer btn-active-scale"
                              title="Delete quiz"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            {/* Play button */}
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartPlay(quiz);
                              }}
                              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-indigo-600/10 btn-active-scale"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> Play
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* Manual Creator View */}
        {view === 'manual-creator' && (
          <ManualCreator 
            onSave={handleSaveQuiz} 
            onCancel={() => setView('dashboard')} 
          />
        )}

        {/* AI from Document View */}
        {view === 'ai-document' && (
          <AiDocument 
            onSave={handleSaveQuiz} 
            onCancel={() => setView('dashboard')} 
          />
        )}

        {/* Room Multiplayer Lobby View */}
        {view === 'room-lobby' && (
          <RoomLobby 
            savedQuizzes={quizzes}
            initialJoinCode={initialJoinCode}
            onStartQuiz={handleStartPlay}
            onCancel={() => {
              setInitialJoinCode(null);
              setView('dashboard');
            }} 
          />
        )}

        {/* Quiz Taking View */}
        {view === 'quiz-taking' && activeQuiz && (
          <QuizPlayer 
            quiz={activeQuiz} 
            onExit={handleExitQuiz} 
          />
        )}

      </main>

      {/* Surprise Me Topic Modal */}
      {showSurpriseModal && (
        <SurpriseMeModal 
          onGenerate={handleSurpriseGenerate} 
          onClose={() => setShowSurpriseModal(false)} 
        />
      )}
    </>
  );
}
