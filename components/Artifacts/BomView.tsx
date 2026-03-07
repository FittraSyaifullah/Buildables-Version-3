import React, { useState } from 'react';
import { BomItem } from '../../types';
import { ShoppingCart, ExternalLink, AlertTriangle, RefreshCw, Search, Download, Check, Copy, Loader2, Sparkles } from 'lucide-react';

interface BomViewProps {
  data: {
    items: BomItem[];
    totalCost: number;
  };
  onAction?: (actionPrompt: string) => void;
  onOpenParametric?: (partNumber: string) => void;
}

export const BomView: React.FC<BomViewProps> = ({ data, onAction, onOpenParametric }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const handleExportCSV = () => {
    const headers = ['Part Number', 'Description', 'Manufacturer', 'Quantity', 'Unit Price', 'Supplier', 'Lead Time'];
    const rows = data.items.map(item => [
      item.partNumber,
      item.description,
      item.manufacturer,
      item.quantity,
      item.unitPrice,
      item.supplier,
      item.leadTime
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "BOM_Export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportToCart = () => {
    setIsExporting(true);
    // Simulate API call to distributor
    setTimeout(() => {
        setIsExporting(false);
        setShowExportSuccess(true);
        setTimeout(() => setShowExportSuccess(false), 3000);
    }, 1500);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    // Simulate AI optimization analysis
    setTimeout(() => {
        setIsOptimizing(false);
        onAction?.("Analyze this BOM and suggest cost-optimized alternatives for the high-cost items. Focus on components with long lead times or high unit prices.");
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-white text-sm font-sans">
      <div className="p-6 md:p-8 border-b border-brand-blue/5 flex flex-col md:flex-row justify-between items-start md:items-center bg-brand-gray/30 gap-4">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <div className="h-px w-4 bg-brand-blue"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue">Current Manifest</span>
            </div>
            <h3 className="text-xl font-serif font-medium text-brand-darkBlue">Bill of Materials</h3>
            <p className="text-gray-400 text-xs font-light mt-1">{data.items.length} line items identified</p>
        </div>
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-brand-blue hover:bg-brand-lightBlue rounded-xl transition-all font-semibold text-xs border border-brand-blue/10 shadow-sm"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Est. Total</p>
            <p className="font-mono font-bold text-brand-darkBlue text-2xl tracking-tighter">${data.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white sticky top-0 z-10 shadow-sm text-[10px] uppercase text-brand-darkBlue/40 font-bold tracking-[0.15em] border-b border-brand-blue/5">
            <tr>
              <th className="p-4 pl-8">Component Info</th>
              <th className="p-4">Manufacturer</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4 text-right">Unit Cost</th>
              <th className="p-4 pr-8 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-blue/5">
            {data.items.map((item) => (
              <tr key={item.id} className="hover:bg-brand-lightBlue/10 group transition-colors">
                <td className="p-4 pl-8">
                  <div className="font-mono font-bold text-brand-blue flex items-center gap-1.5 cursor-pointer hover:underline text-xs">
                    {item.partNumber}
                    <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-gray-500 text-[11px] mt-1 line-clamp-2 font-light leading-relaxed max-w-xs">{item.description}</div>
                  {item.notes && (
                    <div className="mt-2 flex items-start gap-1.5 text-brand-orange bg-brand-orange/5 px-2 py-1 rounded-lg text-[10px] font-medium border border-brand-orange/10">
                      <AlertTriangle size={10} className="mt-0.5 flex-shrink-0" />
                      {item.notes}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-brand-darkBlue font-bold text-xs">{item.manufacturer}</div>
                  <div className="text-gray-400 text-[10px] flex items-center gap-1.5 mt-1 font-medium uppercase tracking-tight">
                    {item.supplier} 
                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                    {item.leadTime}
                  </div>
                </td>
                <td className="p-4 text-center font-mono text-brand-darkBlue font-bold">{item.quantity}</td>
                <td className="p-4 text-right font-mono text-gray-600">${item.unitPrice.toFixed(2)}</td>
                <td className="p-4 pr-8 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button 
                            onClick={() => onAction?.(`Find alternative suppliers for ${item.partNumber} (${item.manufacturer})`)}
                            className="p-2 hover:bg-brand-lightBlue text-gray-400 hover:text-brand-blue rounded-xl transition-all" title="Find Alternatives"
                        >
                            <RefreshCw size={14} />
                        </button>
                        <button 
                             onClick={() => onOpenParametric ? onOpenParametric(item.partNumber) : onAction?.(`Provide detailed datasheet specs for ${item.partNumber}`)}
                            className="p-2 hover:bg-brand-lightBlue text-gray-400 hover:text-brand-blue rounded-xl transition-all" title="Parametric Specs"
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

      <div className="p-6 border-t border-brand-blue/5 bg-white flex flex-col gap-3">
        {showExportSuccess && (
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in border border-emerald-100 mb-2">
                <Check size={14} />
                Successfully exported {data.items.length} items to distributor cart.
            </div>
        )}
        <div className="flex gap-3">
            <button 
                onClick={handleExportToCart}
                disabled={isExporting}
                className="flex-1 bg-brand-darkBlue text-white py-3.5 rounded-2xl text-sm font-bold hover:bg-brand-blue transition-all flex justify-center items-center gap-2.5 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
            {isExporting ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
            )}
            {isExporting ? 'Exporting...' : 'Export to Cart'}
            </button>
            <button 
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="px-6 py-3.5 bg-white border border-brand-blue/10 text-brand-darkBlue rounded-2xl text-sm font-bold hover:bg-brand-lightBlue hover:text-brand-blue transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-70"
            >
                {isOptimizing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-brand-orange" />}
                {isOptimizing ? 'Analyzing...' : 'Optimize Cost'}
            </button>
        </div>
      </div>
    </div>
  );
};