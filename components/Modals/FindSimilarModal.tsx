import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { ComponentDetailData } from '../../types';

interface FindSimilarModalProps {
  part: ComponentDetailData;
  onClose: () => void;
  onFind: (selectedParams: string[]) => void;
}

export const FindSimilarModal: React.FC<FindSimilarModalProps> = ({ part, onClose, onFind }) => {
  // Default to selecting all params initially
  const [selectedParams, setSelectedParams] = useState<string[]>(
    Object.keys(part.specs).slice(0, 5) // Select first 5 by default
  );

  const toggleParam = (key: string) => {
    setSelectedParams(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
                <h3 className="font-bold text-lg text-brand-darkBlue">Find Similar</h3>
                <p className="text-sm text-gray-500">Find similar parts using <span className="font-mono font-bold text-brand-darkBlue">"{part.partNumber}"</span> info:</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {Object.entries(part.specs).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-3 p-2 rounded hover:bg-brand-lightBlue/10 cursor-pointer group transition-colors">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedParams.includes(key) ? 'bg-brand-darkBlue border-brand-darkBlue' : 'border-gray-300 bg-white group-hover:border-brand-darkBlue'}`}>
                            {selectedParams.includes(key) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={selectedParams.includes(key)}
                            onChange={() => toggleParam(key)}
                        />
                        <div className="flex-1">
                            <span className={`text-sm font-medium block ${selectedParams.includes(key) ? 'text-brand-darkBlue' : 'text-gray-500'}`}>{key}</span>
                            <span className="text-xs text-gray-400 font-mono">{value}</span>
                        </div>
                    </label>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
            </button>
            <button 
                onClick={() => onFind(selectedParams)}
                disabled={selectedParams.length === 0}
                className={`px-6 py-2 text-sm font-bold text-white rounded-lg flex items-center gap-2 transition-all ${
                    selectedParams.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-darkBlue hover:bg-blue-700 shadow-md'
                }`}
            >
                <Search size={16} />
                Find Matches
            </button>
        </div>

      </div>
    </div>
  );
};