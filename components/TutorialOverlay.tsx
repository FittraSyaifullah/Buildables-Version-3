
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, Cpu, MessageSquare, Database, X, Sparkles, LayoutGrid, Package, Wrench, Search } from 'lucide-react';

interface TutorialOverlayProps {
  onComplete: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Smooth fade in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      title: "Welcome to Buildables v3",
      desc: "Your AI-powered mechanical engineering companion. Let's take a quick tour to explore your new workspace features.",
      positionClass: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      mobilePosition: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      arrow: null,
      icon: <Sparkles size={24} className="text-yellow-500" />,
      beacon: null
    },
    {
      title: "Project Dashboard",
      desc: "Start here to view recent activity or create new projects from quick-start templates.",
      positionClass: "top-[130px] left-[280px]",
      mobilePosition: "top-20 left-1/2 -translate-x-1/2",
      arrow: "left",
      icon: <LayoutGrid size={24} className="text-indigo-500" />,
      beacon: { top: '155px', left: '128px' } // Points to Dashboard in sidebar
    },
    {
      title: "Centralized Parts Library",
      desc: "New Feature: Manage your organization's standard parts, track inventory levels, and access detailed specs instantly.",
      positionClass: "top-[170px] left-[280px]",
      mobilePosition: "top-40 left-1/2 -translate-x-1/2",
      arrow: "left",
      icon: <Package size={24} className="text-green-500" />,
      beacon: { top: '195px', left: '128px' } // Points to Library in sidebar
    },
    {
      title: "Engineering Modes",
      desc: "Switch context between 'Concept' for ideation, 'Sourcing' for supply chain optimization, and 'Copilot' for general tasks.",
      positionClass: "top-[280px] left-[280px]",
      mobilePosition: "top-60 left-1/2 -translate-x-1/2",
      arrow: "left",
      icon: <Cpu size={24} className="text-purple-500" />,
      beacon: { top: '300px', left: '128px' } // Points to Modes section
    },
    {
      title: "Smart Input & Tools",
      desc: "Use the '+' menu for specialized tools like Visual Search (search by image) and Compliance checks. Attach files for context.",
      positionClass: "bottom-[140px] left-[320px]",
      mobilePosition: "bottom-40 left-1/2 -translate-x-1/2",
      arrow: "down",
      icon: <Wrench size={24} className="text-blue-500" />,
      beacon: { bottom: '80px', left: '300px' } // Points to input area tools
    },
    {
      title: "Intelligent Artifacts",
      desc: "Generated CAD models, BOMs, and Documents appear here. You can interact with them, compare parts, and export data.",
      positionClass: "top-1/2 right-[100px] -translate-y-1/2",
      mobilePosition: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      arrow: "right",
      icon: <Database size={24} className="text-orange-500" />,
      beacon: { top: '50%', right: '40px' } // Points to right panel area
    }
  ];

  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
         if (step < steps.length - 1) setStep(s => s + 1);
         else handleClose();
      }
      if (e.key === 'ArrowLeft' && step > 0) setStep(s => s - 1);
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, steps.length]);

  return (
    <div className={`fixed inset-0 z-[60] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-darkBlue/40 backdrop-blur-[2px]" onClick={handleClose} />

      {/* Beacon Animation (Desktop Only) */}
      {current.beacon && (
          <div 
            className="absolute z-10 hidden md:block transition-all duration-500 ease-in-out pointer-events-none" 
            style={{ 
                top: current.beacon.top, 
                left: current.beacon.left, 
                bottom: current.beacon.bottom, 
                right: current.beacon.right 
            }}
          >
            <span className="relative flex h-8 w-8 -translate-x-1/2 -translate-y-1/2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-8 w-8 bg-brand-orange/40 border-2 border-white shadow-lg"></span>
            </span>
          </div>
      )}

      {/* Card Container (Desktop) */}
      <div className={`absolute ${current.positionClass} transition-all duration-500 ease-in-out hidden md:block z-20`}>
        <TutorialCard 
            step={step} 
            total={steps.length} 
            data={current} 
            onNext={handleNext} 
            onBack={handleBack} 
            onSkip={handleClose} 
        />
      </div>

      {/* Card Container (Mobile) */}
      <div className={`absolute ${current.mobilePosition} w-[90%] max-w-sm transition-all duration-500 ease-in-out md:hidden block z-20`}>
         <TutorialCard 
            step={step} 
            total={steps.length} 
            data={current} 
            onNext={handleNext} 
            onBack={handleBack} 
            onSkip={handleClose} 
            isMobile
        />
      </div>
    </div>
  );
};

// Extracted Card Component
const TutorialCard = ({ step, total, data, onNext, onBack, onSkip, isMobile = false }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 w-full max-w-sm relative animate-in zoom-in-95 fade-in duration-300 ring-1 ring-black/5">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue via-brand-orange to-brand-blue rounded-t-2xl opacity-80"></div>
        
        {/* Arrow (Desktop only) */}
        {!isMobile && data.arrow && (
            <>
                {data.arrow === 'left' && <div className="absolute top-8 -left-2 w-4 h-4 bg-white transform rotate-45 border-l border-b border-gray-100"></div>}
                {data.arrow === 'down' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100"></div>}
                {data.arrow === 'right' && <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-white transform rotate-45 border-r border-t border-gray-100"></div>}
            </>
        )}

        <button onClick={onSkip} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
            <X size={18} />
        </button>

        <div className="flex items-center gap-4 mb-4 mt-1">
            <div className="p-3 bg-brand-lightBlue/50 rounded-xl border border-brand-blue/10 text-brand-darkBlue shadow-inner">
                {data.icon}
            </div>
            <div>
                <h3 className="font-bold text-brand-darkBlue text-lg leading-tight">{data.title}</h3>
                <span className="text-[10px] font-bold text-brand-blue/60 uppercase tracking-widest">
                    Tip {step + 1} of {total}
                </span>
            </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-8 leading-relaxed font-medium">
            {data.desc}
        </p>

        <div className="flex justify-between items-center">
            <div className="flex gap-1">
                {Array.from({ length: total }).map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-brand-blue' : 'w-1.5 bg-gray-200'}`} />
                ))}
            </div>
            <div className="flex gap-2">
                {step > 0 && (
                    <button 
                        onClick={onBack} 
                        className="p-2 text-gray-400 hover:text-brand-darkBlue hover:bg-gray-100 rounded-lg transition-colors"
                        title="Back"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
                <button 
                    onClick={onNext}
                    className="bg-brand-darkBlue text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-blue transition-all shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-0.5 flex items-center gap-2"
                >
                    {step === total - 1 ? 'Start Building' : 'Next'}
                    {step < total - 1 && <ArrowRight size={16} />}
                </button>
            </div>
        </div>
    </div>
);
