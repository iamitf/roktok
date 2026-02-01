'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Shot {
  id: string;
  content: string;
  question: string;
  options: string[];
  correctAnswer: number;
  videoUrl?: string;
  imageUrl?: string;
}

export default function RokTok() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // Generate initial content on mount
  useEffect(() => {
    generateInitialShots();
  }, []);

  // Pre-fetch next shot when user reaches the last one
  useEffect(() => {
    if (shots.length > 0 && currentIndex === shots.length - 1 && !generating) {
      generateMoreShots();
    }
  }, [currentIndex, shots.length]);

  const generateInitialShots = async () => {
    setLoading(true);
    const initialShots = await generateShots(3);
    setShots(initialShots);
    setLoading(false);
  };

  const generateMoreShots = async () => {
    setGenerating(true);
    const newShots = await generateShots(2);
    setShots(prev => [...prev, ...newShots]);
    setGenerating(false);
  };

  const generateShots = async (count: number): Promise<Shot[]> => {
    const newShots: Shot[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const response = await fetch('/api/generate-content', {
          method: 'POST',
        });
        
        if (response.ok) {
          const data = await response.json();
          newShots.push({
            id: `shot-${Date.now()}-${i}`,
            content: data.content,
            question: data.question,
            options: data.options,
            correctAnswer: data.correctAnswer,
            imageUrl: data.imageUrl,
          });
        }
      } catch (error) {
        console.error('Error generating shot:', error);
      }
    }
    
    return newShots;
  };

  const handleNext = () => {
    if (currentIndex < shots.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowOptions(false);
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowOptions(false);
      setSelectedOption(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = touchStartY.current - touchEndY.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe up - next shot
        handleNext();
      } else {
        // Swipe down - previous shot
        handlePrevious();
      }
    }
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div 
          className="loader"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="loader-inner"></div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading RokTok...
        </motion.p>
      </div>
    );
  }

  const currentShot = shots[currentIndex];

  return (
    <div 
      className="roktok-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentShot?.id}
          className="shot-wrapper"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          {currentShot && (
            <>
              {/* Background Image/Video */}
              <div className="shot-background">
                {currentShot.imageUrl ? (
                  <img src={currentShot.imageUrl} alt="Content" />
                ) : (
                  <div className="gradient-bg"></div>
                )}
                <div className="overlay"></div>
              </div>

              {/* Content Layer */}
              <div className="content-layer">
                {/* Header */}
                <div className="header">
                  <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    RokTok
                  </motion.h1>
                  <div className="shot-counter">
                    {currentIndex + 1} / {shots.length}
                  </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                  <motion.div
                    className="content-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p>{currentShot.content}</p>
                  </motion.div>

                  <motion.div
                    className="question-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2>{currentShot.question}</h2>
                  </motion.div>
                </div>

                {/* Options Panel */}
                <AnimatePresence>
                  {showOptions && (
                    <motion.div
                      className="options-panel"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    >
                      <div className="options-header">
                        <h3>Choose your answer</h3>
                        <button 
                          className="close-btn"
                          onClick={() => setShowOptions(false)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="options-list">
                        {currentShot.options.map((option, index) => (
                          <motion.button
                            key={index}
                            className={`option-btn ${
                              selectedOption === index
                                ? index === currentShot.correctAnswer
                                  ? 'correct'
                                  : 'incorrect'
                                : ''
                            }`}
                            onClick={() => handleOptionSelect(index)}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            disabled={selectedOption !== null}
                          >
                            <span className="option-letter">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="option-text">{option}</span>
                            {selectedOption !== null && index === currentShot.correctAnswer && (
                              <span className="check-mark">✓</span>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA Button */}
                {!showOptions && (
                  <motion.button
                    className="cta-button"
                    onClick={() => setShowOptions(true)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="cta-text">Show Options</span>
                    <span className="cta-icon">▼</span>
                  </motion.button>
                )}

                {/* Navigation Buttons */}
                <div className="nav-buttons">
                  <button
                    className="nav-btn prev"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button
                    className="nav-btn next"
                    onClick={handleNext}
                    disabled={currentIndex === shots.length - 1}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow: hidden;
          background: #000;
        }

        .roktok-container {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background: #000;
        }

        .loading-screen {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .loader {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          position: relative;
        }

        .loader-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          background: white;
          border-radius: 50%;
        }

        .loading-screen p {
          margin-top: 20px;
          color: white;
          font-size: 18px;
          font-weight: 600;
        }

        .shot-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .shot-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .shot-background img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gradient-bg {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, 
            #667eea 0%, 
            #764ba2 50%, 
            #f093fb 100%
          );
          animation: gradientShift 10s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(30deg); }
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.5) 100%
          );
        }

        .content-layer {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header h1 {
          font-size: 28px;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          letter-spacing: -0.5px;
        }

        .shot-counter {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 24px;
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
        }

        .content-text {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .content-text p {
          color: white;
          font-size: 16px;
          line-height: 1.6;
          font-weight: 500;
        }

        .question-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        .question-card h2 {
          color: #1a1a1a;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.4;
          text-align: center;
        }

        .cta-button {
          position: fixed;
          bottom: 140px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 60px;
          padding: 20px 48px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.5);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 10;
        }

        .cta-icon {
          font-size: 14px;
        }

        .nav-buttons {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 20px;
          z-index: 10;
        }

        .nav-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .nav-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .options-panel {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-radius: 32px 32px 0 0;
          padding: 24px;
          max-height: 70vh;
          overflow-y: auto;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
          z-index: 100;
        }

        .options-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .options-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f0f0f0;
          border: none;
          font-size: 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #f8f8f8;
          border: 2px solid #e0e0e0;
          border-radius: 16px;
          padding: 18px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .option-btn:hover:not(:disabled) {
          background: #f0f0f0;
          border-color: #667eea;
        }

        .option-btn.correct {
          background: #d4edda;
          border-color: #28a745;
        }

        .option-btn.incorrect {
          background: #f8d7da;
          border-color: #dc3545;
        }

        .option-letter {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #667eea;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .option-text {
          flex: 1;
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .check-mark {
          color: #28a745;
          font-size: 24px;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .content-layer {
            padding: 16px;
          }

          .header h1 {
            font-size: 24px;
          }

          .question-card h2 {
            font-size: 18px;
          }

          .content-text p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
