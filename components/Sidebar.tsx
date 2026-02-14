import React, { useMemo } from 'react';
import { MessageSquarePlus, Clock, Settings, BookOpen, Database, Cpu, LayoutGrid, MoreHorizontal, Trash2, Archive } from 'lucide-react';
import { Pillar, ProjectSummary } from '../types';

interface SidebarProps {
  onNewChat: () => void;
  activePillar: Pillar;
  onPillarChange: (pillar: Pillar) => void;
  activeView: 'chat' | 'dashboard';
  onOpenDashboard: () => void;
  onOpenSettings: () => void;
  recentProjects: ProjectSummary[];
  onOpenProject: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  activePillar, 
  onPillarChange,
  activeView,
  onOpenDashboard,
  onOpenSettings,
  recentProjects,
  onOpenProject
}) => {
  
  const getButtonClass = (pillar: Pillar) => {
    const isActive = activePillar === pillar && activeView === 'chat';
    return `w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left transition-colors font-medium ${
      isActive 
        ? 'bg-brand-lightBlue text-brand-blue' 
        : 'text-gray-600 hover:bg-gray-200'
    }`;
  };

  // Group projects by date
  const groupedProjects = useMemo(() => {
    const groups: { [key: string]: ProjectSummary[] } = {
        'Today': [],
        'Yesterday': [],
        'Previous 7 Days': [],
        'Older': []
    };

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    recentProjects.forEach(p => {
        const d = new Date(p.lastModified);
        // Reset times for date comparison
        const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const tDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const yDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

        if (dDate.getTime() === tDate.getTime()) {
            groups['Today'].push(p);
        } else if (dDate.getTime() === yDate.getTime()) {
            groups['Yesterday'].push(p);
        } else if (d > lastWeek) {
            groups['Previous 7 Days'].push(p);
        } else {
            groups['Older'].push(p);
        }
    });

    return groups;
  }, [recentProjects]);

  return (
    <div className="w-64 bg-brand-gray h-screen flex flex-col border-r border-gray-200 flex-shrink-0 hidden md:flex font-sans">
      <div className="p-4 pt-6">
        <div className="flex items-center gap-2 mb-8 px-2 cursor-pointer group" onClick={onOpenDashboard}>
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                <span className="text-white font-sans font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-brand-darkBlue tracking-tight group-hover:text-brand-blue transition-colors">Buildables</span>
        </div>
        
        <button 
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-brand-blue hover:text-brand-blue transition-all text-sm font-medium text-gray-700 mb-6 group"
        >
            <MessageSquarePlus size={18} className="text-brand-orange group-hover:scale-110 transition-transform" />
            New Project
        </button>

        <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Modes</div>
            <button 
              onClick={() => onPillarChange('concept')}
              className={getButtonClass('concept')}
            >
                <Cpu size={16} /> Concept Formation
            </button>
            <button 
              onClick={() => onPillarChange('sourcing')}
              className={getButtonClass('sourcing')}
            >
                <Database size={16} /> Sourcing & BOM
            </button>
            <button 
              onClick={() => onPillarChange('copilot')}
              className={getButtonClass('copilot')}
            >
                <BookOpen size={16} /> Engineering Copilot
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
         <div className="flex items-center justify-between px-3 py-2 mt-4 sticky top-0 bg-brand-gray z-10">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recents</span>
            <button onClick={onOpenDashboard} className="text-xs text-brand-blue hover:underline" title="View All">View All</button>
         </div>
         
         <div className="space-y-4 mt-1 pb-4">
            {Object.entries(groupedProjects).map(([label, projects]: [string, ProjectSummary[]]) => (
                projects.length > 0 && (
                    <div key={label}>
                        <div className="px-3 py-1 text-[10px] font-bold text-gray-400/80 uppercase tracking-wider mb-1">{label}</div>
                        <div className="space-y-0.5">
                            {projects.map(project => (
                                <button 
                                    key={project.id}
                                    onClick={() => onOpenProject(project.id)}
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 text-sm text-gray-600 transition-colors flex items-center gap-2 group relative"
                                >
                                   <span className="text-gray-400 group-hover:text-brand-darkBlue transition-colors flex-shrink-0">
                                      {project.pillar === 'concept' && <Cpu size={14}/>}
                                      {project.pillar === 'sourcing' && <Database size={14}/>}
                                      {project.pillar === 'copilot' && <BookOpen size={14}/>}
                                   </span>
                                   <span className="truncate flex-1 font-medium group-hover:text-brand-darkBlue">{project.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )
            ))}
            {recentProjects.length === 0 && (
                <div className="px-3 py-4 text-xs text-gray-400 italic text-center">
                    No recent projects.
                </div>
            )}
         </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button onClick={onOpenSettings} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 text-sm text-gray-700 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-brand-darkBlue text-white flex items-center justify-center text-xs group-hover:bg-brand-blue transition-colors ring-2 ring-white shadow-sm">JD</div>
            <div className="flex-1 text-left overflow-hidden">
                <div className="font-medium text-brand-darkBlue truncate">John Doe</div>
                <div className="text-[10px] text-gray-500 truncate">Pro Plan</div>
            </div>
            <Settings size={16} className="text-gray-400 group-hover:text-brand-blue" />
        </button>
      </div>
    </div>
  );
};