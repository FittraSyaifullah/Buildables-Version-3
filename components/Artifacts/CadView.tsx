
import React, { useState } from 'react';
import { CadConceptData } from '../../types';
import { Box, Layers, MousePointer2, Move3d, RotateCcw, Share2, Maximize2, Settings, Info, BoxSelect, Cpu, Leaf, Tag, Wand2, Ruler, Weight, Hammer, Package, Clock, DollarSign, Database, Plus } from 'lucide-react';
import { AddComponentModal } from '../Modals/AddComponentModal';

interface CadViewProps {
  data: CadConceptData;
  onAction?: (actionPrompt: string) => void;
  onOpenParametric?: (partName: string) => void;
}

export const CadView: React.FC<CadViewProps> = ({ data, onAction, onOpenParametric }) => {
  const [activeTab, setActiveTab] = useState<'components' | 'rationale'>('components');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddComponent = (details: { 
    name: string; 
    category: string; 
    sourcing: 'custom_manufactured' | 'off_the_shelf';
    specs?: string;
    supplier?: string;
    mpn?: string;
    unitCost?: string;
    leadTime?: string;
    notes?: string;
  }) => {
    if (details.sourcing === 'custom_manufactured') {
      onAction?.(`Add a new 'custom_manufactured' component to the concept.
        Name: ${details.name}
        Category: ${details.category}
        Specs: ${details.specs}
        Rationale/Notes: ${details.notes || 'None'}`);
    } else {
      onAction?.(`Add a new 'off_the_shelf' component to the concept.
        Name: ${details.name}
        Category: ${details.category}
        Supplier: ${details.supplier}
        MPN: ${details.mpn}
        Unit Cost: ${details.unitCost}
        Lead Time: ${details.leadTime}
        Rationale/Notes: ${details.notes || 'None'}`);
    }
  };

  return (
    <div className="flex h-full bg-white relative overflow-hidden font-sans">
      
      {isAddModalOpen && (
        <AddComponentModal 
            onClose={() => setIsAddModalOpen(false)} 
            onAdd={handleAddComponent} 
        />
      )}

      {/* LEFT: Main 3D Viewport (Simulated) */}
      <div className="flex-1 bg-[#091e42] relative flex flex-col">
        
        {/* Viewport Toolbar */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-[#172b4d]/90 backdrop-blur border border-[#253858] p-2 rounded-lg shadow-xl text-gray-300">
            <button className="p-2 hover:bg-[#253858] hover:text-white rounded transition-colors" title="Select"><MousePointer2 size={18} /></button>
            <button className="p-2 hover:bg-[#253858] hover:text-white rounded transition-colors" title="Orbit"><Move3d size={18} /></button>
            <button className="p-2 hover:bg-[#253858] hover:text-white rounded transition-colors" title="Reset View"><RotateCcw size={18} /></button>
            </div>
            <div className="bg-[#172b4d]/90 backdrop-blur border border-[#253858] p-2 rounded-lg shadow-xl text-gray-300 flex flex-col gap-1">
                <button 
                    onClick={() => onAction?.(`Generate a variation of the current concept focused on weight reduction`)}
                    className="p-2 hover:bg-[#253858] hover:text-brand-orange rounded transition-colors" title="Optimize Weight"
                >
                    <Weight size={18} />
                </button>
                <button 
                    onClick={() => onAction?.(`Adjust dimensions to be more compact`)}
                    className="p-2 hover:bg-[#253858] hover:text-brand-orange rounded transition-colors" title="Resize"
                >
                    <Ruler size={18} />
                </button>
                <button 
                    onClick={() => onAction?.(`Suggest alternative materials for this concept`)}
                    className="p-2 hover:bg-[#253858] hover:text-brand-orange rounded transition-colors" title="Material Swap"
                >
                    <Wand2 size={18} />
                </button>
            </div>
        </div>

        {/* Live Render Badge */}
        <div className="absolute top-4 right-4 z-20">
            <div className="bg-[#172b4d]/90 backdrop-blur border border-[#253858] px-3 py-1.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-mono text-white">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                CONCEPT BUILDER
            </div>
        </div>

        {/* 3D Scene Placeholder */}
        <div className="flex-1 flex items-center justify-center relative bg-gradient-to-br from-[#091e42] to-[#000] overflow-hidden">
            {/* Grid Floor */}
            <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{
                    backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(600px) rotateX(60deg) translateY(100px) scale(2)'
                }}
            ></div>
            
            {/* Object Central Placeholder */}
            <div className="relative z-10 p-10 border border-dashed border-gray-600 rounded-2xl bg-white/5 backdrop-blur-sm flex flex-col items-center gap-4 text-center max-w-sm animate-in zoom-in duration-500">
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-orange/20 blur-xl rounded-full"></div>
                    <Box size={64} className="text-brand-orange relative z-10" strokeWidth={1} />
                </div>
                <div>
                    <h4 className="text-white font-medium text-xl tracking-tight">{data.conceptName}</h4>
                    <p className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-widest">{data.metrics.dimensions}</p>
                </div>
                {/* Simulated markers */}
                <div className="absolute -right-12 top-0 flex items-center gap-1 bg-[#172b4d] px-2 py-1 rounded text-[10px] text-white border border-[#253858]">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Motor Mount
                </div>
                <div className="absolute -left-8 bottom-0 flex items-center gap-1 bg-[#172b4d] px-2 py-1 rounded text-[10px] text-white border border-[#253858]">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Base Plate
                </div>
            </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="bg-[#172b4d] border-t border-[#253858] px-4 py-3 flex justify-between items-center text-xs">
            <div className="flex gap-6 text-gray-400 font-mono">
                <div>MASS: <span className="text-white">{data.metrics.mass}</span></div>
                <div>EST. COST: <span className="text-white">{data.metrics.costEstimate}</span></div>
                {data.metrics.sustainabilityRating && (
                    <div className="flex items-center gap-1">
                        ECO RATING: 
                        <span className={`font-bold ${
                            data.metrics.sustainabilityRating === 'A' ? 'text-green-400' : 
                            data.metrics.sustainabilityRating === 'B' ? 'text-brand-blue' : 'text-yellow-400'
                        }`}>
                            {data.metrics.sustainabilityRating}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                 <button className="text-brand-orange hover:text-white transition-colors uppercase font-bold tracking-wider">Export STEP</button>
            </div>
        </div>
      </div>

      {/* RIGHT: Inspector Panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg z-10">
         <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-brand-darkBlue text-lg leading-tight">{data.conceptName}</h2>
            <p className="text-xs text-gray-500 mt-1 line-clamp-3">{data.description}</p>
         </div>

         {/* Tabs */}
         <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('components')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'components' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                Part List
            </button>
            <button 
                onClick={() => setActiveTab('rationale')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'rationale' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                Rationale
            </button>
         </div>

         {/* Tab Content */}
         <div className="flex-1 overflow-y-auto custom-scrollbar bg-brand-gray p-0">
            {activeTab === 'components' ? (
                <div className="divide-y divide-gray-100">
                    {data.components.map((comp, idx) => (
                        <div key={idx} className="p-4 bg-white hover:bg-brand-lightBlue/30 transition-colors group border-b border-gray-50 last:border-0">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-brand-darkBlue text-sm">{comp.name}</span>
                                <div className="flex gap-1 flex-wrap">
                                    {comp.sourcing === 'verified_supplier' && (
                                        <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100 font-medium">Verified</span>
                                    )}
                                    {comp.sourcing === 'reclaimed' && (
                                        <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100 font-medium flex items-center gap-0.5">
                                            <Leaf size={8} /> Reclaimed
                                        </span>
                                    )}
                                    {comp.sourcing === 'custom_manufactured' && (
                                        <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100 font-medium flex items-center gap-0.5">
                                            <Hammer size={8} /> Custom
                                        </span>
                                    )}
                                    {comp.sourcing === 'off_the_shelf' && (
                                        <span className="text-[10px] bg-brand-lightBlue text-brand-darkBlue px-1.5 py-0.5 rounded border border-brand-blue/20 font-medium flex items-center gap-0.5">
                                            <Package size={8} /> COTS
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                                <span>{comp.category}</span>
                            </div>

                            {/* Off The Shelf Specific Detail Block */}
                            {comp.sourcing === 'off_the_shelf' && (
                                <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-sm">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-1 flex items-center gap-2">
                                        <Package size={10} /> Procurement Data
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-3">
                                        <div>
                                            <div className="text-gray-400 text-[10px] mb-0.5">Supplier</div>
                                            <div className="font-medium text-brand-darkBlue truncate" title={comp.supplier}>{comp.supplier || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-[10px] mb-0.5">MPN</div>
                                            <div className="font-mono text-gray-600 truncate" title={comp.mpn}>{comp.mpn || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-[10px] mb-0.5">Unit Cost</div>
                                            <div className="font-medium text-brand-darkBlue">{comp.unitCost || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-[10px] mb-0.5">Lead Time</div>
                                            <div className="font-medium text-brand-darkBlue">{comp.leadTime || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => onAction?.(`Update sourcing details (Supplier, MPN, Price, Lead Time) for '${comp.name}'`)}
                                            className="flex-1 text-center py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded hover:bg-gray-100 hover:text-brand-blue transition-colors text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1"
                                        >
                                            <Settings size={10} />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => onOpenParametric && onOpenParametric(comp.mpn || comp.name)}
                                            className="flex-1 text-center py-1.5 bg-brand-lightBlue text-brand-blue border border-brand-lightBlue rounded hover:bg-brand-blue/20 transition-colors text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1"
                                        >
                                            <Database size={10} />
                                            Params
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Other components specs or if not off-the-shelf, standard view */}
                            {(comp.sourcing !== 'off_the_shelf') && (
                                <div className="space-y-1.5 pt-2 border-t border-gray-100/50">
                                    {comp.supplier && (
                                        <div className="flex items-start gap-2 text-xs">
                                            <span className="text-gray-400 w-12 text-[10px] uppercase tracking-wider font-semibold">Source</span>
                                            <span className="text-brand-darkBlue">{comp.supplier}</span>
                                        </div>
                                    )}
                                    {comp.specs && (
                                        <div className="flex items-start gap-2 text-xs">
                                            <span className="text-gray-400 w-12 text-[10px] uppercase tracking-wider font-semibold">Specs</span>
                                            <span className="text-gray-600">{comp.specs}</span>
                                        </div>
                                    )}
                                    <div className="pt-2">
                                        <button 
                                            onClick={() => onOpenParametric && onOpenParametric(comp.name)}
                                            className="w-full py-1.5 bg-white border border-gray-200 text-gray-500 rounded hover:bg-gray-50 hover:text-brand-blue hover:border-brand-blue transition-colors text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1"
                                        >
                                            <Database size={10} />
                                            View Specs
                                        </button>
                                    </div>
                                </div>
                            )}

                             {/* Notes always visible */}
                            {comp.notes && (
                                <div className="mt-2 text-[11px] text-brand-orange bg-orange-50/50 p-2 rounded border border-orange-100/50 flex gap-2">
                                    <Tag size={12} className="flex-shrink-0 mt-0.5" />
                                    <span>{comp.notes}</span>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Add Component Action */}
                    <div className="p-4">
                        <button 
                            onClick={() => setIsAddModalOpen(true)} 
                            className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 font-bold text-xs uppercase tracking-wider hover:border-brand-blue hover:text-brand-blue hover:bg-brand-lightBlue/10 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={14} /> Add Component
                        </button>
                    </div>

                    <div className="p-4 pt-0">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Design Constraints</h4>
                        <div className="flex flex-wrap gap-2">
                            {data.constraints.map((c, i) => (
                                <span key={i} className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{c}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-5 space-y-6">
                    <div>
                        <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Info size={14} /> Design Logic
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                            {data.rationale}
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Specifications</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                                <div className="text-[10px] text-gray-400 uppercase">Mass</div>
                                <div className="font-mono font-bold text-brand-darkBlue">{data.metrics.mass}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                                <div className="text-[10px] text-gray-400 uppercase">Cost</div>
                                <div className="font-mono font-bold text-brand-darkBlue">{data.metrics.costEstimate}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
         </div>

         {/* Footer Actions */}
         <div className="p-4 bg-white border-t border-gray-200">
            <button className="w-full flex items-center justify-center gap-2 bg-brand-lightBlue text-brand-blue font-bold py-2 rounded-lg text-sm hover:bg-brand-blue/20 transition-colors">
                <Share2 size={16} /> Share Concept
            </button>
         </div>
      </div>
    </div>
  );
};
