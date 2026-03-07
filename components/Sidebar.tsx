
import React, { useMemo } from 'react';
import { MessageSquarePlus, Clock, Settings, BookOpen, Database, Cpu, LayoutGrid, Package, X, FileText } from 'lucide-react';
import { Pillar, ProjectSummary } from '../types';

interface SidebarProps {
  onNewChat: () => void;
  activePillar: Pillar;
  onPillarChange: (pillar: Pillar) => void;
  activeView: 'chat' | 'dashboard' | 'library' | 'saved-boms' | 'documents';
  onOpenDashboard: () => void;
  onOpenLibrary: () => void;
  onOpenSavedBoms: () => void;
  onOpenDocumentCenter: () => void;
  onOpenSettings: () => void;
  recentProjects: ProjectSummary[];
  onOpenProject: (id: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  activePillar, 
  onPillarChange,
  activeView,
  onOpenDashboard,
  onOpenLibrary,
  onOpenSavedBoms,
  onOpenDocumentCenter,
  onOpenSettings,
  recentProjects,
  onOpenProject,
  isOpen = true,
  onToggle
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}

      <div className={`fixed md:relative w-72 bg-white h-screen flex flex-col border-r border-brand-blue/10 flex-shrink-0 z-50 transition-transform duration-300 font-sans ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 pt-10">
          <div className="flex items-center justify-between mb-12 px-2">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={onOpenDashboard}>
                <div className="w-10 h-10 bg-brand-darkBlue text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-brand-blue transition-all group-hover:rotate-3">
                    <span className="font-serif font-bold text-xl">B</span>
                </div>
                <div>
                    <span className="block font-serif font-bold text-brand-darkBlue tracking-tight text-xl leading-none">Buildables</span>
                    <span className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.2em] mt-1 block">v3.0 Platform</span>
                </div>
            </div>
            <button onClick={onToggle} className="md:hidden p-2 text-brand-darkBlue/30 hover:text-brand-darkBlue hover:bg-brand-lightBlue rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>
          
          <button 
              onClick={() => { onNewChat(); onToggle?.(); }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-brand-darkBlue text-white rounded-2xl shadow-xl hover:bg-brand-blue hover:shadow-2xl hover:-translate-y-0.5 transition-all text-sm font-semibold mb-10 group"
          >
              <MessageSquarePlus size={18} className="text-brand-orange group-hover:scale-110 transition-transform" />
              <span>New Project</span>
          </button>
  
          <div className="space-y-1.5 mb-10">
              <button 
                onClick={() => { onOpenDashboard(); onToggle?.(); }}
                className={getViewButtonClass('dashboard')}
              >
                  <LayoutGrid size={18} strokeWidth={1.5} /> Dashboard
              </button>
              <button 
                onClick={() => { onOpenLibrary(); onToggle?.(); }}
                className={getViewButtonClass('library')}
              >
                  <Package size={18} strokeWidth={1.5} /> Parts Library
              </button>
              <button 
                onClick={() => { onOpenSavedBoms(); onToggle?.(); }}
                className={getViewButtonClass('saved-boms')}
              >
                  <Database size={18} strokeWidth={1.5} /> Saved BOMs
              </button>
              <button 
                onClick={() => { onOpenDocumentCenter(); onToggle?.(); }}
                className={getViewButtonClass('documents')}
              >
                  <FileText size={18} strokeWidth={1.5} /> Document Center
              </button>
          </div>

          <div className="space-y-2">
              <div className="px-4 py-2 text-[10px] font-bold text-brand-darkBlue/30 uppercase tracking-[0.2em]">Modes</div>
              <button 
                onClick={() => onPillarChange('concept')}
                className={getButtonClass('concept')}
              >
                  <Cpu size={18} strokeWidth={1.5} /> Concept Formation
              </button>
              <button 
                onClick={() => onPillarChange('sourcing')}
                className={getButtonClass('sourcing')}
              >
                  <Database size={18} strokeWidth={1.5} /> Sourcing & BOM
              </button>
              <button 
                onClick={() => onPillarChange('copilot')}
                className={getButtonClass('copilot')}
              >
                  <BookOpen size={18} strokeWidth={1.5} /> Engineering Copilot
              </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
           <div className="flex items-center justify-between px-4 py-3 mt-4 sticky top-0 bg-white z-10">
              <span className="text-[10px] font-bold text-brand-darkBlue/30 uppercase tracking-[0.2em]">Recents</span>
           </div>
           
           <div className="space-y-6 mt-2 pb-8">
              {Object.entries(groupedProjects).map(([label, projects]: [string, ProjectSummary[]]) => (
                  projects.length > 0 && (
                      <div key={label}>
                          <div className="px-4 py-2 text-[10px] font-bold text-brand-blue/40 mb-2 uppercase tracking-wider">{label}</div>
                          <div className="space-y-1">
                              {projects.map(project => (
                                  <button 
                                      key={project.id}
                                      onClick={() => onOpenProject(project.id)}
                                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-brand-lightBlue/50 text-sm text-brand-darkBlue/70 transition-all flex items-center gap-3 group relative"
                                  >
                                     <div className="w-8 h-8 rounded-xl bg-brand-gray flex items-center justify-center text-brand-blue/50 group-hover:bg-white group-hover:text-brand-blue transition-all shadow-sm">
                                        {project.pillar === 'concept' && <Cpu size={14}/>}
                                        {project.pillar === 'sourcing' && <Database size={14}/>}
                                        {project.pillar === 'copilot' && <BookOpen size={14}/>}
                                     </div>
                                     <span className="truncate flex-1 font-medium group-hover:text-brand-darkBlue">{project.title}</span>
                                  </button>
                              ))}
                          </div>
                      </div>
                  )
              ))}
              {recentProjects.length === 0 && (
                  <div className="px-4 py-6 text-xs text-brand-darkBlue/30 italic text-center font-light">
                      No recent projects found.
                  </div>
              )}
           </div>
        </div>

        <div className="p-6 border-t border-brand-blue/5 bg-brand-gray/30">
          <button onClick={onOpenSettings} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white text-sm text-brand-darkBlue/80 transition-all group shadow-sm hover:shadow-md border border-transparent hover:border-brand-blue/10">
              <div className="w-10 h-10 rounded-2xl bg-brand-darkBlue text-white flex items-center justify-center text-xs font-bold group-hover:bg-brand-blue transition-all shadow-sm">JD</div>
              <div className="flex-1 text-left overflow-hidden">
                  <div className="font-bold text-brand-darkBlue truncate">John Doe</div>
                  <div className="text-[10px] font-bold text-brand-blue uppercase tracking-wider truncate">Pro Plan</div>
              </div>
              <Settings size={18} className="text-brand-darkBlue/20 group-hover:text-brand-blue transition-colors" />
          </button>
        </div>
      </div>
    </>
  );
};
