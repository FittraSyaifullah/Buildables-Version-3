
import React from 'react';
import { ProjectSummary, Pillar } from '../types';
import { Clock, Cpu, Database, BookOpen, ArrowRight, Plus } from 'lucide-react';

interface DashboardProps {
  projects: ProjectSummary[];
  onOpenProject: (id: string) => void;
  onNewProject: (pillar: Pillar) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, onOpenProject, onNewProject }) => {
  const getIcon = (pillar: Pillar) => {
    switch(pillar) {
        case 'concept': return <Cpu size={20} className="text-brand-blue"/>;
        case 'sourcing': return <Database size={20} className="text-brand-blue"/>;
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
    <div className="flex-1 h-full overflow-y-auto bg-brand-gray p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
            <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-serif font-light text-brand-darkBlue tracking-tight leading-none mb-4">
                    Engineering <span className="italic text-brand-blue">Workspace</span>
                </h1>
                <p className="text-gray-500 font-light text-lg md:text-xl leading-relaxed">
                    Welcome back. Your hardware projects are synchronized and ready for the next iteration.
                </p>
            </div>
            {/* Quick Create Actions */}
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                <button 
                    onClick={() => onNewProject('concept')} 
                    className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3 bg-white border border-brand-blue/20 rounded-2xl text-sm font-semibold text-brand-darkBlue/80 hover:border-brand-blue hover:text-brand-blue hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-sm"
                >
                    <Cpu size={18} className="text-brand-blue" /> New Concept
                </button>
                 <button 
                    onClick={() => onNewProject('sourcing')} 
                    className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3 bg-white border border-brand-blue/20 rounded-2xl text-sm font-semibold text-brand-darkBlue/80 hover:border-brand-orange hover:text-brand-orange hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-sm"
                >
                    <Database size={18} className="text-brand-orange" /> New BOM
                </button>
            </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-darkBlue/40">Recent Activity</span>
            <div className="h-px flex-1 bg-brand-blue/10"></div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* New Project Card */}
            <button 
                onClick={() => onNewProject('copilot')} 
                className="flex flex-col items-center justify-center p-8 bg-brand-lightBlue/20 border-2 border-dashed border-brand-blue/20 rounded-3xl hover:border-brand-blue hover:bg-white transition-all group h-72 shadow-sm hover:shadow-2xl relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-sm border border-brand-blue/10">
                    <Plus size={32} className="text-brand-blue" strokeWidth={1.5} />
                </div>
                <span className="font-serif font-medium text-xl text-brand-darkBlue relative z-10">Start New Project</span>
                <span className="text-sm text-brand-darkBlue/40 mt-2 relative z-10">Launch a new engineering session</span>
            </button>

            {projects.map((project) => (
                <div 
                    key={project.id} 
                    onClick={() => onOpenProject(project.id)} 
                    className="bg-white p-8 rounded-3xl border border-brand-blue/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-brand-blue/20 transition-all cursor-pointer flex flex-col h-72 group relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-brand-lightBlue/30 group-hover:bg-brand-lightBlue border border-brand-blue/5 group-hover:shadow-sm transition-all">
                            {getIcon(project.pillar)}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-gray-400 flex items-center gap-1.5 bg-brand-gray px-3 py-1.5 rounded-full uppercase tracking-wider">
                            <Clock size={12} />
                            {new Date(project.lastModified).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    <h3 className="font-serif font-medium text-brand-darkBlue text-2xl mb-4 line-clamp-2 leading-[1.1] group-hover:text-brand-blue transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1 leading-relaxed font-light">
                        {project.preview}
                    </p>
                    <div className="flex justify-between items-center pt-6 border-t border-brand-blue/5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-darkBlue/30 group-hover:text-brand-darkBlue/60 transition-colors">
                            {getPillarLabel(project.pillar)}
                        </span>
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-brand-lightBlue/50 group-hover:bg-brand-blue group-hover:text-white transition-all group-hover:translate-x-1">
                             <ArrowRight size={18} className="text-brand-blue group-hover:text-white" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
