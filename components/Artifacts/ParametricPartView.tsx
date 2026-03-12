import React from 'react';
import { ComponentDetailData } from '../../types';
import { Search, FileText, ExternalLink, Info } from 'lucide-react';

interface ParametricPartViewProps {
  data: ComponentDetailData;
  onFindSimilar: () => void;
}

export const ParametricPartView: React.FC<ParametricPartViewProps> = ({ data, onFindSimilar }) => {
  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-brand-darkBlue/5 bg-brand-gray/30">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
                <h2 className="text-3xl font-bold text-brand-darkBlue font-mono tracking-tight">{data.partNumber}</h2>
                <div className="text-sm text-brand-blue font-semibold mt-1.5 uppercase tracking-wider">{data.manufacturer}</div>
                <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">{data.description}</p>
            </div>
            <div className="flex gap-3">
                {data.datasheetUrl && (
                    <a href={data.datasheetUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-darkBlue/10 rounded-xl text-sm font-semibold text-gray-600 hover:text-brand-blue hover:border-brand-blue/30 hover:shadow-sm transition-all">
                        <FileText size={16} /> Datasheet
                    </a>
                )}
            </div>
        </div>
      </div>

      {/* Parametric Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-serif font-semibold text-brand-darkBlue">Parametric Info</h3>
            <span className="bg-brand-blue/10 text-brand-blue text-[10px] px-2.5 py-1 rounded-full font-bold tracking-widest uppercase">LIVE DATA</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {Object.entries(data.specs).map(([key, value], idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-brand-darkBlue/5 group hover:bg-brand-gray/30 px-3 rounded-lg transition-colors">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {key}
                        <Info size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-help transition-opacity" />
                    </div>
                    <div className="text-sm font-semibold text-brand-darkBlue font-mono">{value}</div>
                </div>
            ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 md:p-8 border-t border-brand-darkBlue/5 bg-white">
        <button 
            onClick={onFindSimilar}
            className="w-full py-4 bg-brand-blue text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-blue-700 transition-all flex items-center justify-center gap-2.5 group"
        >
            <Search size={18} className="group-hover:scale-110 transition-transform" />
            Find Similar Parts
        </button>
        <p className="text-center text-xs text-gray-400 mt-4 font-medium">
            Search global inventory based on parametric constraints.
        </p>
      </div>
    </div>
  );
};