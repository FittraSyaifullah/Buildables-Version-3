import React, { useState } from 'react';
import { UserContext } from '../types';
import { ArrowRight, Check, Briefcase, Wrench, RefreshCw, Cpu, Layers, Factory, Globe, GraduationCap, Medal } from 'lucide-react';

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

  const TOTAL_STEPS = 5;

  const workflows = [
    { id: 'rapid_proto', label: 'Rapid Prototyping', desc: 'Speed and iteration over perfection', icon: <Cpu size={20} /> },
    { id: 'production', label: 'Production Engineering', desc: 'DFM, cost reduction, reliability', icon: <Briefcase size={20} /> },
    { id: 'r_and_d', label: 'Research & Development', desc: 'Exploratory, high uncertainty', icon: <Layers size={20} /> },
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
    { id: 'consumer', label: 'Consumer Electronics', icon: <Cpu size={18} /> },
    { id: 'automation', label: 'Industrial Automation', icon: <Factory size={18} /> },
    { id: 'medical', label: 'Medical Devices', icon: <Briefcase size={18} /> },
    { id: 'robotics', label: 'Robotics', icon: <Wrench size={18} /> },
    { id: 'auto', label: 'Automotive / Aerospace', icon: <Globe size={18} /> },
  ];

  const roles = [
    { id: 'student', label: 'Student / Junior Engineer', desc: 'Focus on learning and first principles', icon: <GraduationCap size={18} /> },
    { id: 'senior', label: 'Senior Engineer', desc: 'Focus on standards, speed, and validation', icon: <Wrench size={18} /> },
    { id: 'lead', label: 'Lead / Manager', desc: 'Focus on risk, cost, and system architecture', icon: <Medal size={18} /> },
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
      });
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!workflow;
    if (step === 2) return resources.length > 0;
    if (step === 3) return !!lifecycle;
    if (step === 4) return !!industry;
    if (step === 5) return !!role;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-darkBlue/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-brand-gray border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-brand-darkBlue">Setup your Workspace</h2>
            <p className="text-sm text-gray-500 mt-1">Configure Buildables v3 for your specific needs.</p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-2 w-2 rounded-full transition-colors ${step >= i ? 'bg-brand-blue' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-brand-darkBlue mb-4">1. What describes your primary workflow?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {workflows.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setWorkflow(opt.id)}
                    className={`flex flex-col items-start p-4 border rounded-xl text-left transition-all ${
                      workflow === opt.id 
                        ? 'border-brand-blue bg-brand-lightBlue ring-1 ring-brand-blue' 
                        : 'border-gray-200 hover:border-brand-blue/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mb-3 ${workflow === opt.id ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {opt.icon}
                    </div>
                    <div className="font-bold text-brand-darkBlue text-sm">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-brand-darkBlue mb-4">2. What resources do you have access to?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resourceOptions.map((res) => (
                  <button
                    key={res}
                    onClick={() => toggleResource(res)}
                    className={`flex items-center p-4 border rounded-xl transition-all ${
                      resources.includes(res)
                        ? 'border-brand-blue bg-brand-lightBlue text-brand-blue'
                        : 'border-gray-200 hover:border-brand-blue/50 text-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                      resources.includes(res) ? 'bg-brand-blue border-brand-blue' : 'border-gray-300 bg-white'
                    }`}>
                      {resources.includes(res) && <Check size={14} className="text-white" />}
                    </div>
                    <span className="text-sm font-medium">{res}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <h3 className="text-lg font-semibold text-brand-darkBlue mb-4">3. Which product lifecycle do you follow?</h3>
             <div className="space-y-3">
               {lifecycles.map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => setLifecycle(opt.id)}
                   className={`w-full flex items-center justify-between p-4 border rounded-xl text-left transition-all ${
                     lifecycle === opt.id 
                       ? 'border-brand-blue bg-brand-lightBlue ring-1 ring-brand-blue' 
                       : 'border-gray-200 hover:border-brand-blue/50 hover:bg-gray-50'
                   }`}
                 >
                   <div>
                     <div className="font-bold text-brand-darkBlue text-sm">{opt.label}</div>
                     <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                   </div>
                   {lifecycle === opt.id && <div className="text-brand-blue"><Check size={20} /></div>}
                 </button>
               ))}
             </div>
           </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-brand-darkBlue mb-4">4. What is your primary industry domain?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {industries.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setIndustry(opt.id)}
                    className={`flex items-center gap-3 p-4 border rounded-xl text-left transition-all ${
                      industry === opt.id 
                        ? 'border-brand-blue bg-brand-lightBlue ring-1 ring-brand-blue' 
                        : 'border-gray-200 hover:border-brand-blue/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${industry === opt.id ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {opt.icon}
                    </div>
                    <span className="font-bold text-brand-darkBlue text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-brand-darkBlue mb-4">5. What is your engineering role?</h3>
              <div className="space-y-3">
                {roles.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setRole(opt.id)}
                    className={`w-full flex items-center gap-4 p-4 border rounded-xl text-left transition-all ${
                      role === opt.id 
                        ? 'border-brand-blue bg-brand-lightBlue ring-1 ring-brand-blue' 
                        : 'border-gray-200 hover:border-brand-blue/50 hover:bg-gray-50'
                    }`}
                  >
                     <div className={`p-2 rounded-lg ${role === opt.id ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-brand-darkBlue text-sm">{opt.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                    </div>
                    {role === opt.id && <div className="text-brand-blue"><Check size={20} /></div>}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            className={`text-sm font-medium text-gray-500 hover:text-brand-darkBlue px-4 py-2 ${step === 1 ? 'invisible' : ''}`}
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all ${
              isStepValid() 
                ? 'bg-brand-orange hover:bg-orange-600 shadow-md transform hover:-translate-y-0.5' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {step === TOTAL_STEPS ? 'Finish Setup' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};