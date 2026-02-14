import React, { useState } from 'react';
import { X, Check, ShoppingCart, FileText } from 'lucide-react';
import { ComparisonPart } from '../../types';

interface ComparePartsModalProps {
  referencePart: ComparisonPart;
  candidates: ComparisonPart[];
  onClose: () => void;
}

export const ComparePartsModal: React.FC<ComparePartsModalProps> = ({ referencePart, candidates, onClose }) => {
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  // Collect all unique spec keys
  const allKeys = Array.from(new Set([
    ...Object.keys(referencePart.specs),
    ...candidates.flatMap(c => Object.keys(c.specs))
  ]));

  const parts = [referencePart, ...candidates];

  const hasDifference = (key: string) => {
    const refVal = referencePart.specs[key];
    return candidates.some(c => c.specs[key] !== refVal);
  };

  const filteredKeys = onlyDifferences ? allKeys.filter(hasDifference) : allKeys;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-6">
                <h2 className="text-xl font-bold text-brand-darkBlue">Compare Parts</h2>
                <label className="flex items-center gap-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:border-brand-blue transition-colors">
                    <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${onlyDifferences ? 'bg-brand-blue' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${onlyDifferences ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={onlyDifferences} onChange={(e) => setOnlyDifferences(e.target.checked)} />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Only Differences</span>
                </label>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="p-4 w-48 bg-gray-50 border-b border-r border-gray-200 sticky left-0 z-20 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Parameters
                        </th>
                        {parts.map((part, idx) => (
                            <th key={part.id} className={`p-4 min-w-[240px] border-b border-r border-gray-200 bg-white sticky top-0 z-10 text-left relative ${part.isReference ? 'bg-blue-50/30' : ''}`}>
                                {part.isReference && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-brand-blue"></div>
                                )}
                                <div className="mb-2">
                                    <div className="font-bold text-brand-darkBlue text-lg font-mono">{part.partNumber}</div>
                                    <div className="text-sm text-gray-500">{part.manufacturer}</div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button className="flex-1 py-1.5 bg-brand-blue text-white rounded text-xs font-bold shadow hover:bg-blue-700 transition-colors">
                                        Select
                                    </button>
                                    <button className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-brand-blue hover:border-brand-blue transition-colors" title="Datasheet">
                                        <FileText size={14} />
                                    </button>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {filteredKeys.map(key => (
                        <tr key={key} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3 border-b border-r border-gray-100 bg-gray-50 sticky left-0 z-10 font-medium text-gray-600 truncate max-w-[200px]" title={key}>
                                {key}
                            </td>
                            {parts.map((part) => {
                                const isDiff = hasDifference(key);
                                const isRef = part.isReference;
                                const highlight = isDiff && !isRef && part.specs[key] !== referencePart.specs[key];
                                
                                return (
                                    <td key={`${part.id}-${key}`} className={`p-3 border-b border-r border-gray-100 font-mono ${highlight ? 'bg-yellow-50 text-brand-darkBlue font-semibold' : 'text-gray-600'} ${isRef ? 'bg-blue-50/10' : ''}`}>
                                        {part.specs[key] || '-'}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    {filteredKeys.length === 0 && (
                         <tr>
                            <td colSpan={parts.length + 1} className="p-12 text-center text-gray-400 italic">
                                No differences found based on current filters.
                            </td>
                         </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};