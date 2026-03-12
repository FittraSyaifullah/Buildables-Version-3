
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, Cpu, Database, X, Sparkles, LayoutGrid, Package, Wrench } from 'lucide-react';

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
      icon: <Sparkles size={24} className="text-brand-orange" />,
      beacon: null
    },
    {
      title: "Project Dashboard",
      desc: "Start here to view recent activity or create new projects from quick-start templates.",
      positionClass: "top-[100px] left-[310px]",
      mobilePosition: "top-20 left-1/2 -translate-x-1/2",
      arrow: "left",
      icon: <LayoutGrid size={24} className="text-brand-orange" />,
      beacon: { top: '135px', left: '144px' } 
    },
    {
      title: "Centralized Parts Library",
      desc: "Manage your organization's standard parts, track inventory levels, and access detailed specs instantly.",
      positionClass: "top-[150px] left-[310px]",
      mobilePosition: "top-40 left-1/2 -translate-x-1/2",
      arrow: "left",
      icon: <Package size={24} className="text-brand-orange" />,
      beacon: { top: '185px', left: '144px' } 
    },
    {
      title: "Engineering Modes",
      desc: "Switch context between 'Concept' for ideation, 'Sourcing' for supply chain optimization, and 'Copilot' for general tasks.",
      positionClass: "top-[255px] left-[310px]",
      mobilePosition: "top-60 left-1/2 -translate-x-1/2",
      arrow: "left",
      icon: <Cpu size={24} className="text-brand-orange" />,
      beacon: { top: '290px', left: '144px' } 
    },
    {
      title: "Smart Input & Tools",
      desc: "Use the '+' menu for specialized tools like Visual Search and Compliance checks. Attach files for context.",
      positionClass: "bottom-[140px] left-[calc(50vw+144px)] -translate-x-1/2",
      mobilePosition: "bottom-40 left-1/2 -translate-x-1/2",
      arrow: "down",
      icon: <Wrench size={24} className="text-brand-orange" />,
      beacon: { bottom: '80px', left: 'calc(50vw + 144px)' } 
    },
    {
      title: "Intelligent Artifacts",
      desc: "Generated CAD models, BOMs, and Documents appear here. You can interact with them, compare parts, and export data.",
      positionClass: "top-1/2 right-[100px] -translate-y-1/2",
      mobilePosition: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      arrow: "right",
      icon: <Database size={24} className="text-brand-orange" />,
      beacon: { top: '50%', right: '40px' } 
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
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleClose} />

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
            <span className="relative flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-60"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-orange border-2 border-white shadow-[0_0_15px_rgba(242,125,38,0.8)]"></span>
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
    <div className="bg-brand-darkBlue p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 w-full max-w-sm relative animate-in zoom-in-95 fade-in duration-300">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-orange via-brand-orange/80 to-brand-darkBlue rounded-t-3xl opacity-90"></div>
        
        {/* Arrow (Desktop only) */}
        {!isMobile && data.arrow && (
            <>
                {data.arrow === 'left' && <div className="absolute top-10 -left-2 w-4 h-4 bg-brand-darkBlue transform rotate-45 border-l border-b border-white/10"></div>}
                {data.arrow === 'down' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-darkBlue transform rotate-45 border-r border-b border-white/10"></div>}
                {data.arrow === 'right' && <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-brand-darkBlue transform rotate-45 border-r border-t border-white/10"></div>}
            </>
        )}

        <button onClick={onSkip} className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full">
            <X size={16} />
        </button>

        <div className="flex items-center gap-4 mb-5 mt-2">
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-brand-orange shadow-sm">
                {data.icon}
            </div>
            <div>
                <h3 className="font-serif font-bold text-white text-xl leading-tight tracking-tight">{data.title}</h3>
                <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mt-1 block">
                    Tip {step + 1} of {total}
                </span>
            </div>
        </div>
        
        <p className="text-[15px] text-gray-300 mb-8 leading-relaxed font-medium">
            {data.desc}
        </p>

        <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <div className="flex gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-brand-orange' : 'w-2 bg-white/20'}`} />
                ))}
            </div>
            <div className="flex gap-2">
                {step > 0 && (
                    <button 
                        onClick={onBack} 
                        className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        title="Back"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
                <button 
                    onClick={onNext}
                    className="bg-brand-orange text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-brand-orange/20 hover:-translate-y-0.5 flex items-center gap-2"
                >
                    {step === total - 1 ? 'Start Building' : 'Next'}
                    {step < total - 1 && <ArrowRight size={16} />}
                </button>
            </div>
        </div>
    </div>
);
