import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

export default function SurpriseMeModal({ onGenerate, onClose }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const premadeTopics = [
    { id: 'javascript', title: 'JavaScript & React', icon: '💻', key: 'javascript' },
    { id: 'space', title: 'Space & Astronomy', icon: '🚀', key: 'space' },
    { id: 'geography', title: 'World Geography', icon: '🌍', key: 'geography' },
    { id: 'history', title: 'Ancient History', icon: '🏛️', key: 'history' },
    { id: 'pop_culture', title: 'Pop Culture & Movies', icon: '🎬', key: 'pop_culture' },
    { id: 'css', title: 'Web Design & CSS', icon: '🎨', key: 'css' },
    { id: 'computer_science', title: 'Computer Science', icon: '🧬', key: 'computer_science' },
    { id: 'general', title: 'General Knowledge', icon: '🧠', key: 'general' },
    { id: 'science', title: 'Science & Nature', icon: '🌿', key: 'science' },
    { id: 'anatomy', title: 'Human Anatomy', icon: '🫁', key: 'anatomy' }
  ];

  const mockTopicsDatabase = {
    javascript: {
      title: 'JavaScript Core Trivia',
      description: 'Test your understanding of JavaScript scopes, closures, async, and ES6.',
      questions: [
        {
          question: 'What is the output of: typeof null?',
          options: ['"null"', '"undefined"', '"object"', '"function"'],
          correctAnswer: '"object"',
          explanation: 'In JavaScript, typeof null is historically evaluated as "object". This is a long-standing bug in the language.'
        },
        {
          question: 'Which of the following is NOT a JavaScript primitive type?',
          options: ['String', 'Boolean', 'Object', 'Symbol'],
          correctAnswer: 'Object',
          explanation: 'Primitives include String, Number, BigInt, Boolean, Undefined, Symbol, and Null. Objects are reference types.'
        },
        {
          question: 'What does the event loop do in JavaScript?',
          options: ['Creates HTML templates', 'Monitors the call stack and callback queue', 'Deletes expired cookies', 'Establishes TCP connections'],
          correctAnswer: 'Monitors the call stack and callback queue',
          explanation: 'The event loop moves callbacks from the callback queue to the call stack when the stack is empty.'
        },
        {
          question: 'Which keyword defines block-scoped variables that can be updated?',
          options: ['var', 'let', 'const', 'import'],
          correctAnswer: 'let',
          explanation: 'let variables are block-scoped and re-assignable. const variables are block-scoped but read-only.'
        },
        {
          question: 'What is the purpose of the "use strict" directive?',
          options: ['Speed up network requests', 'Enforce stricter parsing and error handling', 'Import stylesheets', 'Bypass type declarations'],
          correctAnswer: 'Enforce stricter parsing and error handling',
          explanation: '"use strict" catches common coding bloopers, throwing exceptions for silent bugs like assigning global variables.'
        }
      ]
    },
    space: {
      title: 'Cosmic Journeys Quiz',
      description: 'Explore the wonders of solar astronomy, stars, and space probe discoveries.',
      questions: [
        {
          question: 'Which planet in our solar system is known for its prominent ring system?',
          options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
          correctAnswer: 'Saturn',
          explanation: 'Saturn possesses the most spectacular and extensive ring system in our solar system.'
        },
        {
          question: 'What is the approximate age of the Universe?',
          options: ['4.5 billion years', '13.8 billion years', '9.2 billion years', '20 billion years'],
          correctAnswer: '13.8 billion years',
          explanation: 'Cosmological estimations place the age of our universe at roughly 13.8 billion years.'
        },
        {
          question: 'What is the closest star system to our Sun?',
          options: ['Alpha Centauri', 'Sirius', 'Betelgeuse', 'Proxima Centauri'],
          correctAnswer: 'Proxima Centauri',
          explanation: 'Proxima Centauri is the closest individual star to our Sun, situated 4.24 light-years away.'
        },
        {
          question: 'Which planet has the highest average surface temperature?',
          options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
          correctAnswer: 'Venus',
          explanation: 'Venus is the hottest planet because of its runaway greenhouse effect trapping heat in a dense atmosphere.'
        },
        {
          question: 'What force is responsible for keeping planets in orbit around the Sun?',
          options: ['Magnetic forces', 'Centrifugal force', 'Gravitational force', 'Friction force'],
          correctAnswer: 'Gravitational force',
          explanation: 'Gravity is the pull between the mass of the Sun and the mass of the orbiting planets.'
        }
      ]
    },
    geography: {
      title: 'World Geography Exploration',
      description: 'Test your knowledge on global borders, capitals, and natural landmarks.',
      questions: [
        {
          question: 'Which country is the largest in the world by total land area?',
          options: ['Canada', 'United States', 'China', 'Russia'],
          correctAnswer: 'Russia',
          explanation: 'Russia is the largest country in the world, spanning over 17 million square kilometers.'
        },
        {
          question: 'What is the capital city of Canada?',
          options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
          correctAnswer: 'Ottawa',
          explanation: 'Ottawa is the political capital of Canada, located in the province of Ontario.'
        },
        {
          question: 'Which of the following is the deepest lake in the world?',
          options: ['Lake Superior', 'Lake Victoria', 'Lake Baikal', 'Lake Tanganyika'],
          correctAnswer: 'Lake Baikal',
          explanation: 'Lake Baikal in Russia is the deepest and oldest freshwater lake on Earth, reaching depths of 1,642 meters.'
        },
        {
          question: 'Which nation contains the largest number of natural lakes on Earth?',
          options: ['Russia', 'Canada', 'Brazil', 'United States'],
          correctAnswer: 'Canada',
          explanation: 'Canada contains more than 60% of the world\'s lakes, with over 9% of the country covered by freshwater.'
        },
        {
          question: 'What is the smallest independent sovereign state in the world?',
          options: ['Monaco', 'San Marino', 'Liechtenstein', 'Vatican City'],
          correctAnswer: 'Vatican City',
          explanation: 'Vatican City is the smallest country by both area (0.49 sq km) and population.'
        }
      ]
    },
    history: {
      title: 'Ancient Empires History',
      description: 'Journey back in time to the Roman Empire, Mesopotamia, and ancient Egyptian dynasties.',
      questions: [
        {
          question: 'Who is recognized as the first official Emperor of the Roman Empire?',
          options: ['Julius Caesar', 'Augustus Caesar', 'Marcus Aurelius', 'Nero'],
          correctAnswer: 'Augustus Caesar',
          explanation: 'Augustus, formerly Octavian, became the first Emperor of Rome in 27 BC.'
        },
        {
          question: 'The historical Code of Hammurabi originated in which ancient civilization?',
          options: ['Assyrian Empire', 'Egyptian Empire', 'Babylonian Empire', 'Persian Empire'],
          correctAnswer: 'Babylonian Empire',
          explanation: 'The Code of Hammurabi was enacted by the Babylonian king Hammurabi around 1750 BC.'
        },
        {
          question: 'Which Egyptian pharaoh\'s tomb was discovered completely intact in 1922?',
          options: ['Ramses II', 'Tutankhamun', 'Akhenaten', 'Cleopatra'],
          correctAnswer: 'Tutankhamun',
          explanation: 'British archaeologist Howard Carter discovered King Tutankhamun\'s treasure-filled tomb in the Valley of the Kings.'
        },
        {
          question: 'Which conflict was fought between the Greek city-states of Athens and Sparta?',
          options: ['Peloponnesian War', 'Punic Wars', 'Persian Wars', 'Trojan War'],
          correctAnswer: 'Peloponnesian War',
          explanation: 'The Peloponnesian War (431–404 BC) was a devastating struggle for dominance in Ancient Greece.'
        },
        {
          question: 'Which Old Kingdom Egyptian ruler built the Great Pyramid of Giza?',
          options: ['Djoser', 'Khufu', 'Khafre', 'Menkaure'],
          correctAnswer: 'Khufu',
          explanation: 'The Great Pyramid was constructed as a monumental tomb for the Pharaoh Khufu (known in Greek as Cheops).'
        }
      ]
    },
    pop_culture: {
      title: 'Pop Culture & Cinema Quiz',
      description: 'Trivia on high-grossing Hollywood films, actors, and media milestones.',
      questions: [
        {
          question: 'Which film remains the highest-grossing movie of all time (unadjusted for inflation)?',
          options: ['Avengers: Endgame', 'Titanic', 'Avatar', 'Star Wars: The Force Awakens'],
          correctAnswer: 'Avatar',
          explanation: 'James Cameron\'s 2009 film Avatar leads global box office charts with over $2.9 billion.'
        },
        {
          question: 'Which actor portrayed Tony Stark (Iron Man) in the Marvel Cinematic Universe?',
          options: ['Chris Evans', 'Robert Downey Jr.', 'Mark Ruffalo', 'Christian Bale'],
          correctAnswer: 'Robert Downey Jr.',
          explanation: 'Robert Downey Jr. launched the MCU franchise in 2008 with his acclaimed performance as Iron Man.'
        },
        {
          question: 'In the sci-fi classic "The Matrix", what color pill does Neo take to wake up?',
          options: ['Blue pill', 'Red pill', 'Green pill', 'Yellow pill'],
          correctAnswer: 'Red pill',
          explanation: 'Taking the red pill symbolizes Neo\'s choice to escape the artificial reality of the Matrix.'
        },
        {
          question: 'Which fantasy TV series features the continent of Westeros and the Iron Throne?',
          options: ['The Witcher', 'Game of Thrones', 'Lord of the Rings', 'Shadow and Bone'],
          correctAnswer: 'Game of Thrones',
          explanation: 'Game of Thrones is HBO\'s legendary adaptation of George R.R. Martin\'s "A Song of Ice and Fire" novels.'
        },
        {
          question: 'What is the name of Han Solo\'s iconic smuggling spaceship in Star Wars?',
          options: ['Millennium Falcon', 'Star Destroyer', 'X-Wing', 'Enterprise'],
          correctAnswer: 'Millennium Falcon',
          explanation: 'The Millennium Falcon is the heavily modified YT-1300 light freighter piloted by Han Solo and Chewbacca.'
        }
      ]
    },
    css: {
      title: 'CSS & Web Design Masterclass',
      description: 'Assess your skills in CSS styling layouts, positioning rules, and design grids.',
      questions: [
        {
          question: 'What does the abbreviation CSS stand for in web engineering?',
          options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Complex Style Sheets'],
          correctAnswer: 'Cascading Style Sheets',
          explanation: 'CSS stands for Cascading Style Sheets, determining layout, colors, and styling rules.'
        },
        {
          question: 'Which CSS property is used to alter the color of text inside an element?',
          options: ['text-color', 'font-color', 'color', 'background-color'],
          correctAnswer: 'color',
          explanation: 'The `color` property manages foreground text, while `background-color` alters the container background.'
        },
        {
          question: 'Which CSS layout model is optimized for arranging elements in a single dimension (row or column)?',
          options: ['Grid', 'Flexbox', 'Block', 'Inline-table'],
          correctAnswer: 'Flexbox',
          explanation: 'Flexbox (Flexible Box Layout) is designed for single-dimensional items, while CSS Grid handles two dimensions.'
        },
        {
          question: 'What is the default initial value of the CSS position property?',
          options: ['relative', 'absolute', 'fixed', 'static'],
          correctAnswer: 'static',
          explanation: 'HTML elements are positioned `static` by default, meaning they follow the standard page document flow.'
        },
        {
          question: 'Which CSS unit of length is relative to the font-size of the root <html> element?',
          options: ['em', 'rem', 'px', 'vh'],
          correctAnswer: 'rem',
          explanation: 'The `rem` (root em) unit scales relative to the root font-size, making it ideal for responsive design.'
        }
      ]
    },
    computer_science: {
      title: 'Computer Science Paradigms',
      description: 'Fundamentals of algorithms, data structures, complexity, and network layers.',
      questions: [
        {
          question: 'What is the average time complexity of locating a value in a balanced Binary Search Tree (BST)?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
          correctAnswer: 'O(log n)',
          explanation: 'Balanced search trees discard half the remaining search space at each branch, producing logarithmic searches.'
        },
        {
          question: 'Which internet protocol operates at the Application Layer of the OSI network model?',
          options: ['TCP', 'IP', 'HTTP', 'UDP'],
          correctAnswer: 'HTTP',
          explanation: 'HTTP, FTP, and SMTP are Application Layer protocols. TCP/UDP operate at the Transport Layer.'
        },
        {
          question: 'Which principle describes the element access behavior of a Stack data structure?',
          options: ['First-In, First-Out (FIFO)', 'Last-In, First-Out (LIFO)', 'Random Access', 'Priority Queueing'],
          correctAnswer: 'Last-In, First-Out (LIFO)',
          explanation: 'Stacks operate under LIFO: elements are added (pushed) and removed (popped) from the same top node.'
        },
        {
          question: 'Which British polymath is widely called the father of modern computer science?',
          options: ['Charles Babbage', 'Ada Lovelace', 'Alan Turing', 'John von Neumann'],
          correctAnswer: 'Alan Turing',
          explanation: 'Alan Turing formalized the concepts of algorithms and computation using his theoretical Turing Machine.'
        },
        {
          question: 'What does SQL stand for in data management?',
          options: ['Structured Query Language', 'Simple Queue Loop', 'Sequential Query Logic', 'System Query Layout'],
          correctAnswer: 'Structured Query Language',
          explanation: 'SQL is the standardized programming language used to query and manage relational database systems.'
        }
      ]
    },
    general: {
      title: 'General Knowledge Challenge',
      description: 'A mix of culture, history, geography, and general curiosity.',
      questions: [
        {
          question: 'Which is the largest ocean on Earth?',
          options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
          correctAnswer: 'Pacific Ocean',
          explanation: 'The Pacific Ocean is the largest and deepest of Earth\'s oceanic divisions.'
        },
        {
          question: 'What is the capital city of Australia?',
          options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
          correctAnswer: 'Canberra',
          explanation: 'Canberra was chosen as the capital in 1908 as a compromise between Sydney and Melbourne.'
        },
        {
          question: 'Who painted the Mona Lisa?',
          options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'],
          correctAnswer: 'Leonardo da Vinci',
          explanation: 'The Italian polymath Leonardo da Vinci painted the Mona Lisa in the early 16th century.'
        },
        {
          question: 'Which element makes up the majority of Earth\'s atmosphere?',
          options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
          correctAnswer: 'Nitrogen',
          explanation: 'Nitrogen comprises roughly 78% of Earth\'s atmospheric gases.'
        },
        {
          question: 'What is the primary currency used in Japan?',
          options: ['Yuan', 'Yen', 'Won', 'Euro'],
          correctAnswer: 'Yen',
          explanation: 'The Yen is the official currency of Japan, symbolized as ¥.'
        }
      ]
    },
    science: {
      title: 'Science & Chemistry Core',
      description: 'Physical science rules, chemical elements, and atmospheric conditions.',
      questions: [
        {
          question: 'What is the chemical symbol for the element Gold?',
          options: ['Gd', 'Go', 'Ag', 'Au'],
          correctAnswer: 'Au',
          explanation: 'The atomic symbol for gold is Au, derived from its Latin name "Aurum" (meaning shining dawn).'
        },
        {
          question: 'What physical process describes a liquid state transforming directly into a gaseous state?',
          options: ['Condensation', 'Sublimation', 'Evaporation', 'Deposition'],
          correctAnswer: 'Evaporation',
          explanation: 'Evaporation is the phase transition of liquid molecules into a vapor gas state below boiling temperature.'
        },
        {
          question: 'What is the approximate speed of light travelling in a complete vacuum?',
          options: ['150,000 km/s', '300,000 km/s', '1,000,000 km/s', '3,000 km/s'],
          correctAnswer: '300,000 km/s',
          explanation: 'Light travels at its absolute speed limit of 299,792 kilometers per second in a vacuum.'
        },
        {
          question: 'What is the atomic number of the element Helium?',
          options: ['1', '2', '4', '8'],
          correctAnswer: '2',
          explanation: 'Helium is the second element on the periodic table, containing 2 protons in its nucleus.'
        },
        {
          question: 'Which greenhouse gas has the largest overall heating effect in Earth\'s atmosphere?',
          options: ['Carbon Dioxide', 'Methane', 'Water Vapor', 'Nitrous Oxide'],
          correctAnswer: 'Water Vapor',
          explanation: 'Water vapor is the most abundant greenhouse gas and contributor to the greenhouse effect.'
        }
      ]
    },
    anatomy: {
      title: 'Human Biology & Anatomy',
      description: 'Identify structures of the human body, circulatory systems, and bones.',
      questions: [
        {
          question: 'What is the largest organ of the human body?',
          options: ['The Liver', 'The Brain', 'The Skin', 'The Lungs'],
          correctAnswer: 'The Skin',
          explanation: 'The skin is the body\'s largest organ, covering its entire external surface.'
        },
        {
          question: 'How many bones are in a typical adult human skeleton?',
          options: ['106', '206', '306', '156'],
          correctAnswer: '206',
          explanation: 'An adult human skeleton consists of 206 bones. Infants are born with around 270 smaller bones.'
        },
        {
          question: 'Which heart chamber is responsible for pumping oxygenated blood out into the body?',
          options: ['Right Atrium', 'Left Atrium', 'Right Ventricle', 'Left Ventricle'],
          correctAnswer: 'Left Ventricle',
          explanation: 'The left ventricle has thick muscular walls to pump oxygen-rich blood through the aorta to the body.'
        },
        {
          question: 'What is the primary operational function of red blood cells (erythrocytes)?',
          options: ['Engulf bacteria', 'Transport oxygen', 'Clot blood vessels', 'Synthesize hormones'],
          correctAnswer: 'Transport oxygen',
          explanation: 'Red blood cells contain hemoglobin, which binds with oxygen in the lungs and distributes it to tissues.'
        },
        {
          question: 'Which nerve is the longest and widest single nerve in the human body?',
          options: ['Vagus nerve', 'Sciatic nerve', 'Femoral nerve', 'Optic nerve'],
          correctAnswer: 'Sciatic nerve',
          explanation: 'The sciatic nerve starts in the lower spine and runs down the back of each leg to the foot.'
        }
      ]
    }
  };

  const handlePremadeSelect = (t) => {
    setLoading(true);
    setLoadingText('Connecting to Gemini AI Engine...');

    setTimeout(() => {
      setLoadingText(`Synthesizing quiz nodes on "${t.title}"...`);
    }, 800);

    setTimeout(() => {
      const selectedQuizData = mockTopicsDatabase[t.key] || mockTopicsDatabase.general;

      const finalQuiz = {
        id: 'surprise_' + Date.now(),
        title: `AI Surprise: ${t.title}`,
        description: selectedQuizData.description,
        questions: selectedQuizData.questions,
        createdAt: new Date().toISOString(),
        type: 'surprise'
      };

      onGenerate(finalQuiz);
      setLoading(false);
    }, 2000);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText('Connecting to Gemini AI Engine...');

    setTimeout(() => {
      setLoadingText(`Synthesizing quiz nodes on "${topic || 'Surprise Me Topic'}"...`);
    }, 800);

    setTimeout(() => {
      // Find matching mock quiz
      const cleanTopic = topic.trim().toLowerCase();
      let selectedQuizData;
      
      if (cleanTopic.includes('js') || cleanTopic.includes('javascript') || cleanTopic.includes('react') || cleanTopic.includes('web')) {
        selectedQuizData = mockTopicsDatabase.javascript;
      } else if (cleanTopic.includes('space') || cleanTopic.includes('planet') || cleanTopic.includes('galaxy') || cleanTopic.includes('astronomy')) {
        selectedQuizData = mockTopicsDatabase.space;
      } else if (cleanTopic.includes('geo') || cleanTopic.includes('map') || cleanTopic.includes('country') || cleanTopic.includes('world')) {
        selectedQuizData = mockTopicsDatabase.geography;
      } else if (cleanTopic.includes('history') || cleanTopic.includes('war') || cleanTopic.includes('ancient')) {
        selectedQuizData = mockTopicsDatabase.history;
      } else if (cleanTopic.includes('movie') || cleanTopic.includes('pop') || cleanTopic.includes('culture') || cleanTopic.includes('actor')) {
        selectedQuizData = mockTopicsDatabase.pop_culture;
      } else if (cleanTopic.includes('css') || cleanTopic.includes('style') || cleanTopic.includes('html') || cleanTopic.includes('design')) {
        selectedQuizData = mockTopicsDatabase.css;
      } else if (cleanTopic.includes('comp') || cleanTopic.includes('code') || cleanTopic.includes('software') || cleanTopic.includes('algorithm')) {
        selectedQuizData = mockTopicsDatabase.computer_science;
      } else if (cleanTopic.includes('bio') || cleanTopic.includes('physic') || cleanTopic.includes('chem') || cleanTopic.includes('science')) {
        selectedQuizData = mockTopicsDatabase.science;
      } else if (cleanTopic.includes('anatomy') || cleanTopic.includes('body') || cleanTopic.includes('human') || cleanTopic.includes('medical')) {
        selectedQuizData = mockTopicsDatabase.anatomy;
      } else {
        selectedQuizData = mockTopicsDatabase.general;
      }

      // Add a randomized title if topic is custom
      const finalQuiz = {
        id: 'surprise_' + Date.now(),
        title: topic.trim() 
          ? `AI Surprise: ${topic.trim().charAt(0).toUpperCase() + topic.trim().slice(1)}` 
          : 'Surprise Trivia Quiz',
        description: selectedQuizData.description,
        questions: selectedQuizData.questions,
        createdAt: new Date().toISOString(),
        type: 'surprise'
      };

      onGenerate(finalQuiz);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-8 border border-white/10 overflow-hidden shadow-2xl animate-modal-in">
        {/* Dynamic back decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Generating Instant Quiz</h3>
            <p className="text-sm text-gray-400 pulse-status">{loadingText}</p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
                <Sparkles className="w-5 h-5 text-amber-400" />
                🎲 Surprise Me!
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer btn-active-scale"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Enter a custom topic or select one of our 10 premade categories below to instantly generate a 5-question quiz!
            </p>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Custom Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. History, Space, Javascript..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-white/5 text-white outline-none transition-all placeholder:text-gray-700 input-focus-glow"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Premade Topics</label>
                <div className="grid grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1">
                  {premadeTopics.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handlePremadeSelect(t)}
                      className="px-3 py-2.5 rounded-xl border border-white/5 bg-gray-950/40 text-left hover:border-amber-500/35 hover:bg-slate-900/35 text-xs text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 btn-active-scale font-semibold"
                    >
                      <span className="text-sm">{t.icon}</span>
                      <span className="truncate">{t.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-all cursor-pointer btn-active-scale"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-lg shadow-amber-500/10 hover:shadow-amber-400/20 transition-all cursor-pointer btn-active-scale"
                >
                  Generate & Play
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
