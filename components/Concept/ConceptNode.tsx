
import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { 
  Box, Cpu, Shield, Layers, Edit3, Maximize2, Image as ImageIcon, 
  CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp, 
  History, Library, ExternalLink, User, Calendar, Save, X
} from 'lucide-react';
import { ConceptNodeData } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TypeIcon = ({ type }: { type: ConceptNodeData['type'] }) => {
  switch (type) {
    case 'requirement': return <Shield size={14} className="text-blue-500" />;
    case 'component': return <Cpu size={14} className="text-emerald-500" />;
    case 'subsystem': return <Layers size={14} className="text-purple-500" />;
    case 'constraint': return <Clock size={14} className="text-amber-500" />;
    default: return <Box size={14} />;
  }
};

const StatusIcon = ({ status }: { status: ConceptNodeData['status'] }) => {
  switch (status) {
    case 'validated': return <CheckCircle2 size={12} className="text-emerald-500" />;
    case 'conflict': return <AlertCircle size={12} className="text-rose-500" />;
    default: return <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />;
  }
};

export const ConceptNode = memo(({ id, data, selected }: NodeProps<any>) => {
  const nodeData = data as ConceptNodeData;
  const { setNodes } = useReactFlow();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'history' | 'library'>('specs');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(nodeData.prompt || '');

  const handleSavePrompt = () => {
    setNodes((nds: any[]) => 
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              prompt: editedPrompt,
              history: [
                {
                  timestamp: Date.now(),
                  author: "You",
                  change: `Updated generation prompt: "${editedPrompt.substring(0, 30)}..."`
                },
                ...(node.data.history || [])
              ]
            }
          };
        }
        return node;
      })
    );
    setIsEditingPrompt(false);
  };

  const handleCancelPrompt = () => {
    setEditedPrompt(nodeData.prompt || '');
    setIsEditingPrompt(false);
  };

  return (
    <div className={cn(
      "group relative min-w-[240px] max-w-[320px] bg-white border rounded-xl shadow-sm transition-all duration-200",
      selected ? "border-brand-darkBlue ring-2 ring-brand-darkBlue/20" : "border-slate-200 hover:border-slate-300",
      nodeData.status === 'conflict' && "border-rose-200 bg-rose-50/30"
    )}>
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-slate-300 border-2 border-white" />
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-slate-300 border-2 border-white" />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <TypeIcon type={nodeData.type} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {nodeData.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon status={nodeData.status} />
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-400"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-sm font-bold text-slate-900 leading-tight flex-1">
            {nodeData.label}
          </h3>
          {/* Quick Actions - Always visible but subtle */}
          <div className="flex gap-1">
            <button 
              onClick={() => setIsEditingPrompt(!isEditingPrompt)}
              className={cn(
                "p-1.5 rounded-md transition-all",
                isEditingPrompt ? "text-brand-darkBlue bg-brand-darkBlue/10" : "text-slate-400 hover:text-brand-darkBlue hover:bg-brand-darkBlue/5"
              )} 
              title="Edit Prompt"
            >
              <Edit3 size={14} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-brand-darkBlue hover:bg-brand-darkBlue/5 rounded-md transition-all" title="View Render">
              <ImageIcon size={14} />
            </button>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {isEditingPrompt ? (
            <motion.div
              key="edit-prompt"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2 mb-3"
            >
              <div className="text-[10px] font-bold text-brand-darkBlue uppercase tracking-wider mb-1">Edit Generation Prompt</div>
              <textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="w-full text-[11px] p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue outline-none min-h-[60px] resize-none"
                placeholder="Enter prompt for this component..."
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={handleCancelPrompt}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded transition-colors"
                >
                  <X size={12} />
                  Cancel
                </button>
                <button 
                  onClick={handleSavePrompt}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-brand-darkBlue text-white rounded hover:bg-brand-darkBlue/90 transition-colors"
                >
                  <Save size={12} />
                  Save
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="display-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {nodeData.description && (
                <p className="text-[11px] text-slate-500 leading-normal mb-3">
                  {nodeData.description}
                </p>
              )}

              {/* Render Preview Thumbnail (if exists and not expanded) */}
              {!isExpanded && nodeData.renderUrl && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-video w-full rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative group/img"
                >
                  <img 
                    src={nodeData.renderUrl} 
                    alt="Render" 
                    className="w-full h-full object-cover opacity-90 group-hover/img:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover/img:bg-transparent transition-colors" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expandable Sections */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-slate-50/30 rounded-b-xl"
          >
            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-2">
              {[
                { id: 'specs', icon: <Maximize2 size={12} />, label: 'Specs' },
                { id: 'history', icon: <History size={12} />, label: 'History' },
                { id: 'library', icon: <Library size={12} />, label: 'Library' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2",
                    activeTab === tab.id 
                      ? "border-brand-darkBlue text-brand-darkBlue bg-brand-darkBlue/5" 
                      : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 max-h-[200px] overflow-y-auto custom-scrollbar">
              {activeTab === 'specs' && (
                <div className="space-y-2">
                  {nodeData.specs && Object.entries(nodeData.specs).length > 0 ? (
                    Object.entries(nodeData.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center gap-2 py-1 border-b border-slate-100 last:border-0">
                        <span className="text-[10px] font-medium text-slate-400 uppercase">{key}</span>
                        <span className="text-[11px] font-bold text-slate-700">{value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-slate-400 italic text-center py-4">No specifications defined</div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-3">
                  {nodeData.history && nodeData.history.length > 0 ? (
                    nodeData.history.map((item, idx) => (
                      <div key={idx} className="relative pl-4 border-l border-slate-200 pb-2 last:pb-0">
                        <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-slate-300 border border-white" />
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-0.5">
                          <User size={10} />
                          <span className="font-bold">{item.author}</span>
                          <span className="mx-1">•</span>
                          <Calendar size={10} />
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-tight">{item.change}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-slate-400 italic text-center py-4">No version history available</div>
                  )}
                </div>
              )}

              {activeTab === 'library' && (
                <div className="space-y-2">
                  {nodeData.libraryLinks && nodeData.libraryLinks.length > 0 ? (
                    nodeData.libraryLinks.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg hover:border-brand-darkBlue hover:bg-brand-darkBlue/5 transition-all group/link"
                      >
                        <div>
                          <div className="text-[11px] font-bold text-slate-800">{link.name}</div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{link.provider}</div>
                        </div>
                        <ExternalLink size={12} className="text-slate-300 group-hover/link:text-brand-darkBlue transition-colors" />
                      </a>
                    ))
                  ) : (
                    <div className="text-[11px] text-slate-400 italic text-center py-4">No library links found</div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Point Indicators */}
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
    </div>
  );
});

ConceptNode.displayName = 'ConceptNode';
