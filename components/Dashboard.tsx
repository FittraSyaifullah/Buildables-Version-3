
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
        case 'concept': return <Cpu size={20} className="text-purple-400"/>;
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
    <div className="flex-1 h-full overflow-y-auto bg-brand-gray p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h1 className="text-3xl font-serif font-medium text-brand-darkBlue">Dashboard</h1>
                <p className="text-gray-500 mt-2 font-light text-lg">Welcome back. Pick up where you left off.</p>
            </div>
            {/* Quick Create Actions */}
            <div className="flex gap-2">
                <button onClick={() => onNewProject('concept')} className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-blue/20 rounded-lg text-sm font-medium text-brand-darkBlue/70 hover:border-purple-300 hover:text-purple-600 hover:shadow-sm transition-all shadow-sm">
                    <Cpu size={16} /> New Concept
                </button>
                 <button onClick={() => onNewProject('sourcing')} className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-blue/20 rounded-lg text-sm font-medium text-brand-darkBlue/70 hover:border-brand-blue hover:text-brand-blue hover:shadow-sm transition-all shadow-sm">
                    <Database size={16} /> New BOM
                </button>
            </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Project Card */}
            <button onClick={() => onNewProject('copilot')} className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-brand-blue/30 rounded-xl hover:border-brand-blue hover:bg-brand-lightBlue/30 transition-all group h-64 shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-brand-lightBlue/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all">
                    <Plus size={24} className="text-brand-blue/70 group-hover:text-white" />
                </div>
                <span className="font-serif font-medium text-lg text-brand-darkBlue">Start New Project</span>
                <span className="text-xs text-brand-darkBlue/50 mt-1">Chat, Sourcing, or Concept</span>
            </button>

            {projects.map((project) => (
                <div key={project.id} onClick={() => onOpenProject(project.id)} className="bg-white p-6 rounded-xl border border-brand-blue/10 shadow-sm hover:shadow-lg hover:border-brand-blue/30 transition-all cursor-pointer flex flex-col h-64 group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-brand-lightBlue/30 group-hover:bg-brand-lightBlue border border-brand-blue/5 group-hover:shadow-sm transition-all">
                            {getIcon(project.pillar)}
                        </div>
                        <span className="text-xs font-mono text-gray-400 flex items-center gap-1 bg-brand-gray px-2 py-1 rounded">
                            <Clock size={12} />
                            {new Date(project.lastModified).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className="font-serif font-medium text-brand-darkBlue text-xl mb-3 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1 leading-relaxed">
                        {project.preview}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-600 transition-colors">
                            {getPillarLabel(project.pillar)}
                        </span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-brand-blue group-hover:text-white transition-all">
                             <ArrowRight size={14} className="text-gray-400 group-hover:text-white" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
