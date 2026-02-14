import React from 'react';
import { BomItem } from '../../types';
import { ShoppingCart, ExternalLink, AlertTriangle, RefreshCw, Search } from 'lucide-react';

interface BomViewProps {
  data: {
    items: BomItem[];
    totalCost: number;
  };
  onAction?: (actionPrompt: string) => void;
  onOpenParametric?: (partNumber: string) => void;
}

export const BomView: React.FC<BomViewProps> = ({ data, onAction, onOpenParametric }) => {
  return (
    <div className="flex flex-col h-full bg-white text-sm">
      <div className="p-4 border-b flex justify-between items-center bg-brand-gray">
        <div>
          <h3 className="font-bold text-brand-darkBlue">Bill of Materials</h3>
          <p className="text-gray-500 text-xs">{data.items.length} line items</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Est. Cost</p>
          <p className="font-mono font-bold text-brand-darkBlue text-lg">${data.totalCost.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-0">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white sticky top-0 z-10 shadow-sm text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-3">MPN / Desc</th>
              <th className="p-3">Supplier</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Cost</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.items.map((item) => (
              <tr key={item.id} className="hover:bg-brand-lightBlue/30 group transition-colors">
                <td className="p-3">
                  <div className="font-mono font-medium text-brand-blue flex items-center gap-1 cursor-pointer hover:underline">
                    {item.partNumber}
                    <ExternalLink size={10} className="opacity-0 group-hover:opacity-100" />
                  </div>
                  <div className="text-gray-600 text-xs mt-0.5 line-clamp-2">{item.description}</div>
                  {item.notes && (
                    <div className="mt-1 flex items-start gap-1 text-brand-orange bg-orange-50 p-1 rounded text-[10px]">
                      <AlertTriangle size={10} className="mt-0.5" />
                      {item.notes}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div className="text-brand-darkBlue font-medium">{item.manufacturer}</div>
                  <div className="text-gray-500 text-xs flex items-center gap-1">
                    {item.supplier} 
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    {item.leadTime}
                  </div>
                </td>
                <td className="p-3 text-center font-mono text-gray-700">{item.quantity}</td>
                <td className="p-3 text-right font-mono text-gray-700">${item.unitPrice.toFixed(2)}</td>
                <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => onAction?.(`Find alternative suppliers for ${item.partNumber} (${item.manufacturer})`)}
                            className="p-1.5 hover:bg-brand-lightBlue text-gray-500 hover:text-brand-blue rounded" title="Find Alternatives"
                        >
                            <RefreshCw size={14} />
                        </button>
                        <button 
                             onClick={() => onOpenParametric ? onOpenParametric(item.partNumber) : onAction?.(`Provide detailed datasheet specs for ${item.partNumber}`)}
                            className="p-1.5 hover:bg-brand-lightBlue text-gray-500 hover:text-brand-blue rounded" title="Parametric Specs"
                        >
                            <Search size={14} />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t bg-white flex gap-2">
        <button className="flex-1 bg-brand-blue text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-sm">
          <ShoppingCart size={16} />
          Export to Cart
        </button>
        <button 
            onClick={() => onAction?.("Suggest cost reduction opportunities for the current BOM")}
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-brand-blue transition-colors shadow-sm"
        >
            Optimize Cost
        </button>
      </div>
    </div>
  );
};