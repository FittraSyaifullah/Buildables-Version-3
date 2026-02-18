
import React, { useMemo } from 'react';
import { MessageSquarePlus, Clock, Settings, BookOpen, Database, Cpu, LayoutGrid, Package } from 'lucide-react';
import { Pillar, ProjectSummary } from '../types';

interface SidebarProps {
  onNewChat: () => void;
  activePillar: Pillar;
  onPillarChange: (pillar: Pillar) => void;
  activeView: 'chat' | 'dashboard' | 'library';
  onOpenDashboard: () => void;
  onOpenLibrary: () => void;
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
  onOpenLibrary,
  onOpenSettings,
  recentProjects,
  onOpenProject
}) => {
  
  const getButtonClass = (pillar: Pillar) => {
    const isActive = activePillar === pillar && activeView === 'chat';
    return `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all font-medium ${
      isActive 
        ? 'bg-white text-brand-darkBlue shadow-sm border border-brand-blue/20' 
        : 'text-brand-darkBlue/70 hover:bg-white/50 hover:text-brand-darkBlue'
    }`;
  };

  const getViewButtonClass = (viewName: string) => {
      const isActive = activeView === viewName;
      return `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all font-medium ${
      isActive 
        ? 'bg-white text-brand-darkBlue shadow-sm border border-brand-blue/20' 
        : 'text-brand-darkBlue/70 hover:bg-white/50 hover:text-brand-darkBlue'
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
    <div className="w-64 bg-brand-lightBlue h-screen flex flex-col border-r border-brand-blue/10 flex-shrink-0 hidden md:flex font-sans">
      <div className="p-4 pt-6">
        <div className="flex items-center gap-3 mb-8 px-2 cursor-pointer group" onClick={onOpenDashboard}>
            <div className="w-8 h-8 bg-brand-blue text-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="font-serif font-bold text-lg">B</span>
            </div>
            <span className="font-serif font-bold text-brand-darkBlue tracking-tight text-lg group-hover:text-brand-blue transition-colors">Buildables</span>
        </div>
        
        <button 
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-darkBlue text-white rounded-lg shadow-md hover:bg-brand-blue hover:shadow-lg transition-all text-sm font-medium mb-8 group"
        >
            <MessageSquarePlus size={16} className="text-brand-orange group-hover:scale-110 transition-transform" />
            <span>New Project</span>
        </button>

        <div className="space-y-1 mb-6">
            <button 
              onClick={onOpenDashboard}
              className={getViewButtonClass('dashboard')}
            >
                <LayoutGrid size={16} /> Dashboard
            </button>
            <button 
              onClick={onOpenLibrary}
              className={getViewButtonClass('library')}
            >
                <Package size={16} /> Parts Library
            </button>
        </div>

        <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-brand-darkBlue/50 uppercase tracking-wider">Modes</div>
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
         <div className="flex items-center justify-between px-3 py-2 mt-2 sticky top-0 bg-brand-lightBlue z-10">
            <span className="text-[10px] font-bold text-brand-darkBlue/50 uppercase tracking-wider">Recents</span>
         </div>
         
         <div className="space-y-4 mt-1 pb-4">
            {Object.entries(groupedProjects).map(([label, projects]: [string, ProjectSummary[]]) => (
                projects.length > 0 && (
                    <div key={label}>
                        <div className="px-3 py-1 text-[10px] font-medium text-brand-darkBlue/40 mb-1">{label}</div>
                        <div className="space-y-0.5">
                            {projects.map(project => (
                                <button 
                                    key={project.id}
                                    onClick={() => onOpenProject(project.id)}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/60 hover:shadow-sm text-sm text-brand-darkBlue/80 transition-all flex items-center gap-2 group relative"
                                >
                                   <span className="text-brand-blue/70 group-hover:text-brand-blue transition-colors flex-shrink-0">
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
                <div className="px-3 py-4 text-xs text-brand-darkBlue/40 italic text-center">
                    No recent projects.
                </div>
            )}
         </div>
      </div>

      <div className="p-4 border-t border-brand-blue/10">
        <button onClick={onOpenSettings} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/60 text-sm text-brand-darkBlue/80 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-brand-darkBlue text-white flex items-center justify-center text-xs group-hover:bg-brand-blue transition-colors shadow-sm">JD</div>
            <div className="flex-1 text-left overflow-hidden">
                <div className="font-medium text-brand-darkBlue truncate">John Doe</div>
                <div className="text-[10px] text-brand-darkBlue/60 truncate">Pro Plan</div>
            </div>
            <Settings size={16} className="text-brand-darkBlue/40 group-hover:text-brand-blue" />
        </button>
      </div>
    </div>
  );
};
