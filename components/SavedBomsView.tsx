
import React from 'react';
import { SavedBom } from '../types';
import { Database, Calendar, DollarSign, Package, ArrowRight, Trash2, Download } from 'lucide-react';

interface SavedBomsViewProps {
  boms: SavedBom[];
  onOpenBom: (bom: SavedBom) => void;
  onDeleteBom: (id: string) => void;
  hideHeader?: boolean;
}

export const SavedBomsView: React.FC<SavedBomsViewProps> = ({ boms, onOpenBom, onDeleteBom, hideHeader }) => {
  return (
    <div className={`flex-1 h-full overflow-y-auto bg-white font-sans ${hideHeader ? 'p-6' : 'p-4 md:p-12'}`}>
      <div className="max-w-6xl mx-auto">
        {!hideHeader && (
          <div className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                  <div className="h-px w-8 bg-brand-darkBlue"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-darkBlue">Archive</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-light text-brand-darkBlue">
                  Saved <span className="italic text-brand-darkBlue">BOMs</span>
              </h1>
              <p className="text-gray-500 mt-4 font-light text-lg max-w-xl leading-relaxed">
                  Access your historical bill of materials, cost analysis, and supply chain snapshots.
              </p>
          </div>
        )}

        {boms.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-brand-darkBlue/5 shadow-sm">
                <div className="w-20 h-20 bg-brand-lightBlue/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Database size={32} className="text-brand-darkBlue/30" />
                </div>
                <h3 className="text-brand-darkBlue font-medium text-xl font-serif">No saved BOMs yet</h3>
                <p className="text-gray-500 mt-2 font-light">Generate and save a BOM from the chat interface to see it here.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {boms.map((bom) => (
                    <div 
                        key={bom.id} 
                        className="bg-white p-8 rounded-3xl border border-brand-darkBlue/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-brand-darkBlue/20 transition-all group flex flex-col h-full relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className="p-4 rounded-2xl bg-brand-lightBlue/30 group-hover:bg-brand-lightBlue border border-brand-darkBlue/5 group-hover:shadow-sm transition-all">
                                <Database size={24} className="text-brand-darkBlue" />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); /* Export logic */ }}
                                    className="p-2 text-gray-300 hover:text-brand-darkBlue hover:bg-brand-lightBlue/50 rounded-xl transition-all"
                                    title="Export CSV"
                                >
                                    <Download size={18} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteBom(bom.id); }}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete BOM"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="font-serif font-medium text-brand-darkBlue text-2xl mb-2 group-hover:text-brand-darkBlue transition-colors">
                            {bom.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-wider mb-6">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                {new Date(bom.createdAt).toLocaleDateString()}
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                            <div className="flex items-center gap-1.5">
                                <Package size={12} />
                                {bom.items.length} items
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-brand-darkBlue/5 flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-1">Total Value</span>
                                <span className="font-mono font-bold text-brand-darkBlue text-2xl">${bom.totalCost.toLocaleString()}</span>
                            </div>
                            <button 
                                onClick={() => onOpenBom(bom)}
                                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-lightBlue/50 group-hover:bg-brand-orange group-hover:text-white transition-all shadow-sm group-hover:translate-x-1"
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
