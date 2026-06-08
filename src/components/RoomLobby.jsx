import { useState, useEffect } from 'react';
import { Users, UserPlus, Play, Clipboard, ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ManualCreator from './ManualCreator';
import AiDocument from './AiDocument';
import SurpriseMeModal from './SurpriseMeModal';
import { doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function RoomLobby({ savedQuizzes, initialJoinCode, onStartQuiz, onCancel }) {
  const [lobbyView, setLobbyView] = useState(initialJoinCode ? 'join' : 'landing'); // landing, host, join, lobby
  const [subView, setSubView] = useState('lobby-main'); // lobby-main, choose-saved, create-manual, upload-ai
  const [showSurprise, setShowSurprise] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState(initialJoinCode || '');
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 3000);
  };

  // Default preloaded room quiz
  const [selectedRoomQuiz, setSelectedRoomQuiz] = useState({
    title: 'Room Trivia Challenge',
    description: 'Multiplayer Arena quiz. Quick-fire general knowledge questions!',
    questions: [
      {
        question: 'Which of the following describes the function of DNS?',
        options: ['Resolves IP addresses to domain names', 'Encrypts user passwords', 'Styles webpage structures', 'Compiles JavaScript modules'],
        correctAnswer: 'Resolves IP addresses to domain names',
        explanation: 'The Domain Name System (DNS) maps human-readable domains (like google.com) to machine IP addresses.'
      },
      {
        question: 'What is the main chemical component of sand?',
        options: ['Calcium Carbonate', 'Silicon Dioxide', 'Sodium Chloride', 'Iron Oxide'],
        correctAnswer: 'Silicon Dioxide',
        explanation: 'Sand is primarily composed of silicon dioxide (silica), typically in the form of quartz.'
      },
      {
        question: 'In computer science, what does the acronym RAM stand for?',
        options: ['Random Access Memory', 'Read Active Module', 'Rapid Allocation Memory', 'Run Application Machine'],
        correctAnswer: 'Random Access Memory',
        explanation: 'RAM stands for Random Access Memory, which is volatile workspace memory for active processes.'
      },
      {
        question: 'Which ocean current keeps Western Europe relatively warm?',
        options: ['The California Current', 'The Gulf Stream', 'The Labrador Current', 'The Benguela Current'],
        correctAnswer: 'The Gulf Stream',
        explanation: 'The Gulf Stream is a warm Atlantic ocean current that maintains warmer climates in Northwestern Europe.'
      },
      {
        question: 'What is the binary representation of the decimal number 10?',
        options: ['1001', '1010', '1100', '1111'],
        correctAnswer: '1010',
        explanation: 'Decimal 10 translates to binary 1010 (8 + 2).'
      }
    ]
  });

  // Generate 6-digit room code
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateRoom = async () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    setJoinError('');
    localStorage.removeItem('quizverse_scores_' + code);
    
    const initialPlayers = [{ name: 'You (Host)', id: 'host', avatarColor: 'bg-indigo-500', score: -1 }];
    setPlayers(initialPlayers);
    setLobbyView('lobby');

    try {
      await setDoc(doc(db, 'rooms', code), {
        roomCode: code,
        status: 'waiting',
        hostId: 'host',
        quiz: selectedRoomQuiz,
        players: initialPlayers,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Firebase Room Creation Error details:", {
        code: err.code,
        message: err.message,
        name: err.name,
        fullError: err
      });
      setJoinError(`Failed to create room in database: ${err.message || 'Check connection.'}`);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setJoinError('');
    const enteredCode = joinCodeInput.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
    if (!enteredCode || enteredCode.length !== 6) {
      setJoinError('Please enter a valid 6-digit room code.');
      return;
    }
    if (!nickname.trim()) {
      setJoinError('Please enter a nickname.');
      return;
    }

    setIsConnecting(true);
    const guestId = 'guest_' + Date.now();
    localStorage.removeItem('quizverse_scores_' + enteredCode);

    try {
      const roomRef = doc(db, 'rooms', enteredCode);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        setJoinError(`No active room found with code "${enteredCode}". Please check the code or ensure the Host is in the lobby.`);
        setIsConnecting(false);
        return;
      }

      const roomData = roomSnap.data();
      if (roomData.status !== 'waiting') {
        setJoinError(`Room "${enteredCode}" is already in progress.`);
        setIsConnecting(false);
        return;
      }

      const currentPlayers = roomData.players || [];
      if (currentPlayers.length >= 6) {
        setJoinError(`Room "${enteredCode}" is full (maximum 6 players).`);
        setIsConnecting(false);
        return;
      }

      const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const newPlayer = {
        name: nickname.trim(),
        id: guestId,
        avatarColor: color,
        score: -1
      };

      const updatedPlayers = [...currentPlayers, newPlayer];

      await updateDoc(roomRef, {
        players: updatedPlayers
      });

      setRoomCode(enteredCode);
      setIsHost(false);
      setNickname(nickname.trim());
      setMyPlayerId(guestId);
      setPlayers(updatedPlayers);
      setLobbyView('lobby');
    } catch (err) {
      console.error("Firebase Join Room Error details:", {
        code: err.code,
        message: err.message,
        name: err.name,
        fullError: err
      });
      setJoinError(`Connection error. Failed to join room: ${err.message || 'Check connection.'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Sync lobby states and game countdown status via Firestore real-time snapshots
  useEffect(() => {
    if (!roomCode) return;

    const roomRef = doc(db, 'rooms', roomCode);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();

      if (data.quiz) {
        setSelectedRoomQuiz(data.quiz);
      }

      if (data.players) {
        const mapped = data.players.map(p => {
          if (p.id === 'host') {
            return { ...p, name: 'Host' };
          }
          if (p.id === myPlayerId) {
            return { ...p, name: p.name.endsWith(' (You)') ? p.name : p.name + ' (You)' };
          }
          return p;
        });
        setPlayers(mapped);
      }

      if (data.status === 'countdown' && countdown === null) {
        setCountdown(3);
      }
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
    });

    return () => {
      unsubscribe();
    };
  }, [roomCode, myPlayerId, countdown]);

  // Host updates quiz selection in Firestore
  useEffect(() => {
    if (!isHost || !roomCode || !selectedRoomQuiz) return;

    const updateRoomQuiz = async () => {
      try {
        const roomRef = doc(db, 'rooms', roomCode);
        await updateDoc(roomRef, {
          quiz: selectedRoomQuiz
        });
      } catch (error) {
        console.error("Error updating room quiz:", error);
      }
    };

    updateRoomQuiz();
  }, [selectedRoomQuiz, isHost, roomCode]);

  // Sync host starting game countdown logic
  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Trigger multiplayer quiz match with selected quiz
      const roomQuiz = {
        ...selectedRoomQuiz,
        id: 'room_' + roomCode,
        title: selectedRoomQuiz.title.startsWith('Live Match:') 
          ? selectedRoomQuiz.title 
          : `Live Match: ${selectedRoomQuiz.title}`,
        createdAt: new Date().toISOString(),
        type: 'room',
        roomPlayers: players,
        myNickname: isHost ? 'You (Host)' : nickname
      };
      onStartQuiz(roomQuiz);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    showToast('Room code copied to clipboard!');
  };

  const handleStartMatch = async () => {
    if (!roomCode) return;
    try {
      const roomRef = doc(db, 'rooms', roomCode);
      await updateDoc(roomRef, {
        status: 'countdown'
      });
      setCountdown(3);
    } catch (err) {
      console.error(err);
      setJoinError('Failed to start the match in database.');
    }
  };

  // Sub-routing for nested creation options inside the lobby
  if (subView === 'create-manual') {
    return (
      <ManualCreator 
        onSave={(newQuiz) => {
          setSelectedRoomQuiz(newQuiz);
          setSubView('lobby-main');
        }}
        onCancel={() => setSubView('lobby-main')}
      />
    );
  }

  if (subView === 'upload-ai') {
    return (
      <AiDocument 
        onSave={(newQuiz) => {
          setSelectedRoomQuiz(newQuiz);
          setSubView('lobby-main');
        }}
        onCancel={() => setSubView('lobby-main')}
      />
    );
  }

  if (subView === 'choose-saved') {
    return (
      <div className="max-w-xl mx-auto glass-panel rounded-3xl p-8 border border-theme-border text-left relative overflow-hidden">
        <div className="flex justify-between items-center pb-6 border-b border-theme-border mb-6">
          <h3 className="text-lg font-bold text-theme-text-primary flex items-center gap-2">
            📁 Select Lobby Quiz
          </h3>
          <button
            onClick={() => setSubView('lobby-main')}
            className="p-1.5 rounded-lg bg-theme-glass-bg border border-theme-border hover:bg-theme-card-bg-hover text-theme-text-secondary hover:text-theme-text-primary transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 mb-6">
          {savedQuizzes && savedQuizzes.length > 0 ? (
            savedQuizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => {
                  setSelectedRoomQuiz(quiz);
                  setSubView('lobby-main');
                }}
                className="w-full text-left p-4 rounded-xl border border-theme-border hover:border-indigo-500/30 hover:bg-theme-card-bg-hover cursor-pointer transition-all flex justify-between items-center"
              >
                <div>
                  <h4 className="text-sm font-bold text-theme-text-primary mb-0.5">{quiz.title}</h4>
                  <p className="text-xs text-theme-text-secondary line-clamp-1">{quiz.description}</p>
                </div>
                <span className="text-xs font-bold text-indigo-400 shrink-0">
                  {quiz.questions?.length || 0} Qs
                </span>
              </button>
            ))
          ) : (
            <div className="text-center py-6 text-sm text-theme-text-muted">
              No saved quizzes available. Build a custom quiz or generate one using AI first!
            </div>
          )}
        </div>

        <button
          onClick={() => setSubView('lobby-main')}
          className="w-full py-2.5 rounded-xl bg-theme-glass-bg hover:bg-theme-card-bg-hover border border-theme-border text-theme-text-primary font-semibold text-sm transition-all cursor-pointer text-center"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 border border-theme-border relative overflow-hidden text-center animate-modal-in">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {countdown !== null ? (
        /* Countdown screen */
        <div className="py-16 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-extrabold text-theme-text-primary mb-6 uppercase tracking-wider font-display">Starting Room Quiz</h2>
          <div className="w-32 h-32 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10 animate-bounce mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <span className="text-6xl font-black text-emerald-400 font-display">{countdown}</span>
          </div>
          <p className="text-theme-text-muted text-sm pulse-status">Syncing lobbies across nodes...</p>
        </div>
      ) : lobbyView === 'landing' ? (
        /* Multiplayer Option Selector */
        <div>
          <div className="flex justify-between items-center pb-6 border-b border-theme-border mb-8">
            <div className="text-left">
              <h2 className="text-2xl font-extrabold text-theme-text-primary tracking-tight flex items-center gap-2">
                <span>🏠</span> Multiplayer Room Quiz
              </h2>
              <p className="text-sm text-theme-text-muted mt-1">Host a live trivia match or compete in a friend's custom room.</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-xl bg-theme-glass-bg border border-theme-border hover:bg-theme-card-bg-hover text-theme-text-secondary hover:text-theme-text-primary transition-all cursor-pointer btn-active-scale"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            {/* Host card */}
            <div className="glass-panel border-theme-border hover:border-emerald-500/25 p-8 rounded-2xl flex flex-col justify-between hover:bg-theme-card-bg-hover transition-all duration-300 hover:scale-[1.025] hover:-translate-y-0.5 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-theme-text-primary mb-2 font-display">Create a Room</h3>
                <p className="text-sm text-theme-text-secondary leading-relaxed mb-6">
                  Generate a 6-digit room code, become the host, invite players, and control when the quiz starts.
                </p>
              </div>
              <button
                onClick={handleCreateRoom}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-555 text-white font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-600/15 btn-active-scale"
              >
                Host Lobby
              </button>
            </div>

            {/* Join card */}
            <div className="glass-panel border-theme-border hover:border-indigo-500/25 p-8 rounded-2xl flex flex-col justify-between hover:bg-theme-card-bg-hover transition-all duration-300 hover:scale-[1.025] hover:-translate-y-0.5 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-theme-text-primary mb-2 font-display">Join a Room</h3>
                <p className="text-sm text-theme-text-secondary leading-relaxed mb-6">
                  Got a lobby code? Input it along with a nickname to join the queue and play against others.
                </p>
              </div>
              <button
                onClick={() => setLobbyView('join')}
                className="w-full py-3 rounded-xl bg-theme-glass-bg border border-theme-border hover:bg-theme-card-bg-hover text-theme-text-primary font-semibold text-sm transition-all cursor-pointer btn-active-scale"
              >
                Join Lobby
              </button>
            </div>
          </div>
        </div>
      ) : lobbyView === 'join' ? (
        /* Join Room Form */
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center pb-6 border-b border-theme-border mb-8">
            <h3 className="text-lg font-bold text-theme-text-primary flex items-center gap-2 font-display">
              <UserPlus className="w-5 h-5 text-indigo-400" /> Join Room
            </h3>
            <button
              onClick={() => setLobbyView('landing')}
              className="p-1.5 rounded-lg bg-theme-glass-bg border border-theme-border hover:bg-theme-card-bg-hover text-theme-text-secondary hover:text-theme-text-primary transition-all cursor-pointer btn-active-scale"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleJoinSubmit} className="space-y-5 text-left">
            {joinError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold leading-relaxed animate-fade-in text-center">
                ⚠️ {joinError}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-2">6-Digit Room Code</label>
              <input
                type="text"
                maxLength="6"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="e.g. AB47X9"
                className="w-full px-4 py-3 rounded-xl bg-theme-input-bg border border-theme-border text-theme-input-text text-center font-mono font-bold tracking-widest outline-none transition-all placeholder:font-sans placeholder:tracking-normal placeholder:text-theme-text-muted/40 input-focus-glow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-2">Your Nickname</label>
              <input
                type="text"
                maxLength="12"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. MasterQuiz"
                className="w-full px-4 py-3 rounded-xl bg-theme-input-bg border border-theme-border text-theme-input-text outline-none transition-all placeholder:text-theme-text-muted/40 input-focus-glow"
              />
            </div>

            <button
              type="submit"
              disabled={isConnecting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-555 text-white font-bold text-sm shadow-lg shadow-emerald-600/10 transition-all cursor-pointer mt-6 btn-active-scale flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" /> Connecting...
                </>
              ) : (
                'Join Room'
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Lobby Screen */
        <div>
          {/* Lobby Code Display */}
          <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">Room Code</span>
              <div className="inline-flex items-center gap-3 bg-theme-input-bg px-6 py-3.5 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <span className="font-mono text-3xl font-black text-theme-text-primary tracking-widest">{roomCode}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg hover:bg-theme-card-bg-hover text-theme-text-secondary hover:text-theme-text-primary transition-all cursor-pointer btn-active-scale"
                  title="Copy Code"
                >
                  <Clipboard className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => {
                    const link = `${window.location.origin}/?room=${roomCode}`;
                    navigator.clipboard.writeText(link);
                    showToast('Direct join link copied!');
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold transition-colors cursor-pointer"
                >
                  Copy Direct Join Link
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-3 rounded-2xl shadow-xl flex-shrink-0 relative group">
              <QRCodeSVG 
                value={`${window.location.origin}/?room=${roomCode}`} 
                size={120} 
                level="Q" 
                includeMargin={false}
              />
              <div className="absolute inset-0 bg-gray-950/80 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-white text-center px-2">Scan to<br/>Join</span>
              </div>
            </div>
          </div>

          {/* Connected players and Lobby Quiz Settings (Dual Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-8 text-left animate-fade-in">
            {/* Player Queue (Left Column) */}
            <div className="glass-panel bg-theme-panel-bg/30 p-6 rounded-2xl border border-theme-border">
              <div className="flex items-center justify-between border-b border-theme-border pb-3 mb-4">
                <span className="text-sm font-bold text-theme-text-primary flex items-center gap-2 font-display">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Players ({players.length})
                </span>
                <span className="text-xs text-theme-text-secondary bg-theme-glass-bg px-2 py-0.5 rounded-full font-bold">
                  {players.length} / 6
                </span>
              </div>
              <div className="space-y-3">
                {players.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-theme-input-bg/60 border border-theme-border hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${p.avatarColor || 'bg-gray-700'} flex items-center justify-center text-white font-bold`}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-theme-text-primary">{p.name}</span>
                    </div>
                    {p.id === 'host' ? (
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Host
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Content Config (Right Column) */}
            <div className="glass-panel bg-theme-panel-bg/30 p-6 rounded-2xl border border-theme-border flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider block mb-1">Lobby Quiz Subject</span>
                <h4 className="text-md font-bold text-theme-text-primary mb-1 line-clamp-1 font-display">{selectedRoomQuiz.title}</h4>
                <p className="text-xs text-theme-text-secondary font-light mb-4 line-clamp-2 leading-relaxed">{selectedRoomQuiz.description}</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 font-bold mb-6">
                  {selectedRoomQuiz.questions?.length || 0} Questions
                </span>
              </div>

              {isHost ? (
                <div className="space-y-3 pt-4 border-t border-theme-border">
                  <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider block">Modify Quiz Content</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button 
                      onClick={() => setSubView('choose-saved')}
                      className="p-2.5 rounded-xl border border-theme-border hover:border-theme-border/60 hover:bg-theme-card-bg-hover text-theme-text-secondary font-semibold cursor-pointer text-center btn-active-scale"
                    >
                      📁 Saved Quizzes
                    </button>
                    <button 
                      onClick={() => setSubView('create-manual')}
                      className="p-2.5 rounded-xl border border-theme-border hover:border-theme-border/60 hover:bg-theme-card-bg-hover text-theme-text-secondary font-semibold cursor-pointer text-center btn-active-scale"
                    >
                      ✏️ Create New
                    </button>
                    <button 
                      onClick={() => setSubView('upload-ai')}
                      className="p-2.5 rounded-xl border border-theme-border hover:border-theme-border/60 hover:bg-theme-card-bg-hover text-theme-text-secondary font-semibold cursor-pointer text-center btn-active-scale"
                    >
                      🤖 AI Document
                    </button>
                    <button 
                      onClick={() => setShowSurprise(true)}
                      className="p-2.5 rounded-xl border border-theme-border hover:border-theme-border/60 hover:bg-theme-card-bg-hover text-theme-text-secondary font-semibold cursor-pointer text-center btn-active-scale"
                    >
                      🎲 Surprise Me
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-theme-glass-bg/50 border border-theme-border rounded-xl text-center">
                  <span className="text-xs text-theme-text-muted">Only the host can modify the quiz selection.</span>
                </div>
              )}
            </div>
          </div>

          {/* Lobby Footer Action */}
          <div className="pt-6 border-t border-theme-border max-w-md mx-auto">
            {isHost ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setLobbyView('landing')}
                    className="flex-1 py-3 rounded-xl bg-theme-glass-bg hover:bg-theme-card-bg-hover border border-theme-border text-sm font-semibold text-theme-text-primary transition-all cursor-pointer btn-active-scale"
                  >
                    Close Lobby
                  </button>
                  <button
                    onClick={handleStartMatch}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-555 text-white font-bold text-sm shadow-lg shadow-emerald-600/15 transition-all cursor-pointer btn-active-scale"
                  >
                    <Play className="w-4 h-4" /> Start Match
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-theme-text-secondary flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  Waiting for host to start the match...
                </p>
                <button
                  onClick={() => setLobbyView('landing')}
                  className="w-full mt-6 py-2.5 rounded-xl bg-theme-glass-bg hover:bg-theme-card-bg-hover border border-theme-border text-sm font-semibold text-theme-text-primary transition-all cursor-pointer btn-active-scale"
                >
                  Leave Lobby
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Surprise Me Modal for Lobby Quiz selection */}
      {showSurprise && (
        <SurpriseMeModal 
          onGenerate={(newQuiz) => {
            setSelectedRoomQuiz(newQuiz);
            setShowSurprise(false);
          }}
          onClose={() => setShowSurprise(false)}
        />
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel border border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in font-semibold text-xs">
          <span>✅</span> {toastMsg}
        </div>
      )}
    </div>
  );
}
