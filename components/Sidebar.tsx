
import React, { useMemo } from 'react';
import { MessageSquarePlus, Clock, Settings, BookOpen, Database, Cpu, LayoutGrid, Package, X, FileText } from 'lucide-react';
import { Pillar, ProjectSummary } from '../types';

interface SidebarProps {
  onNewChat: () => void;
  activePillar: Pillar;
  onPillarChange: (pillar: Pillar) => void;
  activeView: 'chat' | 'dashboard' | 'workspace';
  onOpenDashboard: () => void;
  onOpenWorkspace: () => void;
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
  onOpenWorkspace,
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
        ? 'bg-white/20 text-white shadow-sm border border-white/40' 
        : 'text-white hover:bg-white/10'
    } ${!isOpen ? 'justify-center px-0' : ''}`;
  };

  const getViewButtonClass = (viewName: string) => {
      const isActive = activeView === viewName;
      return `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all font-medium ${
      isActive 
        ? 'bg-white/20 text-white shadow-sm border border-white/40' 
        : 'text-white hover:bg-white/10'
    } ${!isOpen ? 'justify-center px-0' : ''}`;
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

      <div className={`fixed md:relative bg-brand-darkBlue h-screen flex flex-col border-r border-brand-darkBlue/10 flex-shrink-0 z-50 transition-all duration-300 font-sans ${isOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}`}>
        <div className={`p-8 pt-10 ${!isOpen ? 'px-4' : ''}`}>
          <div className={`flex items-center mb-12 ${isOpen ? 'justify-between px-2' : 'justify-center'}`}>
            <div className="flex items-center gap-4 cursor-pointer group" onClick={onOpenDashboard}>
                <div className="w-10 h-10 bg-white text-brand-darkBlue rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-brand-orange group-hover:text-white transition-all group-hover:rotate-3 flex-shrink-0">
                    <span className="font-serif font-bold text-xl">B</span>
                </div>
                {isOpen && (
                  <div>
                      <span className="block font-serif font-bold text-white tracking-tight text-xl leading-none">Buildables</span>
                      <span className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.2em] mt-1 block">v3.0 Platform</span>
                  </div>
                )}
            </div>
            {isOpen && (
              <button onClick={onToggle} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <X size={20} />
              </button>
            )}
          </div>
          
          <button 
              onClick={() => { onNewChat(); }}
              className={`w-full flex items-center justify-center gap-3 bg-brand-orange text-white rounded-2xl shadow-xl hover:bg-orange-400 hover:shadow-2xl hover:-translate-y-0.5 transition-all text-sm font-bold mb-10 group ${isOpen ? 'px-6 py-4' : 'p-3 aspect-square'}`}
          >
              <MessageSquarePlus size={18} className="text-white group-hover:scale-110 transition-transform flex-shrink-0" />
              {isOpen && <span>New Project</span>}
          </button>
  
          <div className="space-y-1.5 mb-10">
              <button 
                onClick={() => { onOpenDashboard(); }}
                className={getViewButtonClass('dashboard')}
                title="Dashboard"
              >
                  <LayoutGrid size={18} strokeWidth={1.5} className="flex-shrink-0" /> {isOpen && "Dashboard"}
              </button>
              <button 
                onClick={() => { onOpenWorkspace(); }}
                className={getViewButtonClass('workspace')}
                title="Project Knowledge"
              >
                  <Database size={18} strokeWidth={1.5} className="flex-shrink-0" /> {isOpen && "Project Knowledge"}
              </button>
          </div>

          <div className="space-y-2">
              {isOpen && <div className="px-4 py-2 text-[10px] font-bold text-white uppercase tracking-[0.2em]">Modes</div>}
              <button 
                onClick={() => onPillarChange('concept')}
                className={getButtonClass('concept')}
                title="Concept Formation"
              >
                  <Cpu size={18} strokeWidth={1.5} className="flex-shrink-0" /> {isOpen && "Concept Formation"}
              </button>
              <button 
                onClick={() => onPillarChange('sourcing')}
                className={getButtonClass('sourcing')}
                title="Sourcing & BOM"
              >
                  <Database size={18} strokeWidth={1.5} className="flex-shrink-0" /> {isOpen && "Sourcing & BOM"}
              </button>
              <button 
                onClick={() => onPillarChange('copilot')}
                className={getButtonClass('copilot')}
                title="Engineering Copilot"
              >
                  <BookOpen size={18} strokeWidth={1.5} className="flex-shrink-0" /> {isOpen && "Engineering Copilot"}
              </button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto py-4 custom-scrollbar ${isOpen ? 'px-6' : 'px-2'}`}>
           {isOpen && (
             <div className="flex items-center justify-between px-4 py-3 mt-4 sticky top-0 bg-brand-darkBlue z-10">
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Recents</span>
             </div>
           )}
           
           <div className={`space-y-6 mt-2 pb-8 ${!isOpen ? 'flex flex-col items-center' : ''}`}>
              {Object.entries(groupedProjects).map(([label, projects]: [string, ProjectSummary[]]) => (
                  projects.length > 0 && (
                      <div key={label} className={!isOpen ? 'w-full' : ''}>
                          {isOpen && <div className="px-4 py-2 text-[10px] font-bold text-white/70 mb-2 uppercase tracking-wider">{label}</div>}
                          <div className={`space-y-1 ${!isOpen ? 'flex flex-col items-center gap-2' : ''}`}>
                              {projects.map(project => (
                                  <button 
                                      key={project.id}
                                      onClick={() => onOpenProject(project.id)}
                                      className={`text-left rounded-2xl hover:bg-white/10 text-sm text-white/80 transition-all flex items-center gap-3 group relative ${isOpen ? 'w-full px-4 py-3' : 'p-2 justify-center'}`}
                                      title={!isOpen ? project.title : undefined}
                                  >
                                     <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/70 group-hover:bg-brand-orange group-hover:text-white transition-all shadow-sm flex-shrink-0">
                                        {project.pillar === 'concept' && <Cpu size={14}/>}
                                        {project.pillar === 'sourcing' && <Database size={14}/>}
                                        {project.pillar === 'copilot' && <BookOpen size={14}/>}
                                     </div>
                                     {isOpen && <span className="truncate flex-1 font-medium group-hover:text-white">{project.title}</span>}
                                  </button>
                              ))}
                          </div>
                      </div>
                  )
              ))}
              {recentProjects.length === 0 && isOpen && (
                  <div className="px-4 py-6 text-xs text-white/50 italic text-center font-light">
                      No recent projects found.
                  </div>
              )}
           </div>
        </div>

        <div className={`p-6 border-t border-white/10 bg-brand-darkBlue flex flex-col gap-2 ${!isOpen ? 'px-2 items-center' : ''}`}>
          {isOpen && (
            <button 
              onClick={async () => {
                try {
                  const res = await fetch('/api/send-activation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'fittrasyaifullah64@gmail.com' })
                  });
                  if (res.ok) alert('Activation email sent!');
                  else alert('Failed to send email');
                } catch (e) {
                  alert('Error sending email');
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm"
            >
              Activate Account
            </button>
          )}
          <button onClick={onOpenSettings} className={`flex items-center gap-4 rounded-2xl hover:bg-white/10 text-sm text-white transition-all group shadow-sm hover:shadow-md border border-transparent hover:border-white/20 ${isOpen ? 'w-full px-4 py-3' : 'p-2 justify-center'}`} title={!isOpen ? "Settings" : undefined}>
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center text-xs font-bold group-hover:bg-brand-orange group-hover:text-white transition-all shadow-sm flex-shrink-0">JD</div>
              {isOpen && (
                <div className="flex-1 text-left overflow-hidden">
                    <div className="font-bold text-white truncate">John Doe</div>
                    <div className="text-[10px] font-bold text-brand-orange uppercase tracking-wider truncate">Pro Plan</div>
                </div>
              )}
              {isOpen && <Settings size={18} className="text-white/50 group-hover:text-white transition-colors flex-shrink-0" />}
          </button>
        </div>
      </div>
    </>
  );
};
