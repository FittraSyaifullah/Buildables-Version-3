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
      <div className="p-6 md:p-8 border-b border-brand-darkBlue/5 flex flex-col md:flex-row justify-between items-start md:items-center bg-white gap-4">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-4 bg-brand-blue"></div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-blue">Current Manifest</span>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-brand-darkBlue tracking-tight">Bill of Materials</h3>
            <p className="text-gray-500 text-sm font-light mt-1">{data.items.length} line items identified</p>
        </div>
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 text-brand-darkBlue hover:bg-brand-gray rounded-xl transition-all font-semibold text-sm border border-brand-darkBlue/10 shadow-sm hover:shadow-float hover:-translate-y-0.5"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Est. Total</p>
            <p className="font-mono font-semibold text-brand-darkBlue text-3xl tracking-tight">${data.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-brand-gray/50 sticky top-0 z-10 shadow-sm text-[11px] uppercase text-brand-darkBlue/50 font-bold tracking-widest border-b border-brand-darkBlue/5">
            <tr>
              <th className="p-5 pl-8">Component Info</th>
              <th className="p-5">Manufacturer</th>
              <th className="p-5 text-center">Qty</th>
              <th className="p-5 text-right">Unit Cost</th>
              <th className="p-5 pr-8 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-darkBlue/5">
            {data.items.map((item) => (
              <tr key={item.id} className="hover:bg-brand-gray/30 group transition-colors">
                <td className="p-5 pl-8">
                  <div className="font-mono font-semibold text-brand-darkBlue flex items-center gap-1.5 cursor-pointer hover:underline text-sm">
                    {item.partNumber}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue" />
                  </div>
                  <div className="text-gray-500 text-xs mt-1.5 line-clamp-2 font-light leading-relaxed max-w-sm">{item.description}</div>
                  {item.notes && (
                    <div className="mt-2.5 flex items-start gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-amber-200/50 w-fit">
                      <AlertTriangle size={12} className="mt-0.5 flex-shrink-0 text-amber-500" />
                      {item.notes}
                    </div>
                  )}
                </td>
                <td className="p-5">
                  <div className="text-brand-darkBlue font-semibold text-sm">{item.manufacturer}</div>
                  <div className="text-gray-400 text-xs flex items-center gap-2 mt-1.5 font-medium uppercase tracking-wider">
                    {item.supplier} 
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    {item.leadTime}
                  </div>
                </td>
                <td className="p-5 text-center font-mono text-brand-darkBlue font-semibold">{item.quantity}</td>
                <td className="p-5 text-right font-mono text-gray-600">${item.unitPrice.toFixed(2)}</td>
                <td className="p-5 pr-8 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button 
                            onClick={() => onAction?.(`Find alternative suppliers for ${item.partNumber} (${item.manufacturer})`)}
                            className="p-2 hover:bg-white hover:shadow-sm text-gray-400 hover:text-brand-blue rounded-xl transition-all border border-transparent hover:border-brand-darkBlue/10" title="Find Alternatives"
                        >
                            <RefreshCw size={16} />
                        </button>
                        <button 
                             onClick={() => onOpenParametric ? onOpenParametric(item.partNumber) : onAction?.(`Provide detailed datasheet specs for ${item.partNumber}`)}
                            className="p-2 hover:bg-white hover:shadow-sm text-gray-400 hover:text-brand-blue rounded-xl transition-all border border-transparent hover:border-brand-darkBlue/10" title="Parametric Specs"
                        >
                            <Search size={16} />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 md:p-8 border-t border-brand-darkBlue/5 bg-white flex flex-col gap-4">
        {showExportSuccess && (
            <div className="bg-emerald-50 text-emerald-700 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 animate-fade-in border border-emerald-200/50 mb-2 shadow-sm">
                <Check size={16} className="text-emerald-500" />
                Successfully exported {data.items.length} items to distributor cart.
            </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
            <button 
                onClick={handleExportToCart}
                disabled={isExporting}
                className="flex-1 bg-brand-blue text-white py-4 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex justify-center items-center gap-2.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 group disabled:opacity-70 disabled:cursor-not-allowed"
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
                className="px-8 py-4 bg-white border border-brand-darkBlue/10 text-brand-darkBlue rounded-xl text-sm font-semibold hover:bg-brand-gray transition-all shadow-sm hover:shadow-float flex items-center justify-center gap-2.5 disabled:opacity-70"
            >
                {isOptimizing ? <Loader2 size={18} className="animate-spin text-brand-blue" /> : <Sparkles size={18} className="text-brand-blue" />}
                {isOptimizing ? 'Analyzing...' : 'Optimize Cost'}
            </button>
        </div>
      </div>
    </div>
  );
};