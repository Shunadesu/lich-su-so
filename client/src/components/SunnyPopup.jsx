import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const SunnyPopup = ({ isOpen, onClose }) => {
  const [fireworks, setFireworks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Tạo pháo hoa ngẫu nhiên
      const createFirework = () => {
        const colors = [
          '#ff6b6b', '#4ecdc4', '#ffe66d', '#ff8b94', 
          '#a8e6cf', '#ffd93d', '#95e1d3', '#f38181'
        ];
        
        return {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      };

      // Tạo pháo hoa ban đầu
      const initialFireworks = Array.from({ length: 8 }, () => createFirework());
      setFireworks(initialFireworks);

      const interval = setInterval(() => {
        setFireworks((prev) => {
          if (prev.length < 20) {
            return [...prev, createFirework()];
          }
          return prev;
        });
      }, 300);

      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setFireworks([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes firework {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1);
            opacity: 0;
          }
        }

        .firework-container {
          position: absolute;
          width: 4px;
          height: 4px;
        }

        .firework-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color);
          box-shadow: 0 0 10px var(--color);
          animation: firework 1.5s ease-out forwards;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }

        .delay-75 {
          animation-delay: 0.075s;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>

      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Fireworks overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {fireworks.map((firework, idx) => {
            const particles = 12;
            const angleStep = (2 * Math.PI) / particles;
            
            return (
              <div
                key={firework.id}
                className="firework-container"
                style={{
                  top: `${firework.y}%`,
                  left: `${firework.x}%`,
                  '--color': firework.color,
                }}
              >
                {Array.from({ length: particles }).map((_, i) => {
                  const angle = i * angleStep;
                  const distance = 80;
                  const tx = Math.cos(angle) * distance;
                  const ty = Math.sin(angle) * distance;
                  
                  return (
                    <div
                      key={i}
                      className="firework-particle"
                      style={{
                        '--tx': `${tx}px`,
                        '--ty': `${ty}px`,
                        '--color': firework.color,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Popup content */}
        <div 
          className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-fadeInScale"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-amber-100 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="mb-2">
              <div className="text-6xl mb-4">🎆</div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                Sunny
              </h2>
            </div>
            
            <p className="text-xl text-white font-semibold leading-relaxed drop-shadow-md">
              Chúc cho dự án thành công rực rỡ nhé
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SunnyPopup;
