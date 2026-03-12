import React, { useState } from 'react';
import { UserContext } from '../types';
import { ArrowRight, Check, Briefcase, Wrench, Layers, Factory, Globe, GraduationCap, Medal, Cpu, ChevronLeft, Sparkles, Database } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (context: UserContext) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [workflow, setWorkflow] = useState('');
  const [resources, setResources] = useState<string[]>([]);
  const [lifecycle, setLifecycle] = useState('');
  const [industry, setIndustry] = useState('');
  const [role, setRole] = useState('');
  const [projectKnowledge, setProjectKnowledge] = useState('');

  const TOTAL_STEPS = 6;

  const workflows = [
    { id: 'rapid_proto', label: 'Rapid Prototyping', desc: 'Speed and iteration over perfection', icon: <Cpu size={24} /> },
    { id: 'production', label: 'Production Engineering', desc: 'DFM, cost reduction, reliability', icon: <Briefcase size={24} /> },
    { id: 'r_and_d', label: 'Research & Development', desc: 'Exploratory, high uncertainty', icon: <Layers size={24} /> },
  ];

  const resourceOptions = [
    'Internal Machine Shop (CNC)',
    '3D Printing Farm (FDM/SLA)',
    'Certified Testing Lab',
    'PCB Assembly Line',
    'Sheet Metal Fabrication',
    'Procurement Team'
  ];

  const lifecycles = [
    { id: 'agile', label: 'Agile Hardware', desc: 'Sprints, MVP iterations' },
    { id: 'stage_gate', label: 'Stage-Gate / Waterfall', desc: 'Structured milestones (PDR, CDR)' },
    { id: 'v_model', label: 'V-Model', desc: 'Strict systems engineering (Medical/Auto)' },
  ];

  const industries = [
    { id: 'consumer', label: 'Consumer Electronics', icon: <Cpu size={20} /> },
    { id: 'automation', label: 'Industrial Automation', icon: <Factory size={20} /> },
    { id: 'medical', label: 'Medical Devices', icon: <Briefcase size={20} /> },
    { id: 'robotics', label: 'Robotics', icon: <Wrench size={20} /> },
    { id: 'auto', label: 'Automotive / Aerospace', icon: <Globe size={20} /> },
  ];

  const roles = [
    { id: 'student', label: 'Student / Junior Engineer', desc: 'Focus on learning and first principles', icon: <GraduationCap size={24} /> },
    { id: 'senior', label: 'Senior Engineer', desc: 'Focus on standards, speed, and validation', icon: <Wrench size={24} /> },
    { id: 'lead', label: 'Lead / Manager', desc: 'Focus on risk, cost, and system architecture', icon: <Medal size={24} /> },
  ];

  const knowledgeOptions = [
    { id: 'none', label: 'Starting from scratch', desc: 'No existing documentation or CAD files', icon: <Sparkles size={24} /> },
    { id: 'some', label: 'Some existing files', desc: 'A few CAD models, PDFs, or datasheets', icon: <Layers size={24} /> },
    { id: 'extensive', label: 'Extensive library', desc: 'Full PDM/PLM system, thousands of parts', icon: <Database size={24} /> },
  ];

  const toggleResource = (res: string) => {
    setResources(prev => 
      prev.includes(res) ? prev.filter(r => r !== res) : [...prev, res]
    );
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      onComplete({
        workflow: workflows.find(w => w.id === workflow)?.label || workflow,
        resources,
        lifecycle: lifecycles.find(l => l.id === lifecycle)?.label || lifecycle,
        industry: industries.find(i => i.id === industry)?.label || industry,
        role: roles.find(r => r.id === role)?.label || role,
        projectKnowledge: knowledgeOptions.find(k => k.id === projectKnowledge)?.label || projectKnowledge,
      });
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!workflow;
    if (step === 2) return resources.length > 0;
    if (step === 3) return !!lifecycle;
    if (step === 4) return !!industry;
    if (step === 5) return !!role;
    if (step === 6) return !!projectKnowledge;
    return false;
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-white animate-in fade-in duration-500 font-sans">
      {/* Left Pane - Branding & Context */}
      <div className="hidden md:flex w-1/2 bg-brand-darkBlue text-white p-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white text-brand-darkBlue rounded-2xl flex items-center justify-center shadow-2xl mb-12 transform -rotate-3">
            <span className="font-serif font-bold text-3xl">B</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-serif font-medium leading-[0.9] tracking-tight mb-8">
            Buildables<br/>
            <span className="text-brand-orange italic font-light">Workspace</span>
          </h1>
          <p className="text-xl text-white/70 max-w-md font-light leading-relaxed">
            Let's configure your AI engineering environment to match your specific workflow, resources, and industry standards.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white/50 text-sm font-bold tracking-widest uppercase">
            <Sparkles size={16} className="text-brand-orange" />
            <span>AI-Powered Engineering</span>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full md:w-1/2 flex flex-col h-full relative bg-white">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
          <div 
            className="h-full bg-brand-orange transition-all duration-500 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-16 flex flex-col justify-center custom-scrollbar">
          <div className="max-w-xl w-full mx-auto">
            
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
                <div>
                  <span className="text-brand-orange font-bold tracking-widest uppercase text-xs mb-3 block">Step 1 of 5</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-medium text-brand-darkBlue tracking-tight">What describes your primary workflow?</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {workflows.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setWorkflow(opt.id)}
                      className={`flex items-center p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                        workflow === opt.id 
                          ? 'border-brand-darkBlue bg-brand-lightBlue/30 shadow-md' 
                          : 'border-gray-100 hover:border-brand-darkBlue/30 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-4 rounded-xl mr-6 transition-colors ${workflow === opt.id ? 'bg-brand-darkBlue text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <div className="font-bold text-brand-darkBlue text-lg mb-1">{opt.label}</div>
                        <div className="text-sm text-gray-500 font-medium">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
                <div>
                  <span className="text-brand-orange font-bold tracking-widest uppercase text-xs mb-3 block">Step 2 of 5</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-medium text-brand-darkBlue tracking-tight">What resources do you have access to?</h2>
                  <p className="text-gray-500 mt-3 font-medium">Select all that apply.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resourceOptions.map((res) => (
                    <button
                      key={res}
                      onClick={() => toggleResource(res)}
                      className={`flex items-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                        resources.includes(res)
                          ? 'border-brand-darkBlue bg-brand-lightBlue/30 shadow-md'
                          : 'border-gray-100 hover:border-brand-darkBlue/30 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-md border-2 mr-4 flex items-center justify-center transition-colors ${
                        resources.includes(res) ? 'bg-brand-darkBlue border-brand-darkBlue' : 'border-gray-300 bg-white'
                      }`}>
                        {resources.includes(res) && <Check size={14} className="text-white" />}
                      </div>
                      <span className="text-sm font-bold text-brand-darkBlue">{res}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
               <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
               <div>
                 <span className="text-brand-orange font-bold tracking-widest uppercase text-xs mb-3 block">Step 3 of 5</span>
                 <h2 className="text-3xl md:text-4xl font-serif font-medium text-brand-darkBlue tracking-tight">Which product lifecycle do you follow?</h2>
               </div>
               <div className="grid grid-cols-1 gap-4">
                 {lifecycles.map((opt) => (
                   <button
                     key={opt.id}
                     onClick={() => setLifecycle(opt.id)}
                     className={`flex items-center justify-between p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                       lifecycle === opt.id 
                         ? 'border-brand-darkBlue bg-brand-lightBlue/30 shadow-md' 
                         : 'border-gray-100 hover:border-brand-darkBlue/30 hover:bg-gray-50'
                     }`}
                   >
                     <div>
                       <div className="font-bold text-brand-darkBlue text-lg mb-1">{opt.label}</div>
                       <div className="text-sm text-gray-500 font-medium">{opt.desc}</div>
                     </div>
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                       lifecycle === opt.id ? 'border-brand-darkBlue bg-brand-darkBlue' : 'border-gray-300'
                     }`}>
                         {lifecycle === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                     </div>
                   </button>
                 ))}
               </div>
             </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
                <div>
                  <span className="text-brand-orange font-bold tracking-widest uppercase text-xs mb-3 block">Step 4 of 5</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-medium text-brand-darkBlue tracking-tight">What is your primary industry domain?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {industries.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setIndustry(opt.id)}
                      className={`flex flex-col items-start p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                        industry === opt.id 
                          ? 'border-brand-darkBlue bg-brand-lightBlue/30 shadow-md' 
                          : 'border-gray-100 hover:border-brand-darkBlue/30 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-3 rounded-xl mb-4 transition-colors ${industry === opt.id ? 'bg-brand-darkBlue text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {opt.icon}
                      </div>
                      <span className="font-bold text-brand-darkBlue text-base">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
                <div>
                  <span className="text-brand-orange font-bold tracking-widest uppercase text-xs mb-3 block">Step 5 of 5</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-medium text-brand-darkBlue tracking-tight">What is your engineering role?</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {roles.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setRole(opt.id)}
                      className={`flex items-center p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                        role === opt.id 
                          ? 'border-brand-darkBlue bg-brand-lightBlue/30 shadow-md' 
                          : 'border-gray-100 hover:border-brand-darkBlue/30 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-4 rounded-xl mr-6 transition-colors ${role === opt.id ? 'bg-brand-darkBlue text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-brand-darkBlue text-lg mb-1">{opt.label}</div>
                        <div className="text-sm text-gray-500 font-medium">{opt.desc}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        role === opt.id ? 'border-brand-darkBlue bg-brand-darkBlue' : 'border-gray-300'
                      }`}>
                          {role === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 md:px-16 border-t border-gray-100 bg-white flex justify-between items-center flex-shrink-0">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            className={`flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-darkBlue transition-colors ${step === 1 ? 'invisible' : ''}`}
          >
            <ChevronLeft size={18} /> Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all ${
              isStepValid() 
                ? 'bg-brand-darkBlue hover:bg-brand-orange shadow-xl hover:shadow-2xl hover:-translate-y-1' 
                : 'bg-gray-200 cursor-not-allowed text-gray-400'
            }`}
          >
            {step === TOTAL_STEPS ? 'Enter Workspace' : 'Continue'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};