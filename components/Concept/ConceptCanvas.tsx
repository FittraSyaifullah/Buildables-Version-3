
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ConceptNode } from './ConceptNode';
import { LintOverlay } from './LintOverlay';
import { Sparkles, Layout, Maximize, Search, Plus, Info, MousePointer2, Link2, Maximize2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasLintResult } from '../../types';

const nodeTypes = {
  concept: ConceptNode,
  group: ({ data }: any) => (
    <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-3xl bg-slate-100/20 flex items-start justify-center pt-4 pointer-events-none">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm pointer-events-auto">
        {data.label}
      </span>
    </div>
  ),
};

export interface ConceptCanvasProps {
  title?: string;
  nodes: any[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (params: any) => void;
  onGenerateNode: (prompt: string) => void;
  isGenerating?: boolean;
  onLint: () => void;
  lintResults: CanvasLintResult | null;
  isLinting: boolean;
  onCloseLint: () => void;
  onApplySuggestion: (suggestion: any) => void;
  onTitleChange?: (title: string) => void;
}

export const ConceptCanvas: React.FC<ConceptCanvasProps> = ({
  title,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onGenerateNode,
  isGenerating = false,
  onLint,
  lintResults,
  isLinting,
  onCloseLint,
  onApplySuggestion,
  onTitleChange
}) => {
  const [prompt, setPrompt] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title || '');
  const { fitView } = useReactFlow();

  useEffect(() => {
    setTempTitle(title || '');
  }, [title]);

  const handleTitleSubmit = () => {
    if (onTitleChange && tempTitle.trim()) {
      onTitleChange(tempTitle);
    }
    setIsEditingTitle(false);
  };

  // Filter out invalid nodes and edges to prevent React Flow crashes (like "measured" of undefined)
  const validNodes = useMemo(() => nodes.filter(n => n && n.id), [nodes]);
  
  const validEdges = useMemo(() => {
    const nodeIds = new Set(validNodes.map(n => n.id));
    const conflictEdges = new Set(lintResults?.red_wires?.map(w => `${w.source_node_id}-${w.target_node_id}`) || []);

    return edges.filter(e => e && nodeIds.has(e.source) && nodeIds.has(e.target)).map(e => {
      const edgeId = `${e.source}-${e.target}`;
      if (conflictEdges.has(edgeId)) {
        return {
          ...e,
          style: { stroke: '#ef4444', strokeWidth: 3 },
          animated: true,
          label: 'CONFLICT',
          labelStyle: { fill: '#ef4444', fontWeight: 700, fontSize: 10 }
        };
      }
      return e;
    });
  }, [validNodes, edges, lintResults]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerateNode(prompt);
    setPrompt('');
    // Give it a moment to render then fit view
    if (validNodes.length > 0) {
      setTimeout(() => fitView({ duration: 800 }), 500);
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 relative overflow-hidden">
      <ReactFlow
        nodes={validNodes}
        edges={validEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
        <Controls showInteractive={false} className="!bg-white !border-slate-200 !shadow-sm" />
        <MiniMap 
          nodeStrokeWidth={3} 
          zoomable 
          pannable 
          className="!bg-white !border-slate-200 !shadow-sm !rounded-lg"
        />

        {/* Top Panel: Search & Filters */}
        <Panel position="top-left" className="flex flex-col gap-2">
          {title && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm mb-2 group"
            >
              {isEditingTitle ? (
                <input
                  autoFocus
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                  className="text-sm font-bold text-slate-800 tracking-tight bg-transparent border-none outline-none w-full"
                />
              ) : (
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <h1 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h1>
                  <MousePointer2 size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </motion.div>
          )}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search nodes..." 
                className="bg-transparent border-none outline-none text-sm text-slate-900 w-32"
              />
            </div>
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <button 
              onClick={() => fitView({ duration: 800 })}
              className="p-1.5 hover:bg-slate-50 rounded text-slate-500 transition-colors"
              title="Fit View"
            >
              <Maximize2 size={16} />
            </button>
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <button 
              onClick={onLint}
              disabled={isLinting || nodes.length === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                isLinting ? 'bg-slate-100 text-slate-400' : 
                lintResults?.status === 'conflict' ? 'bg-red-50 text-red-600 hover:bg-red-100' :
                lintResults?.status === 'valid' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' :
                'bg-brand-darkBlue/5 text-brand-darkBlue hover:bg-brand-darkBlue/10'
              }`}
            >
              {isLinting ? (
                <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : lintResults?.status === 'conflict' ? (
                <ShieldAlert size={14} />
              ) : lintResults?.status === 'valid' ? (
                <CheckCircle2 size={14} />
              ) : (
                <ShieldAlert size={14} />
              )}
              {isLinting ? 'Linting...' : lintResults?.status === 'valid' ? 'Valid' : 'Lint Canvas'}
            </button>
          </div>
        </Panel>

        {/* Top Right: Info & Help */}
        <Panel position="top-right" className="flex items-center gap-2">
           <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             Live Sync Active
           </div>
        </Panel>

        {/* Bottom Panel: Command Bar */}
        <Panel position="bottom-center" className="w-full max-w-2xl px-4 pb-8">
          <form 
            onSubmit={handleGenerate}
            className="group relative bg-white border border-slate-200 rounded-2xl shadow-2xl p-1 transition-all focus-within:border-brand-darkBlue focus-within:ring-4 focus-within:ring-brand-darkBlue/5"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="p-2 bg-brand-darkBlue/5 text-brand-darkBlue rounded-xl">
                <Sparkles size={20} className={isGenerating ? "animate-pulse" : ""} />
              </div>
              <input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe a hardware requirement or component..."
                className="flex-1 bg-transparent border-none outline-none text-base text-slate-900 placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="bg-brand-darkBlue text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-brand-darkBlue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isGenerating ? "Generating..." : "Generate"}
                <Plus size={16} />
              </button>
            </div>
          </form>
        </Panel>

        {/* Lint Results Overlay */}
        {lintResults && (
          <LintOverlay 
            results={lintResults} 
            onClose={onCloseLint} 
            onApplySuggestion={onApplySuggestion}
          />
        )}

        {/* Empty State Overlay */}
        <AnimatePresence>
          {nodes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="max-w-md text-center bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 shadow-xl pointer-events-auto">
                <div className="w-16 h-16 bg-brand-darkBlue/5 text-brand-darkBlue rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Layout size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Empty Canvas</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Start mapping your hardware concept. Type a requirement like "High-torque planetary gearbox" or "Battery management system" in the command bar below to generate your first nodes.
                </p>
                <div className="grid grid-cols-1 gap-3 text-left">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm text-brand-darkBlue mt-0.5">
                      <Link2 size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700 mb-0.5">Connect Nodes</div>
                      <div className="text-[11px] text-slate-500">Drag from the bottom handle of one node to the top handle of another to define dependencies.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm text-brand-darkBlue mt-0.5">
                      <Plus size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700 mb-0.5">Generate Sub-components</div>
                      <div className="text-[11px] text-slate-500">Select a node and type "Add sub-components for [Node Name]" to automatically expand your architecture.</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ReactFlow>
    </div>
  );
};
