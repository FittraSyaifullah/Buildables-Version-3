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
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-brand-darkBlue font-mono">{data.partNumber}</h2>
                <div className="text-sm text-gray-600 font-medium mt-1">{data.manufacturer}</div>
                <p className="text-xs text-gray-500 mt-2 max-w-md">{data.description}</p>
            </div>
            <div className="flex gap-2">
                {data.datasheetUrl && (
                    <a href={data.datasheetUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:text-brand-darkBlue hover:border-brand-darkBlue transition-colors">
                        <FileText size={14} /> Datasheet
                    </a>
                )}
            </div>
        </div>
      </div>

      {/* Parametric Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-brand-darkBlue">Parametric Info</h3>
            <span className="bg-brand-lightBlue text-brand-darkBlue text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE DATA</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {Object.entries(data.specs).map(([key, value], idx) => (
                <div key={idx} className="flex justify-between items-center py-2.5 border-b border-gray-100 group hover:bg-gray-50 px-2 rounded">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        {key}
                        <Info size={10} className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-help" />
                    </div>
                    <div className="text-sm font-semibold text-brand-darkBlue font-mono">{value}</div>
                </div>
            ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button 
            onClick={onFindSimilar}
            className="w-full py-3 bg-brand-orange text-white rounded-lg font-bold shadow-md hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
        >
            <Search size={18} />
            Find Similar Parts
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-2">
            Search global inventory based on parametric constraints.
        </p>
      </div>
    </div>
  );
};