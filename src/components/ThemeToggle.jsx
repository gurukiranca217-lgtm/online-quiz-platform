import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer btn-active-scale flex items-center justify-center relative overflow-hidden group shadow-md"
      aria-label="Toggle Theme"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <div className={`absolute inset-0 transition-transform duration-500 ease-out flex items-center justify-center ${
          theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}>
          <Sun className="w-5 h-5 text-amber-500 fill-amber-500/10 group-hover:scale-105 transition-transform" />
        </div>

        {/* Moon Icon */}
        <div className={`absolute inset-0 transition-transform duration-500 ease-out flex items-center justify-center ${
          theme === 'light' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}>
          <Moon className="w-5 h-5 text-indigo-400 fill-indigo-400/10 group-hover:scale-105 transition-transform" />
        </div>
      </div>
    </button>
  );
}
