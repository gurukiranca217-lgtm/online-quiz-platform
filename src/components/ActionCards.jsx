import React from 'react';
import { PenTool, Sparkles, Shuffle, Users } from 'lucide-react';

export default function ActionCards({ activeCard, onSelectCard }) {
  const cards = [
    {
      id: 'manual',
      emoji: '✏️',
      title: 'Manual Creation',
      description: 'Design your own custom quiz. Add questions, define options, and choose the correct answer manually.',
      icon: <PenTool className="w-5 h-5 text-indigo-400" />,
      glowClass: 'glow-active-blue',
      hoverBorder: 'hover:border-indigo-500/30'
    },
    {
      id: 'ai',
      emoji: '🤖',
      title: 'AI from Document',
      description: 'Upload PDF, Word, or text files, and let our AI model read, extract facts, and generate a reviewable quiz.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      glowClass: 'glow-active-purple',
      hoverBorder: 'hover:border-purple-500/30'
    },
    {
      id: 'surprise',
      emoji: '🎲',
      title: 'Surprise Me',
      description: 'Enter a topic (or let us pick!) and instantly test your knowledge on a dynamically generated topic quiz.',
      icon: <Shuffle className="w-5 h-5 text-amber-400" />,
      glowClass: 'glow-active-purple',
      hoverBorder: 'hover:border-amber-500/30'
    },
    {
      id: 'room',
      emoji: '🏠',
      title: 'Room Quiz',
      description: 'Host or join multiplayer lobbies with a unique 6-digit code. Compete live against colleagues or friends.',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      glowClass: 'glow-active-green',
      hoverBorder: 'hover:border-emerald-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      {cards.map((card) => {
        const isActive = activeCard === card.id;
        return (
          <button
            key={card.id}
            onClick={() => onSelectCard(card.id)}
            className={`w-full text-left glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group cursor-pointer flex flex-col justify-between min-h-[190px] btn-active-scale ${
              isActive 
                ? `${card.glowClass} border-transparent bg-theme-card-bg-active` 
                : `border-theme-border hover:bg-theme-card-bg-hover hover:-translate-y-1 hover:scale-[1.025] ${card.hoverBorder}`
            }`}
          >
            {/* Ambient Background Glow for hover */}
            <div className="absolute inset-0 bg-radial from-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div>
              {/* Card Header with Icon and Emoji */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-3xl">{card.emoji}</span>
                <div className="p-2 rounded-xl bg-theme-glass-bg border border-theme-border group-hover:border-theme-border transition-colors">
                  {card.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-theme-text-primary transition-colors mb-2">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-theme-text-secondary leading-relaxed font-light group-hover:text-theme-text-primary transition-colors">
                {card.description}
              </p>
            </div>
            
            {/* Active Indicator Bar */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-75" />
            )}
          </button>
        );
      })}
    </div>
  );
}
