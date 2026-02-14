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
        case 'concept': return <Cpu size={20} className="text-purple-600"/>;
        case 'sourcing': return <Database size={20} className="text-green-600"/>;
        case 'copilot': return <BookOpen size={20} className="text-blue-600"/>;
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
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold text-brand-darkBlue">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back. Pick up where you left off.</p>
            </div>
            {/* Quick Create Actions */}
            <div className="flex gap-2">
                <button onClick={() => onNewProject('concept')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:shadow-sm transition-all">
                    <Cpu size={16} /> New Concept
                </button>
                 <button onClick={() => onNewProject('sourcing')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-green-300 hover:text-green-700 hover:shadow-sm transition-all">
                    <Database size={16} /> New BOM
                </button>
            </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Project Card */}
            <button onClick={() => onNewProject('copilot')} className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-brand-blue hover:bg-brand-lightBlue/10 transition-all group h-64">
                <div className="w-12 h-12 bg-brand-lightBlue rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus size={24} className="text-brand-blue" />
                </div>
                <span className="font-medium text-brand-darkBlue">Start New Project</span>
                <span className="text-xs text-gray-400 mt-1">Chat, Sourcing, or Concept</span>
            </button>

            {projects.map((project) => (
                <div key={project.id} onClick={() => onOpenProject(project.id)} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-blue/30 transition-all cursor-pointer flex flex-col h-64 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent group-hover:bg-brand-blue transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white border border-gray-100 group-hover:shadow-sm transition-all">
                            {getIcon(project.pillar)}
                        </div>
                        <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(project.lastModified).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className="font-bold text-brand-darkBlue text-lg mb-2 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                        {project.preview}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-400 group-hover:text-gray-600 transition-colors">
                            {getPillarLabel(project.pillar)}
                        </span>
                        <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-blue transform translate-x-0 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}