
import React from 'react';
import { ProjectSummary, Pillar } from '../types';
import { Clock, Cpu, Database, BookOpen, ArrowRight, Plus, Sparkles } from 'lucide-react';

interface DashboardProps {
  projects: ProjectSummary[];
  onOpenProject: (id: string) => void;
  onNewProject: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, onOpenProject, onNewProject }) => {
  const getIcon = (pillar: Pillar) => {
    switch(pillar) {
        case 'concept': return <Cpu size={20} className="text-brand-darkBlue"/>;
        case 'sourcing': return <Database size={20} className="text-brand-darkBlue"/>;
        case 'copilot': return <BookOpen size={20} className="text-brand-orange"/>;
    }
  };

  const getPillarLabel = (pillar: Pillar) => {
      return 'Engineering Project';
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F0F0F0] p-0 font-sans">
      <div className="max-w-full border-b border-brand-darkBlue/10 bg-white p-12 md:p-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-darkBlue text-white text-[9px] font-mono font-bold uppercase tracking-[0.2em] mb-8 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]">
                    <Sparkles size={12} />
                    System.Status: Operational
                </div>
                <h1 className="text-6xl md:text-8xl font-serif font-bold text-brand-darkBlue tracking-tighter leading-[0.85] mb-8 uppercase">
                    Build <span className="text-brand-orange">Better</span> <br/>Hardware.
                </h1>
                <p className="text-brand-darkBlue/60 font-medium text-lg md:text-xl leading-relaxed max-w-2xl border-l-4 border-brand-orange pl-6">
                    Integrated engineering workspace for mechanical design, component sourcing, and AI-driven technical verification.
                </p>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end gap-8">
                <button 
                    onClick={() => onNewProject()} 
                    className="group relative flex items-center gap-4 px-10 py-5 bg-brand-orange text-white rounded-none text-sm font-black hover:bg-brand-darkBlue transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                >
                    <span className="uppercase tracking-widest">Initialize New Project</span>
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                </button>
                <div className="flex flex-col items-start lg:items-end gap-1 font-mono text-[10px] font-bold text-brand-darkBlue/40 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <span className="text-brand-orange">●</span>
                        <span>Version 3.2.0_STABLE</span>
                    </div>
                    <span>Kernel: Local_Processing_Active</span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-12 md:p-20">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12 border-b-2 border-brand-darkBlue pb-4">
            <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-brand-darkBlue">Active_Projects_Registry</span>
            </div>
            <div className="text-xs font-mono font-bold text-brand-orange uppercase tracking-widest">
                Total_Count: {projects.length.toString().padStart(3, '0')}
            </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-brand-darkBlue/10">
            {projects.map((project) => (
                <div 
                    key={project.id} 
                    onClick={() => onOpenProject(project.id)} 
                    className="group bg-white p-10 border-r border-b border-brand-darkBlue/10 hover:bg-brand-darkBlue transition-all duration-300 cursor-pointer flex flex-col h-[24rem] relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-10">
                        <div className="w-12 h-12 bg-[#F0F0F0] flex items-center justify-center border border-brand-darkBlue/10 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] group-hover:shadow-none">
                            {getIcon(project.pillar)}
                        </div>
                        <div className="text-[10px] font-mono font-bold text-brand-darkBlue/30 uppercase tracking-widest group-hover:text-white/40">
                            ID: {project.id.slice(0, 8)}
                        </div>
                    </div>
                    
                    <h3 className="font-serif font-bold text-brand-darkBlue text-3xl mb-4 line-clamp-2 leading-[1.1] group-hover:text-white transition-colors duration-300 uppercase">
                        {project.title}
                    </h3>
                    
                    <p className="text-sm text-brand-darkBlue/50 line-clamp-3 mb-8 flex-1 leading-relaxed font-medium group-hover:text-white/60">
                        {project.preview}
                    </p>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-brand-darkBlue/5 group-hover:border-white/10">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand-orange">
                                {getPillarLabel(project.pillar)}
                            </span>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand-darkBlue/30 group-hover:text-white/30">
                                Modified: {new Date(project.lastModified).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center bg-brand-orange text-white group-hover:bg-white group-hover:text-brand-darkBlue transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] group-hover:shadow-none translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                             <ArrowRight size={18} />
                        </div>
                    </div>
                </div>
            ))}
            
            {/* New Project Card */}
            <button 
                onClick={() => onNewProject()} 
                className="flex flex-col items-center justify-center p-10 bg-brand-darkBlue/5 border-r border-b border-brand-darkBlue/10 hover:bg-white transition-all duration-300 group h-[24rem]"
            >
                <div className="w-16 h-16 bg-white border-2 border-brand-darkBlue flex items-center justify-center mb-6 group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] group-hover:shadow-none">
                    <Plus size={32} className="text-brand-darkBlue group-hover:text-white transition-colors" />
                </div>
                <span className="font-serif font-bold text-2xl text-brand-darkBlue uppercase tracking-tight">New_Project</span>
                <span className="text-[10px] font-mono font-bold text-brand-darkBlue/40 mt-2 uppercase tracking-widest">Initialize_Session</span>
            </button>
        </div>
      </div>
    </div>
  );
};
