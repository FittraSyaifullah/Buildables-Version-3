import React from 'react';
import { AlertTriangle, PlusCircle, ArrowRight, X } from 'lucide-react';
import { CanvasLintResult } from '../../types';

interface LintOverlayProps {
  results: CanvasLintResult;
  onClose: () => void;
  onApplySuggestion: (suggestion: any) => void;
}

export const LintOverlay: React.FC<LintOverlayProps> = ({ results, onClose, onApplySuggestion }) => {
  if (results.status === 'valid') return null;

  return (
    <div className="absolute top-4 left-4 z-[100] w-80 bg-white/95 backdrop-blur-md border border-red-200 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-left-4 duration-300">
      <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
          <AlertTriangle size={18} />
          <span>Design Conflicts Detected</span>
        </div>
        <button onClick={onClose} className="text-red-400 hover:text-red-600 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Red Wires (Conflicts) */}
        {results.red_wires && results.red_wires.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Critical Conflicts</h3>
            {results.red_wires.map((wire, idx) => (
              <div key={idx} className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-red-500">
                  <span>{wire.source_node_id}</span>
                  <ArrowRight size={10} />
                  <span>{wire.target_node_id}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{wire.reason}</p>
              </div>
            ))}
          </div>
        )}

        {/* Ghost Nodes (Suggestions) */}
        {results.ghost_nodes && results.ghost_nodes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Copilot Suggestions</h3>
            {results.ghost_nodes.map((ghost, idx) => (
              <div key={idx} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-3 group hover:border-blue-200 transition-all">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    ghost.node_type === 'component' ? 'bg-emerald-100 text-emerald-700' : 
                    ghost.node_type === 'constraint' ? 'bg-amber-100 text-amber-700' : 
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {ghost.node_type}
                  </span>
                  <span className="text-[9px] font-bold text-blue-500 uppercase">{ghost.suggested_action}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ghost.suggestion_text}</p>
                <button 
                  onClick={() => onApplySuggestion(ghost)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                  <PlusCircle size={14} />
                  Apply Fix
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 text-[9px] text-slate-400 text-center italic">
        Senior Mechanical Engineer Review Complete
      </div>
    </div>
  );
};
