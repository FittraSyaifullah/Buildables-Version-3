
import React from 'react';
import { ProjectSummary, Pillar } from '../types';
import { Clock, Cpu, Database, BookOpen, ArrowRight, Plus } from 'lucide-react';

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
      switch(pillar) {
        case 'concept': return 'Concept Formation';
        case 'sourcing': return 'Sourcing & BOM';
        case 'copilot': return 'Engineering Copilot';
    }
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-brand-lightBlue/30 p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
            <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-serif font-semibold text-brand-darkBlue tracking-tight leading-none mb-6">
                    Engineering <span className="italic text-brand-blue font-light">Workspace</span>
                </h1>
                <p className="text-gray-500 font-light text-lg md:text-xl leading-relaxed max-w-xl">
                    Your intelligent copilot for mechanical design. Generate concepts, source components, and verify specifications.
                </p>
            </div>
            {/* Quick Create Actions */}
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                <button 
                    onClick={() => onNewProject()} 
                    className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3.5 bg-brand-darkBlue text-white rounded-xl text-sm font-semibold hover:bg-brand-blue hover:shadow-float hover:-translate-y-0.5 transition-all shadow-sm"
                >
                    <Plus size={18} className="text-white" /> New Project
                </button>
            </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center gap-4 mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-darkBlue/40">Recent Activity</span>
            <div className="h-px flex-1 bg-brand-darkBlue/5"></div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Project Card */}
            <button 
                onClick={() => onNewProject()} 
                className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-brand-darkBlue/10 rounded-2xl hover:border-brand-blue hover:bg-brand-blue/5 transition-all duration-300 group h-72 shadow-sm hover:shadow-float relative overflow-hidden"
            >
                <div className="w-16 h-16 bg-brand-gray rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white transition-all duration-300 shadow-sm border border-brand-darkBlue/5">
                    <Plus size={28} className="text-brand-blue" strokeWidth={2} />
                </div>
                <span className="font-sans font-semibold text-lg text-brand-darkBlue relative z-10">Start New Project</span>
                <span className="text-sm text-gray-400 mt-2 relative z-10 font-light">Launch a new engineering session</span>
            </button>

            {projects.map((project) => (
                <div 
                    key={project.id} 
                    onClick={() => onOpenProject(project.id)} 
                    className="bg-white p-8 rounded-2xl border border-brand-darkBlue/5 shadow-sm hover:shadow-float hover:border-brand-darkBlue/10 transition-all duration-300 cursor-pointer flex flex-col h-72 group relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-xl bg-brand-gray group-hover:bg-brand-blue/10 border border-brand-darkBlue/5 transition-colors duration-300">
                            {getIcon(project.pillar)}
                        </div>
                        <span className="text-[10px] font-mono font-medium text-gray-400 flex items-center gap-1.5 bg-brand-gray px-3 py-1.5 rounded-lg uppercase tracking-wider">
                            <Clock size={12} />
                            {new Date(project.lastModified).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    <h3 className="font-serif font-semibold text-brand-darkBlue text-2xl mb-3 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors duration-300">
                        {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1 leading-relaxed font-light">
                        {project.preview}
                    </p>
                    <div className="flex justify-between items-center pt-5 border-t border-brand-darkBlue/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-brand-darkBlue/60 transition-colors">
                            {getPillarLabel(project.pillar)}
                        </span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-gray group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                             <ArrowRight size={14} className="text-brand-darkBlue group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
