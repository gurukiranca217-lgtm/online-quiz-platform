import { useState, useEffect } from 'react';
import { Check, X, Award, RotateCcw, Home, ChevronRight, FileText } from 'lucide-react';
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function QuizPlayer({ quiz, onExit }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answersLog, setAnswersLog] = useState([]); // tracks correct/incorrect per question
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (quiz.type !== 'room' && !quiz.id?.startsWith('room_')) return;

    const roomCode = quiz.id.replace('room_', '');
    const roomRef = doc(db, 'rooms', roomCode);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();
      const roster = data.players || [];
      const updatedLeaderboard = roster.map(player => {
        const isMe = player.id === 'host' 
          ? (quiz.myNickname === 'You (Host)') 
          : (player.name === quiz.myNickname);

        return {
          name: isMe && !player.name.endsWith(' (You)') ? `${player.name} (You)` : player.name,
          id: player.id,
          score: player.score !== undefined ? player.score : -1,
          color: player.avatarColor || 'bg-gray-600',
          isMe
        };
      });

      // Sort: completed scores first (highest to lowest), then pending players (-1)
      updatedLeaderboard.sort((a, b) => b.score - a.score);
      setLeaderboard(updatedLeaderboard);
    });

    return () => {
      unsubscribe();
    };
  }, [quiz]);

  const questions = quiz.questions || [];
  const activeQ = questions[currentIdx];
  const totalQ = questions.length;

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    
    const isCorrect = option === activeQ.correctAnswer;
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswersLog(prev => [...prev, {
      questionIdx: currentIdx,
      selected: option,
      correct: activeQ.correctAnswer,
      isCorrect
    }]);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    
    if (currentIdx < totalQ - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      const finalScore = answersLog.reduce((acc, entry) => acc + (entry.isCorrect ? 1 : 0), 0);

      if (quiz.type === 'room' || quiz.id?.startsWith('room_')) {
        const roomCode = quiz.id.replace('room_', '');
        const roomRef = doc(db, 'rooms', roomCode);

        const updateScoreInDb = async () => {
          try {
            const roomSnap = await getDoc(roomRef);
            if (!roomSnap.exists()) return;

            const roomData = roomSnap.data();
            const currentPlayers = roomData.players || [];

            // Identify local player ID
            const myPlayer = quiz.roomPlayers?.find(p => {
              return p.id === 'host' ? (quiz.myNickname === 'You (Host)') : (p.name === quiz.myNickname);
            });
            const myId = myPlayer ? myPlayer.id : 'unknown';

            const updatedPlayers = currentPlayers.map(p => {
              if (p.id === myId) {
                return { ...p, score: finalScore };
              }
              return p;
            });

            await updateDoc(roomRef, {
              players: updatedPlayers
            });
          } catch (err) {
            console.error("Error updating player score in db:", err);
          }
        };

        updateScoreInDb();
      } else {
        const simulatedSoloPlayers = [
          { name: 'TriviaMaster', score: totalQ, color: 'bg-indigo-500' },
          { name: 'Brainiac', score: Math.max(0, totalQ - 1), color: 'bg-purple-500' },
          { name: 'FastThinker', score: Math.max(0, totalQ - 2), color: 'bg-amber-500' },
          { name: 'LuckyGuesser', score: Math.max(0, Math.round(totalQ * 0.4)), color: 'bg-pink-500' }
        ];
        const allPlayers = [
          ...simulatedSoloPlayers,
          { name: 'You', score: finalScore, color: 'bg-emerald-500', isMe: true }
        ];
        allPlayers.sort((a, b) => b.score - a.score);
        setLeaderboard(allPlayers);
      }
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnswersLog([]);
    setLeaderboard([]);
  };

  const percentScore = Math.round((score / totalQ) * 100);
  
  // Calculate letter grade
  let grade = 'F';
  if (percentScore >= 90) grade = 'A';
  else if (percentScore >= 80) grade = 'B';
  else if (percentScore >= 70) grade = 'C';
  else if (percentScore >= 60) grade = 'D';

  let gradeGlow = 'shadow-[0_0_30px_rgba(244,63,94,0.15)]';
  if (percentScore >= 80) gradeGlow = 'shadow-[0_0_35px_rgba(16,185,129,0.25)]';
  else if (percentScore >= 50) gradeGlow = 'shadow-[0_0_35px_rgba(99,102,241,0.25)]';

  // Custom rank description
  let rankTitle = 'Novice 📚';
  let rankDesc = 'Keep studying! There is always room to grow and improve your knowledge.';
  let rankColor = 'text-brand-rose';
  let ringColor = 'border-brand-rose';

  if (percentScore >= 80) {
    rankTitle = 'Grandmaster ✨';
    rankDesc = 'Phenomenal job! You have fully mastered this topic and set a new standard.';
    rankColor = 'text-brand-emerald';
    ringColor = 'border-brand-emerald';
  } else if (percentScore >= 50) {
    rankTitle = 'Explorer 🚀';
    rankDesc = 'Great effort! You have a solid grasp, but there are a few concepts to polish.';
    rankColor = 'text-brand-indigo';
    ringColor = 'border-brand-indigo';
  }

  return (
    <div className="max-w-3xl mx-auto">
      {!showResults ? (
        /* Quiz Play Mode */
        <div className="glass-panel rounded-3xl p-8 border border-theme-border relative overflow-hidden animate-modal-in">
          {/* Header Stats */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                Active Session
              </span>
              <h2 className="text-xl font-black text-theme-text-primary truncate max-w-md font-display">{quiz.title}</h2>
            </div>
            
            <div className="bg-theme-glass-bg border border-theme-border px-3.5 py-1.5 rounded-xl text-xs font-bold text-theme-text-secondary">
              Q: {currentIdx + 1} / {totalQ}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-theme-bg rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="mb-8">
            <h3 className="text-lg md:text-xl font-bold text-theme-text-primary leading-relaxed mb-6 font-display">
              {activeQ.question}
            </h3>

            {/* Options grid */}
            <div className="grid grid-cols-1 gap-4">
              {activeQ.options.map((option, oIdx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === activeQ.correctAnswer;
                
                // Color formatting
                let optionStyle = 'border-theme-border bg-theme-input-bg/50 text-theme-text-secondary hover:border-indigo-500/30 hover:bg-theme-card-bg-hover hover:scale-[1.01] transition-transform';
                let iconElement = null;

                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
                    iconElement = <Check className="w-4 h-4 text-emerald-500" />;
                  } else if (isSelected) {
                    optionStyle = 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
                    iconElement = <X className="w-4 h-4 text-rose-500" />;
                  } else {
                    optionStyle = 'border-theme-border bg-theme-input-bg/20 text-theme-text-muted opacity-50';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleOptionClick(option)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border flex items-center justify-between font-medium transition-all duration-200 cursor-pointer btn-active-scale ${optionStyle} ${
                      !isAnswered && 'hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isAnswered && isCorrect 
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' 
                          : isAnswered && isSelected 
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300' 
                            : 'bg-theme-glass-bg border border-theme-border text-theme-text-muted'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span>{option}</span>
                    </div>
                    {iconElement}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className="mb-8 p-4 rounded-2xl bg-indigo-500/5 border-l-4 border-indigo-500 text-sm leading-relaxed text-theme-text-secondary animate-fade-in">
              <span className="font-bold text-indigo-400 block mb-1">Explanation</span>
              {activeQ.explanation || 'Review the correct choice shown above.'}
            </div>
          )}

          {/* Footer Action */}
          <div className="flex justify-between items-center pt-6 border-t border-theme-border">
            {/* Question dots */}
            <div className="flex gap-2">
              {questions.map((_, dotIdx) => {
                const isCurrent = dotIdx === currentIdx;
                const wasAnswered = answersLog.length > dotIdx;
                const wasCorrect = wasAnswered && answersLog[dotIdx].isCorrect;

                return (
                  <div 
                    key={dotIdx}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isCurrent 
                        ? 'bg-indigo-500 scale-125' 
                        : wasAnswered 
                          ? wasCorrect 
                            ? 'bg-emerald-500' 
                            : 'bg-rose-500'
                          : 'bg-gray-300 dark:bg-gray-800'
                    }`}
                  />
                );
              })}
            </div>

            {isAnswered ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-indigo-600/10 hover:translate-y-[-1px] btn-active-scale"
              >
                {currentIdx < totalQ - 1 ? 'Next Question' : 'View Results'}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onExit}
                className="px-4 py-2.5 rounded-xl hover:bg-theme-card-bg-hover border border-transparent hover:border-theme-border text-xs font-semibold text-theme-text-secondary hover:text-theme-text-primary transition-all cursor-pointer btn-active-scale"
              >
                Quit Session
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Mode */
        <div className="glass-panel rounded-3xl p-10 border border-theme-border relative overflow-hidden animate-modal-in">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <Award className="w-16 h-16 text-indigo-400 mx-auto mb-4 animate-bounce" />
          
          <h2 className="text-3xl font-black text-theme-text-primary tracking-tight mb-1 text-center font-display">Session Summary</h2>
          <p className="text-sm text-theme-text-muted max-w-sm mx-auto mb-8 text-center">
            Quiz: <span className="text-theme-text-primary font-semibold">{quiz.title}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-left">
            {/* Left: Score display & Grade */}
            <div className="glass-panel bg-theme-panel-bg/30 p-6 rounded-2xl border border-theme-border flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider block mb-4">Your Grade</span>
              <div className={`inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-theme-border bg-theme-input-bg/85 relative mb-4 ${gradeGlow} transition-all duration-555`}>
                <div className={`absolute inset-0.5 rounded-full border-4 ${ringColor} opacity-75`} />
                <span className="text-5xl font-black text-theme-text-primary relative leading-none font-display">{grade}</span>
                <span className="text-xs font-bold text-theme-text-muted mt-2 relative">{percentScore}% ({score}/{totalQ})</span>
              </div>
              <h4 className={`text-md font-bold mb-1 ${rankColor} font-display`}>{rankTitle}</h4>
              <p className="text-xs text-theme-text-secondary leading-relaxed max-w-xs">{rankDesc}</p>
            </div>

            {/* Right: Leaderboard (for both Room and Solo quizzes) */}
            <div className="glass-panel bg-theme-panel-bg/30 p-6 rounded-2xl border border-theme-border flex flex-col justify-between min-h-[260px]">
              <span className={`text-xs font-bold uppercase tracking-wider block text-center mb-4 ${
                quiz.type === 'room' || quiz.id?.startsWith('room_') ? 'text-emerald-400' : 'text-indigo-400'
              }`}>
                {quiz.type === 'room' || quiz.id?.startsWith('room_') ? 'Lobby Leaderboard' : 'Global Leaderboard'}
              </span>
              
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] pr-1">
                {leaderboard.map((player, index) => {
                  const isMe = player.isMe;
                  const rankMedals = ['🥇', '🥈', '🥉'];
                  const rankBadge = index < 3 ? rankMedals[index] : `#${index + 1}`;
                  
                  return (
                    <div 
                      key={player.id || player.name} 
                      className={`flex items-center justify-between p-2.5 rounded-xl border hover:scale-[1.01] transition-transform ${
                        isMe 
                          ? 'border-emerald-500/30 bg-emerald-500/10' 
                          : 'border-theme-border bg-theme-input-bg/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-6 text-center">{rankBadge}</span>
                        <div className={`w-7 h-7 rounded-lg ${player.color} flex items-center justify-center text-white font-bold text-xs`}>
                          {player.name.charAt(0)}
                        </div>
                        <span className={`text-xs ${isMe ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-theme-text-secondary font-semibold'}`}>
                          {player.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-theme-text-primary font-display">
                        {player.score === -1 ? (
                          <span className="text-amber-400 animate-pulse text-[10px] uppercase font-semibold">Taking...</span>
                        ) : (
                          `${player.score} / ${totalQ}`
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Correct Answers & Review List */}
          <div className="text-left mb-8">
            <h3 className="text-lg font-bold text-theme-text-primary mb-4 flex items-center gap-2 font-display">
              <FileText className="w-5 h-5 text-indigo-400" /> Correct Answers & Review
            </h3>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {questions.map((q, idx) => {
                const logEntry = answersLog.find(log => log.questionIdx === idx);
                const isCorrect = logEntry ? logEntry.isCorrect : false;
                const selected = logEntry ? logEntry.selected : 'None';
                
                return (
                  <div key={idx} className="p-4 rounded-xl bg-theme-input-bg/60 border border-theme-border space-y-2 hover:border-theme-border/60 hover:scale-[1.003] transition-all">
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="text-sm font-bold text-theme-text-primary leading-relaxed font-display">
                        {idx + 1}. {q.question}
                      </h4>
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        isCorrect 
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                          : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                      <div className={`p-2 rounded-lg ${
                        isCorrect 
                          ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-300 border border-emerald-500/10' 
                          : 'bg-rose-500/5 text-rose-600 dark:text-rose-300 border border-rose-500/10'
                      }`}>
                        <span className="font-bold block text-[10px] text-theme-text-muted uppercase mb-0.5">Your Answer</span>
                        {selected}
                      </div>

                      {!isCorrect && (
                        <div className="p-2 rounded-lg bg-emerald-500/5 text-emerald-600 dark:text-emerald-300 border border-emerald-500/10">
                          <span className="font-bold block text-[10px] text-theme-text-muted uppercase mb-0.5">Correct Answer</span>
                          {q.correctAnswer}
                        </div>
                      )}
                    </div>

                    {q.explanation && (
                      <p className="text-xs text-theme-text-secondary leading-relaxed bg-theme-input-bg/30 p-2 rounded-lg mt-2">
                        <span className="font-bold text-indigo-400 mr-1">Explanation:</span>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-4 max-w-md mx-auto pt-6 border-t border-theme-border">
            <button
              onClick={handleRestart}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-theme-glass-bg border border-theme-border hover:bg-theme-card-bg-hover text-theme-text-primary font-bold text-sm transition-all cursor-pointer btn-active-scale"
            >
              <RotateCcw className="w-4 h-4" /> Retake Quiz
            </button>
            <button
              onClick={onExit}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/10 transition-all cursor-pointer btn-active-scale"
            >
              <Home className="w-4 h-4" /> Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
