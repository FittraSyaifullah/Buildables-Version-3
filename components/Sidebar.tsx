
import React, { useMemo } from 'react';
import { MessageSquarePlus, Clock, Settings, BookOpen, Database, Cpu, LayoutGrid, Package, X, FileText } from 'lucide-react';
import { Pillar, ProjectSummary } from '../types';

interface SidebarProps {
  onNewChat: () => void;
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
  activeView,
  onOpenDashboard,
  onOpenWorkspace,
  onOpenSettings,
  recentProjects,
  onOpenProject,
  isOpen = true,
  onToggle
}) => {
  
  const getViewButtonClass = (viewName: string) => {
      const isActive = activeView === viewName;
      return `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left transition-all font-sans font-medium ${
      isActive 
        ? 'bg-white/10 text-white shadow-sm border border-white/10' 
        : 'text-white/60 hover:bg-white/5 hover:text-white'
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

      <div className={`fixed md:relative w-72 bg-brand-darkBlue h-screen flex flex-col border-r border-brand-darkBlue/10 flex-shrink-0 z-50 transition-all duration-300 font-sans ${isOpen ? 'translate-x-0 md:ml-0' : '-translate-x-full md:-ml-72'}`}>
        <div className="p-8 pt-10">
          <div className="flex items-center justify-between mb-12 px-2">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={onOpenDashboard}>
                <div className="w-10 h-10 bg-white text-brand-darkBlue rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-brand-orange group-hover:text-white transition-all group-hover:rotate-3">
                    <span className="font-serif font-bold text-xl">B</span>
                </div>
                <div>
                    <span className="block font-serif font-bold text-white tracking-tight text-xl leading-none">Buildables</span>
                    <span className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.2em] mt-1 block">v3.0 Platform</span>
                </div>
            </div>
            <button onClick={onToggle} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>
          
          <button 
              onClick={() => { onNewChat(); onToggle?.(); }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-brand-orange text-white rounded-2xl shadow-float hover:bg-orange-500 hover:shadow-2xl hover:-translate-y-0.5 transition-all text-sm font-semibold mb-10 group"
          >
              <MessageSquarePlus size={18} className="text-white group-hover:scale-110 transition-transform" />
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
                onClick={() => { onOpenWorkspace(); onToggle?.(); }}
                className={getViewButtonClass('workspace')}
              >
                  <Database size={18} strokeWidth={1.5} /> Project Knowledge
              </button>
          </div>

        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
           <div className="flex items-center justify-between px-4 py-3 mt-4 sticky top-0 bg-brand-darkBlue z-10">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Recents</span>
           </div>
           
           <div className="space-y-6 mt-2 pb-8">
              {Object.entries(groupedProjects).map(([label, projects]: [string, ProjectSummary[]]) => (
                  projects.length > 0 && (
                      <div key={label}>
                          <div className="px-4 py-2 text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">{label}</div>
                          <div className="space-y-1">
                              {projects.map(project => (
                                  <button 
                                      key={project.id}
                                      onClick={() => onOpenProject(project.id)}
                                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-sm text-white/70 transition-all flex items-center gap-3 group relative"
                                  >
                                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm">
                                        {project.pillar === 'concept' && <Cpu size={14}/>}
                                        {project.pillar === 'sourcing' && <Database size={14}/>}
                                        {project.pillar === 'copilot' && <BookOpen size={14}/>}
                                     </div>
                                     <span className="truncate flex-1 font-medium group-hover:text-white transition-colors">{project.title}</span>
                                  </button>
                              ))}
                          </div>
                      </div>
                  )
              ))}
              {recentProjects.length === 0 && (
                  <div className="px-4 py-6 text-xs text-white/40 italic text-center font-light">
                      No recent projects found.
                  </div>
              )}
           </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-brand-darkBlue flex flex-col gap-2">
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
          <button onClick={onOpenSettings} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/10 text-sm text-white transition-all group shadow-sm hover:shadow-md border border-transparent hover:border-white/20">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center text-xs font-bold group-hover:bg-brand-orange group-hover:text-white transition-all shadow-sm">JD</div>
              <div className="flex-1 text-left overflow-hidden">
                  <div className="font-bold text-white truncate">John Doe</div>
                  <div className="text-[10px] font-bold text-brand-orange uppercase tracking-wider truncate">Pro Plan</div>
              </div>
              <Settings size={18} className="text-white/50 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </>
  );
};
