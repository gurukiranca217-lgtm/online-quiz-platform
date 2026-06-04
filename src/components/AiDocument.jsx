import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Check, Loader2, ArrowLeft } from 'lucide-react';

export default function AiDocument({ onSave, onCancel }) {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium'); // Easy, Medium, Hard
  const [status, setStatus] = useState('idle'); // idle, loading
  const [loadingStep, setLoadingStep] = useState(0);
  const fileInputRef = useRef(null);

  const loadingMessages = [
    '📄 Uploading and parsing document structure...',
    '🔍 Analyzing content nodes and extracting key topics...',
    '🧠 Prompting LLM model to design balanced questions...',
    '✨ Formulating distractors and selecting correct answers...',
    '⚡ Assembling and saving generated quiz...'
  ];

  useEffect(() => {
    let interval;
    if (status === 'loading') {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Completed! Auto-generate questions and trigger save
            handleAutoGenerateAndSave();
            return prev;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleAutoGenerateAndSave = () => {
    const filename = file ? file.name.toLowerCase() : '';
    let title = 'Quiz from ' + (file ? file.name.split('.')[0] : 'Document') + ` (${difficulty})`;
    
    let pool = [];

    if (filename.includes('science') || filename.includes('biology') || filename.includes('physics')) {
      pool = [
        {
          question: 'What is the primary function of mitochondria in a cell?',
          options: ['Synthesize lipids', 'Produce ATP energy', 'Store genetic codes', 'Filter cellular waste'],
          correctAnswer: 'Produce ATP energy',
          explanation: 'Mitochondria are the powerhouses of the cell, converting nutrients into ATP.',
          difficulty: 'easy'
        },
        {
          question: 'Which of the following light wavelengths is absorbed most by chlorophyll?',
          options: ['Green and yellow', 'Red and blue', 'Infrared only', 'Ultraviolet only'],
          correctAnswer: 'Red and blue',
          explanation: 'Chlorophyll absorbs red and blue light most efficiently for photosynthesis.',
          difficulty: 'medium'
        },
        {
          question: 'What is the speed of light in a vacuum?',
          options: ['~300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s'],
          correctAnswer: '~300,000 km/s',
          explanation: 'Light travels at roughly 299,792 kilometers per second in a vacuum.',
          difficulty: 'easy'
        },
        {
          question: 'What is absolute zero temperature defined as?',
          options: ['-100°C', '0° Fahrenheit', '-273.15°C', '-459° Celsius'],
          correctAnswer: '-273.15°C',
          explanation: 'Absolute zero is 0 Kelvin, which equates to -273.15°C.',
          difficulty: 'hard'
        },
        {
          question: 'Which chemical element has the atomic number 1?',
          options: ['Helium', 'Oxygen', 'Carbon', 'Hydrogen'],
          correctAnswer: 'Hydrogen',
          explanation: 'Hydrogen is the lightest element with a single proton.',
          difficulty: 'easy'
        },
        {
          question: 'What structural shape represents a DNA molecule?',
          options: ['Single straight strand', 'Triple ring helix', 'Double helix structure', 'Concentric circles'],
          correctAnswer: 'Double helix structure',
          explanation: 'A DNA molecule is shaped like a double helix (a twisted ladder).',
          difficulty: 'easy'
        },
        {
          question: 'Which planet in our solar system has the most confirmed natural moons?',
          options: ['Jupiter', 'Saturn', 'Mars', 'Neptune'],
          correctAnswer: 'Saturn',
          explanation: 'Saturn is confirmed to have 146 moons, surpassing Jupiter which has 95.',
          difficulty: 'medium'
        },
        {
          question: 'What is the primary nuclear fuel consumed by our Sun?',
          options: ['Helium', 'Uranium', 'Carbon', 'Hydrogen'],
          correctAnswer: 'Hydrogen',
          explanation: 'The Sun fuses hydrogen atoms in its core to create helium, releasing massive energy.',
          difficulty: 'easy'
        },
        {
          question: 'What is the chemical formula for pure water?',
          options: ['H2O2', 'CO2', 'H2O', 'NaCl'],
          correctAnswer: 'H2O',
          explanation: 'Water consists of two hydrogen atoms bonded to one oxygen atom.',
          difficulty: 'easy'
        },
        {
          question: 'In a typical medium, which waves travel faster?',
          options: ['Sound waves', 'Light waves', 'They travel at identical speeds', 'Ocean waves'],
          correctAnswer: 'Light waves',
          explanation: 'Light waves travel millions of times faster than sound waves.',
          difficulty: 'easy'
        },
        {
          question: 'What is the standard unit of electrical resistance?',
          options: ['Volt', 'Ampere', 'Watt', 'Ohm'],
          correctAnswer: 'Ohm',
          explanation: 'Resistance to electrical currents is measured in Ohms (Ω).',
          difficulty: 'medium'
        },
        {
          question: 'What is the largest organ of the human body?',
          options: ['The Liver', 'The Brain', 'The Skin', 'The Lungs'],
          correctAnswer: 'The Skin',
          explanation: 'The skin is the body\'s largest organ, covering its entire external surface.',
          difficulty: 'easy'
        },
        {
          question: 'What gas is released as a byproduct during photosynthesis?',
          options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Carbon Monoxide'],
          correctAnswer: 'Oxygen',
          explanation: 'Plants consume carbon dioxide and emit oxygen as a byproduct of photosynthesis.',
          difficulty: 'easy'
        },
        {
          question: 'Who formulated the three fundamental laws of motion and universal gravitation?',
          options: ['Albert Einstein', 'Galileo Galilei', 'Sir Isaac Newton', 'Nikola Tesla'],
          correctAnswer: 'Sir Isaac Newton',
          explanation: 'Newton published these laws in his Principia Mathematica in 1687.',
          difficulty: 'easy'
        },
        {
          question: 'Which planet is positioned closest to the Sun?',
          options: ['Venus', 'Earth', 'Mercury', 'Mars'],
          correctAnswer: 'Mercury',
          explanation: 'Mercury is the closest planet to the Sun, orbiting at a distance of about 58 million km.',
          difficulty: 'easy'
        },
        {
          question: 'According to Boyle\'s Law, what is the relationship between the pressure and volume of a gas?',
          options: ['Directly proportional', 'Inversely proportional', 'No mathematical relationship', 'Exponentially proportional'],
          correctAnswer: 'Inversely proportional',
          explanation: 'Boyle\'s Law states that pressure is inversely proportional to volume at a constant temperature.',
          difficulty: 'hard'
        },
        {
          question: 'Which pH value represents a strongly acidic solution?',
          options: ['7.0', '13.0', '2.0', '8.5'],
          correctAnswer: '2.0',
          explanation: 'Solutions with a pH less than 7 are acidic. Lower values represent higher acidity.',
          difficulty: 'easy'
        },
        {
          question: 'Which greenhouse gas has the largest overall heating effect in Earth\'s atmosphere?',
          options: ['Carbon Dioxide', 'Methane', 'Water Vapor', 'Nitrous Oxide'],
          correctAnswer: 'Water Vapor',
          explanation: 'Water vapor is the most abundant greenhouse gas and contributor to the greenhouse effect.',
          difficulty: 'medium'
        },
        {
          question: 'What is the standard SI unit of power?',
          options: ['Joule', 'Newton', 'Watt', 'Pascal'],
          correctAnswer: 'Watt',
          explanation: 'Power is measured in Watts, representing one Joule of energy expended per second.',
          difficulty: 'easy'
        },
        {
          question: 'Who formulated the Theory of General Relativity in 1915?',
          options: ['Niels Bohr', 'Albert Einstein', 'Max Planck', 'Werner Heisenberg'],
          correctAnswer: 'Albert Einstein',
          explanation: 'Einstein published General Relativity, refining Newtonian mechanics for cosmic masses.',
          difficulty: 'medium'
        },
        {
          question: 'In thermodynamics, what quantity is defined as the measure of molecular disorder?',
          options: ['Enthalpy', 'Entropy', 'Free Energy', 'Heat Capacity'],
          correctAnswer: 'Entropy',
          explanation: 'Entropy is a measure of molecular randomness or disorder within a system.',
          difficulty: 'hard'
        },
        {
          question: 'What subatomic elementary particle acts as the carrier of the electromagnetic force?',
          options: ['Gluon', 'Graviton', 'W Boson', 'Photon'],
          correctAnswer: 'Photon',
          explanation: 'The photon is the gauge boson responsible for mediating electromagnetic interactions.',
          difficulty: 'hard'
        }
      ];
    } else if (filename.includes('history') || filename.includes('social') || filename.includes('war')) {
      pool = [
        {
          question: 'In which year did the United States sign the Declaration of Independence?',
          options: ['1776', '1789', '1812', '1492'],
          correctAnswer: '1776',
          explanation: 'The Declaration of Independence was approved by the Continental Congress on July 4, 1776.',
          difficulty: 'easy'
        },
        {
          question: 'Who was the first emperor of the Roman Empire?',
          options: ['Julius Caesar', 'Augustus', 'Nero', 'Marcus Aurelius'],
          correctAnswer: 'Augustus',
          explanation: 'Augustus Caesar became the first Emperor of Rome in 27 BC.',
          difficulty: 'easy'
        },
        {
          question: 'The Magna Carta was signed in England under which monarch?',
          options: ['King Henry VIII', 'King John', 'Queen Elizabeth I', 'King Richard I'],
          correctAnswer: 'King John',
          explanation: 'King John signed the Magna Carta in 1215 at Runnymede.',
          difficulty: 'easy'
        },
        {
          question: 'Which conflict was fought between the Houses of Lancaster and York?',
          options: ['The Hundred Years War', 'The English Civil War', 'The War of the Roses', 'The Thirty Years War'],
          correctAnswer: 'The War of the Roses',
          explanation: 'The Wars of the Roses was a series of civil wars for the throne of England.',
          difficulty: 'medium'
        },
        {
          question: 'Who is widely credited with the invention of the printing press in Europe?',
          options: ['Johannes Gutenberg', 'Leonardo da Vinci', 'Galileo Galilei', 'Isaac Newton'],
          correctAnswer: 'Johannes Gutenberg',
          explanation: 'Gutenberg introduced printing to Europe in the 1440s.',
          difficulty: 'easy'
        },
        {
          question: 'What historical event began with the storming of the Bastille in 1789?',
          options: ['The Russian Revolution', 'The French Revolution', 'The Industrial Revolution', 'The American Revolution'],
          correctAnswer: 'The French Revolution',
          explanation: 'The storming of the Bastille prison in Paris on July 14, 1789 marked the start of the French Revolution.',
          difficulty: 'easy'
        },
        {
          question: 'What writing system did Ancient Egyptians use for monuments and formal texts?',
          options: ['Cuneiform', 'Hieroglyphs', 'Phoenician Alphabet', 'Cyrillic'],
          correctAnswer: 'Hieroglyphs',
          explanation: 'Hieroglyphs were the formal writing system utilized by ancient Egyptians.',
          difficulty: 'easy'
        },
        {
          question: 'Who was the first human to orbit Earth in space?',
          options: ['Neil Armstrong', 'Yuri Gagarin', 'Buzz Aldrin', 'John Glenn'],
          correctAnswer: 'Yuri Gagarin',
          explanation: 'Soviet cosmonaut Yuri Gagarin orbited the Earth in Vostok 1 on April 12, 1961.',
          difficulty: 'easy'
        },
        {
          question: 'Which ancient civilization constructed the Great Wall to defend against northern invaders?',
          options: ['The Mongols', 'The Romans', 'The Chinese', 'The Persians'],
          correctAnswer: 'The Chinese',
          explanation: 'The Chinese Empires constructed the Great Wall starting in the Qin Dynasty to prevent incursions.',
          difficulty: 'easy'
        },
        {
          question: 'In what year did the British passenger liner Titanic sink in the North Atlantic?',
          options: ['1905', '1912', '1920', '1939'],
          correctAnswer: '1912',
          explanation: 'The Titanic struck an iceberg and sank on its maiden voyage in April 1912.',
          difficulty: 'easy'
        },
        {
          question: 'What year is traditionally cited as the final fall of the Western Roman Empire?',
          options: ['330 AD', '476 AD', '1066 AD', '1453 AD'],
          correctAnswer: '476 AD',
          explanation: 'In 476 AD, the last Western Roman Emperor, Romulus Augustulus, was deposed by Odoacer.',
          difficulty: 'medium'
        },
        {
          question: 'Which event directly sparked the outbreak of World War I in Europe?',
          options: ['The invasion of Poland', 'The sinking of the Lusitania', 'The assassination of Archduke Franz Ferdinand', 'The signing of the Treaty of Versailles'],
          correctAnswer: 'The assassination of Archduke Franz Ferdinand',
          explanation: 'The assassination of Archduke Franz Ferdinand of Austria in Sarajevo on June 28, 1914 triggered WWI.',
          difficulty: 'medium'
        },
        {
          question: 'Which Norse explorer is believed to have reached North America centuries before Columbus?',
          options: ['Ragnar Lodbrok', 'Erik the Red', 'Leif Erikson', 'Harald Hardrada'],
          correctAnswer: 'Leif Erikson',
          explanation: 'Leif Erikson established a settlement at Vinland (Newfoundland) around 1000 AD.',
          difficulty: 'medium'
        },
        {
          question: 'Which Giza monument is considered the oldest of the Seven Wonders of the Ancient World?',
          options: ['The Great Sphinx', 'The Great Pyramid', 'The Temple of Luxor', 'The Valley of the Kings'],
          correctAnswer: 'The Great Pyramid',
          explanation: 'The Great Pyramid of Giza is the oldest and only surviving wonder of the ancient world.',
          difficulty: 'easy'
        },
        {
          question: 'From which continent did the Bubonic Plague (Black Death) arrive in Europe in 1347?',
          options: ['Africa', 'Asia', 'North America', 'Australia'],
          correctAnswer: 'Asia',
          explanation: 'The Black Death originated in Central/East Asia and traveled along trade routes to Europe.',
          difficulty: 'medium'
        },
        {
          question: 'The famous Code of Laws from ancient Mesopotamia was created by which Babylonian King?',
          options: ['Nebuchadnezzar', 'Hammurabi', 'Sargon', 'Gilgamesh'],
          correctAnswer: 'Hammurabi',
          explanation: 'The Code of Hammurabi is one of the earliest and most complete written legal codes, established in Babylon.',
          difficulty: 'medium'
        },
        {
          question: 'In what year was the Peace of Westphalia signed, ending the Thirty Years War in Europe?',
          options: ['1517', '1648', '1713', '1789'],
          correctAnswer: '1648',
          explanation: 'The treaties of Westphalia in 1648 established the modern concept of sovereign states.',
          difficulty: 'hard'
        },
        {
          question: 'Which French General and Emperor won the Battle of Austerlitz in 1805?',
          options: ['Louis XIV', 'Napoleon Bonaparte', 'Charles de Gaulle', 'Robespierre'],
          correctAnswer: 'Napoleon Bonaparte',
          explanation: 'Austerlitz (the Battle of the Three Emperors) is widely regarded as Napoleon\'s greatest tactical masterpiece.',
          difficulty: 'hard'
        },
        {
          question: 'In which grand room of the Palace of Versailles was the peace treaty ending World War I signed in 1919?',
          options: ['The Hall of Mirrors', 'The Queen\'s Chamber', 'The Gallery of Great Battles', 'The Marble Court'],
          correctAnswer: 'The Hall of Mirrors',
          explanation: 'The Treaty of Versailles was signed in the Hall of Mirrors on June 28, 1919.',
          difficulty: 'hard'
        },
        {
          question: 'Who was the leader of the Jacobins during the French Revolution\'s Reign of Terror?',
          options: ['Georges Danton', 'Jean-Paul Marat', 'Maximilien Robespierre', 'Marquis de Lafayette'],
          correctAnswer: 'Maximilien Robespierre',
          explanation: 'Robespierre headed the Committee of Public Safety, executing thousands of citizens in 1793-1794.',
          difficulty: 'hard'
        }
      ];
    } else {
      pool = [
        {
          question: 'What does CSS stand for in web development?',
          options: ['Creative Style Sheets', 'Computer Style Sheets', 'Cascading Style Sheets', 'Complex Style Sheets'],
          correctAnswer: 'Cascading Style Sheets',
          explanation: 'CSS defines how HTML elements are styled and laid out.',
          difficulty: 'easy'
        },
        {
          question: 'Which data structure follows the Last-In, First-Out (LIFO) model?',
          options: ['Queue', 'Stack', 'Array', 'Linked List'],
          correctAnswer: 'Stack',
          explanation: 'A stack pushes items and pops the most recently added item first.',
          difficulty: 'easy'
        },
        {
          question: 'What is the main advantage of utilizing a Virtual DOM in React?',
          options: ['It bypasses security limitations', 'It optimizes UI re-rendering performance', 'It stores data in local storage', 'It enables server-side SQL queries'],
          correctAnswer: 'It optimizes UI re-rendering performance',
          explanation: 'React compares the Virtual DOM with the real DOM to compute minimal updates.',
          difficulty: 'medium'
        },
        {
          question: 'Which protocol is used to securely transfer files over the web?',
          options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
          correctAnswer: 'HTTPS',
          explanation: 'HTTPS encrypts normal HTTP data transfers using SSL/TLS.',
          difficulty: 'easy'
        },
        {
          question: 'What does API stand for?',
          options: ['Application Programming Interface', 'Active Processor Integration', 'Altered Protocol Interconnect', 'Automated Program Inspector'],
          correctAnswer: 'Application Programming Interface',
          explanation: 'An API defines interactions between multiple software intermediaries.',
          difficulty: 'medium'
        },
        {
          question: 'Which HTML tag serves as the root container for all page contents?',
          options: ['<body>', '<head>', '<html>', '<div>'],
          correctAnswer: '<html>',
          explanation: 'The <html> tag encapsulates the entire HTML document structure.',
          difficulty: 'easy'
        },
        {
          question: 'What does SQL stand for in database programming?',
          options: ['Simple Query Language', 'Structured Query Language', 'Sequential Query Loop', 'System Query Logic'],
          correctAnswer: 'Structured Query Language',
          explanation: 'SQL stands for Structured Query Language, used to manage relational databases.',
          difficulty: 'easy'
        },
        {
          question: 'In JavaScript, which array property returns the total number of items in it?',
          options: ['.size', '.length', '.count', '.index'],
          correctAnswer: '.length',
          explanation: 'The .length property tracks the number of elements in a JavaScript array.',
          difficulty: 'easy'
        },
        {
          question: 'What type of software tool is Git classified as?',
          options: ['Database Manager', 'Package Bundler', 'Version Control System', 'Operating System'],
          correctAnswer: 'Version Control System',
          explanation: 'Git is a distributed version control system for tracking file changes.',
          difficulty: 'easy'
        },
        {
          question: 'Who created the original Linux operating system kernel?',
          options: ['Steve Jobs', 'Bill Gates', 'Linus Torvalds', 'Richard Stallman'],
          correctAnswer: 'Linus Torvalds',
          explanation: 'Linus Torvalds developed the Linux kernel in 1991 as a free, open-source project.',
          difficulty: 'medium'
        },
        {
          question: 'Which Python list method is used to add an item to the end of the list?',
          options: ['.add()', '.append()', '.push()', '.insert()'],
          correctAnswer: '.append()',
          explanation: 'The .append() method inserts a single element at the tail of a Python list.',
          difficulty: 'medium'
        },
        {
          question: 'Who is credited with inventing the World Wide Web in 1989?',
          options: ['Bill Gates', 'Steve Wozniak', 'Sir Tim Berners-Lee', 'Alan Turing'],
          correctAnswer: 'Sir Tim Berners-Lee',
          explanation: 'Tim Berners-Lee wrote the first WWW proposal and built the HTTP protocols.',
          difficulty: 'medium'
        },
        {
          question: 'Which tech conglomerate owns and operates AWS (Amazon Web Services)?',
          options: ['Google', 'Microsoft', 'Amazon', 'Apple'],
          correctAnswer: 'Amazon',
          explanation: 'AWS is Amazon\'s cloud computing division, launched in the early 2000s.',
          difficulty: 'easy'
        },
        {
          question: 'What HTTP status code is returned when a requested page is not found?',
          options: ['200', '301', '404', '500'],
          correctAnswer: '404',
          explanation: 'Status code 404 indicates that the server cannot locate the requested URL.',
          difficulty: 'easy'
        },
        {
          question: 'Which component is referred to as the main brain of a computer?',
          options: ['GPU', 'RAM', 'SSD', 'CPU'],
          correctAnswer: 'CPU',
          explanation: 'The Central Processing Unit (CPU) executes commands and processes data flows.',
          difficulty: 'easy'
        },
        {
          question: 'What is the primary function of Docker in software deployment?',
          options: ['Database caching', 'Containerization of applications', 'Compilation of source files', 'Version control branching'],
          correctAnswer: 'Containerization of applications',
          explanation: 'Docker packages software into isolated containers containing code, runtimes, and system configurations.',
          difficulty: 'medium'
        },
        {
          question: 'What is the average time complexity of performing a Binary Search on a sorted array?',
          options: ['O(1)', 'O(n)', 'O(n log n)', 'O(log n)'],
          correctAnswer: 'O(log n)',
          explanation: 'Binary search splits the search interval in half at each step, resulting in a logarithmic runtime.',
          difficulty: 'hard'
        },
        {
          question: 'What is the bit-length of an IPv6 internet address?',
          options: ['32 bits', '64 bits', '128 bits', '256 bits'],
          correctAnswer: '128 bits',
          explanation: 'IPv6 addresses are 128-bit values represented in hexadecimal notation, replacing 32-bit IPv4 addresses.',
          difficulty: 'hard'
        },
        {
          question: 'In database systems, what property of ACID transactions guarantees that transactions are either fully completed or not executed at all?',
          options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
          correctAnswer: 'Atomicity',
          explanation: 'Atomicity guarantees that all operations in a database transaction succeed or roll back entirely.',
          difficulty: 'hard'
        },
        {
          question: 'Which TCP port number is utilized by the secure HTTPS protocol by default?',
          options: ['80', '8080', '443', '22'],
          correctAnswer: '443',
          explanation: 'HTTPS default connection requests target TCP port 443. Standard HTTP uses port 80.',
          difficulty: 'hard'
        }
      ];
    }

    // Dynamic scoring rubric based on chosen difficulty level
    const difficultyScores = {
      Easy: { easy: 3, medium: 2, hard: 1 },
      Medium: { medium: 3, easy: 2, hard: 2 },
      Hard: { hard: 3, medium: 2, easy: 1 }
    };

    const rubric = difficultyScores[difficulty] || difficultyScores.Medium;

    // Score and sort pool
    const scoredPool = pool.map(q => {
      const qDifficulty = q.difficulty || 'medium';
      const score = rubric[qDifficulty] || 2;
      return { ...q, score };
    });

    // Sort by score descending and take the top 15 questions
    scoredPool.sort((a, b) => b.score - a.score);
    const selectedQuestions = scoredPool.slice(0, 15).map(({ score, ...q }) => q);

    const finalQuiz = {
      id: 'ai_' + Date.now(),
      title: title,
      description: `AI generated from document: ${file.name} | Difficulty: ${difficulty}`,
      questions: selectedQuestions,
      createdAt: new Date().toISOString(),
      type: 'ai',
      difficulty: difficulty
    };

    onSave(finalQuiz);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (['pdf', 'docx', 'txt'].includes(ext)) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid file format (.pdf, .docx, .txt).');
    }
  };

  const handleStartGeneration = () => {
    if (!file) return;
    setStatus('loading');
  };

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 border border-white/5 relative overflow-hidden animate-modal-in">
      {/* Dynamic background lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {status === 'idle' && (
        <div>
          <div className="flex justify-between items-center pb-6 border-b border-white/5 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>🤖</span> AI Quiz from Document
              </h2>
              <p className="text-sm text-gray-400 mt-1">Upload files and let AI construct trivia questions automatically.</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer btn-active-scale"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* File Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 mb-8 hover:scale-[1.015] hover:bg-gray-950/40 ${
              isDragActive 
                ? 'border-purple-500 bg-purple-500/5' 
                : 'border-white/10 hover:border-white/20 bg-gray-950/20'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
            <UploadCloud className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-2">Drag and drop your file here</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto mb-1">
              Supports PDF, DOCX, or TXT documents.
            </p>
            <p className="text-xs text-gray-500">Max size 25MB</p>
          </div>

          {/* Selected File Card */}
          {file && (
            <div className="mb-8 flex items-center justify-between p-4 rounded-xl bg-gray-950 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white truncate max-w-md">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
            </div>
          )}

          {/* Difficulty Selector */}
          <div className="mb-8 text-left">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Quiz Difficulty</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setDifficulty('Easy')}
                className={`py-3.5 rounded-xl border font-bold text-sm transition-all cursor-pointer text-center btn-active-scale ${
                  difficulty === 'Easy'
                    ? 'bg-emerald-500/10 border-emerald-550 text-emerald-450 shadow-lg shadow-emerald-500/10'
                    : 'bg-gray-950/40 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                🟢 Easy
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('Medium')}
                className={`py-3.5 rounded-xl border font-bold text-sm transition-all cursor-pointer text-center btn-active-scale ${
                  difficulty === 'Medium'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-gray-950/40 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                🟡 Medium
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('Hard')}
                className={`py-3.5 rounded-xl border font-bold text-sm transition-all cursor-pointer text-center btn-active-scale ${
                  difficulty === 'Hard'
                    ? 'bg-rose-500/10 border-rose-500 text-rose-450 shadow-lg shadow-rose-500/10'
                    : 'bg-gray-950/40 border-white/5 text-gray-450 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                🔴 Hard
              </button>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
            <button
              onClick={onCancel}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-all cursor-pointer btn-active-scale"
            >
              Cancel
            </button>
            <button
              onClick={handleStartGeneration}
              disabled={!file}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:pointer-events-none text-white font-semibold text-sm shadow-lg shadow-purple-600/20 hover:shadow-purple-500/30 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 btn-active-scale"
            >
              Generate Quiz
            </button>
          </div>
        </div>
      )}

      {/* Loading/Generation Stage */}
      {status === 'loading' && (
        <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="relative mb-8">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin relative" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Analyzing Document ({difficulty})</h3>
          <p className="text-sm text-gray-400 max-w-sm mb-6">Our simulated AI system is extracting core principles and generating multiple choice options.</p>

          <div className="w-full max-w-md bg-gray-950/80 rounded-2xl p-4 border border-white/5 space-y-3">
            {loadingMessages.map((msg, idx) => {
              const isDone = loadingStep > idx;
              const isActive = loadingStep === idx;
              
              return (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3 text-sm text-left transition-all ${
                    isDone 
                      ? 'text-emerald-400' 
                      : isActive 
                        ? 'text-white font-medium pulse-status' 
                        : 'text-gray-650'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs ${
                    isDone 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : isActive 
                        ? 'border-purple-500 text-purple-400' 
                        : 'border-gray-800'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <span>{msg}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
