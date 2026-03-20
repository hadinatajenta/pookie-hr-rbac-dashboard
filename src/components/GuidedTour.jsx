import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GuidedTour({ steps, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placement, setPlacement] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [cardPos, setCardPos] = useState({ top: 0, left: 0 });
  const step = steps[currentIndex];

  useEffect(() => {
    if (!isOpen) return;

    const findTarget = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPlacement({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });

        // Simple Card Positioning
        const PADDING = 24;
        let left = rect.left + rect.width / 2;
        let top = rect.bottom + PADDING;

        // Boundary check
        if (top + 250 > window.innerHeight) top = rect.top - 250 - PADDING;
        if (left + 160 > window.innerWidth) left = window.innerWidth - 340;
        if (left < 0) left = 20;

        setCardPos({ top, left: Math.max(20, left - 160) });
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Target not found on this page
        setPlacement({ top: -100, left: -100, width: 0, height: 0 });
        setCardPos({ top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 160 });
      }
    };

    // Initial find
    const timer = setTimeout(findTarget, 300); // Give page a moment to settle
    window.addEventListener('resize', findTarget);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', findTarget);
    };
  }, [currentIndex, isOpen, step]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentIndex < steps.length - 1) setCurrentIndex(prev => prev + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const isTargetVisible = !!document.getElementById(step.targetId);

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Spotlight Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 transition-all duration-300"
        style={{
          clipPath: isTargetVisible ? `polygon(
            0% 0%, 
            0% 100%, 
            ${placement.left - 8}px 100%, 
            ${placement.left - 8}px ${placement.top - 8}px, 
            ${placement.left + placement.width + 8}px ${placement.top - 8}px, 
            ${placement.left + placement.width + 8}px ${placement.top + placement.height + 8}px, 
            ${placement.left - 8}px ${placement.top + placement.height + 8}px, 
            ${placement.left - 8}px 100%, 
            100% 100%, 
            100% 0%
          )` : 'none'
        }}
      />

      {/* Control Card */}
      <div 
        className="absolute w-[320px] bg-white dark:bg-[#1a1b1e] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-5 pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        style={{ top: `${cardPos.top}px`, left: `${cardPos.left}px` }}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
            <X size={16} />
          </button>
        </div>
        
        {!isTargetVisible && step.path && (
          <div className="mb-3 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-[11px] text-amber-700 dark:text-amber-400">
            Note: This element is located on another page. Use the sidebar to go to <strong>{step.pageName}</strong>.
          </div>
        )}

        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          {step.content}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1.5 font-bold">
             <button 
               onClick={handlePrev} 
               disabled={currentIndex === 0}
               className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800"
             >
               <ChevronLeft size={20} />
             </button>
             <button 
               onClick={handleNext}
               className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1"
             >
               {currentIndex === steps.length - 1 ? "Finish" : "Next"} <ChevronRight size={18} />
             </button>
          </div>
          <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 font-medium">Skip</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
