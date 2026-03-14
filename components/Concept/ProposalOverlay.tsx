
import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, CheckCircle2, Zap, Layout, MousePointer2, ZoomIn, Layers, Maximize2 } from 'lucide-react';

interface ProposalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalOverlay: React.FC<ProposalOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex justify-end bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-darkBlue text-white rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">UX Revamp Proposal</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Concept Generation Module</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-12">
          {/* 1. Node Anatomy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                <Layout size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">1. Node Anatomy & Hierarchy</h3>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <p className="text-slate-600 mb-4 leading-relaxed">
                The "Concept Node" is designed as a modular data container that balances density with clarity.
              </p>
              <ul className="space-y-3">
                {[
                  { title: "Semantic Header", desc: "Type-specific icons (Shield for Requirements, Cpu for Components) and status indicators (Validated, Conflict) provide instant visual context." },
                  { title: "Quick-Action Rail", desc: "A contextual hover menu allows users to edit the generating prompt, view high-fidelity renders, or expand to a full technical spec sheet without leaving the canvas." },
                  { title: "Visual Thumbnails", desc: "Integrated early-stage renders provide a physical reference point, bridging the gap between abstract requirements and hardware reality." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-1 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 text-sm">{item.title}: </span>
                      <span className="text-slate-500 text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 2. Text-to-Node Workflow */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
                <Zap size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">2. The Text-to-Node Workflow</h3>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                We propose a <strong>"Command-First"</strong> interaction model that treats the canvas as a living response to natural language.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Input Phase</div>
                  <p className="text-sm text-slate-600">User enters a high-level requirement (e.g., "Design a 6-axis robotic arm for 5kg payload").</p>
                </div>
                <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Manifestation</div>
                  <p className="text-sm text-slate-600">The AI parses the intent and spawns a <strong>Node Cluster</strong>—automatically connecting requirements to proposed subsystems.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Canvas Navigation */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
                <Layers size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">3. Canvas Navigation & Organization</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: <ZoomIn size={18} />, title: "Semantic Zooming", desc: "As users zoom out, individual nodes collapse into high-level 'Category Cards' (e.g., 'Power System'), maintaining structural overview without data noise." },
                { icon: <Layout size={18} />, title: "Auto-Layout Toggles", desc: "Switch between 'Functional Hierarchy' (logic-based tree) and 'Physical Proximity' (mapping nodes to their physical location in the hardware assembly)." },
                { icon: <Maximize2 size={18} />, title: "Collapsible Clusters", desc: "Users can group related nodes into 'Subsystem Folders' that hide complexity until explicitly clicked, allowing for massive scalability." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-sm h-fit">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Microcopy */}
          <section className="pb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                <MousePointer2 size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">4. Interface Tooltips & Empty State</h3>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Empty State Microcopy</div>
                  <p className="text-lg font-serif italic text-slate-300">
                    "Start mapping your hardware concept. Type a requirement like 'High-torque planetary gearbox' in the command bar to generate your first nodes."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tooltip: Connections</div>
                    <p className="text-xs text-slate-400">"Drag from the bottom handle of one node to the top handle of another to define dependencies."</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tooltip: Generation</div>
                    <p className="text-xs text-slate-400">"Select a node and type 'Add sub-components' to automatically expand your architecture."</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};
