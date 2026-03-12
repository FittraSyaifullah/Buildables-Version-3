
import React, { useState } from 'react';
import { X, Plus, Hammer, Package } from 'lucide-react';

interface AddComponentModalProps {
  onClose: () => void;
  onAdd: (details: { 
    name: string; 
    category: string; 
    sourcing: 'custom_manufactured' | 'off_the_shelf';
    specs?: string;
    supplier?: string;
    mpn?: string;
    unitCost?: string;
    leadTime?: string;
    notes?: string;
  }) => void;
  title?: string;
  submitLabel?: string;
}

export const AddComponentModal: React.FC<AddComponentModalProps> = ({ 
  onClose, 
  onAdd, 
  title = "Add Component",
  submitLabel = "Add to Concept"
}) => {
  const [sourcing, setSourcing] = useState<'custom_manufactured' | 'off_the_shelf'>('custom_manufactured');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  
  // Custom fields
  const [specs, setSpecs] = useState('');
  
  // COTS fields
  const [supplier, setSupplier] = useState('');
  const [mpn, setMpn] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [leadTime, setLeadTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ 
      name, 
      category, 
      sourcing,
      specs: sourcing === 'custom_manufactured' ? specs : undefined,
      supplier: sourcing === 'off_the_shelf' ? supplier : undefined,
      mpn: sourcing === 'off_the_shelf' ? mpn : undefined,
      unitCost: sourcing === 'off_the_shelf' ? unitCost : undefined,
      leadTime: sourcing === 'off_the_shelf' ? leadTime : undefined,
      notes: notes.trim() ? notes : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-brand-darkBlue">{title}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Sourcing Type Selector */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setSourcing('custom_manufactured')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                sourcing === 'custom_manufactured' 
                  ? 'bg-purple-50 border-purple-200 text-purple-700 ring-1 ring-purple-200' 
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Hammer size={20} className="mb-1" />
              <span className="text-xs font-bold uppercase">Custom</span>
            </button>
            <button
              type="button"
              onClick={() => setSourcing('off_the_shelf')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                sourcing === 'off_the_shelf' 
                  ? 'bg-brand-lightBlue border-brand-darkBlue/30 text-brand-darkBlue ring-1 ring-brand-darkBlue/30' 
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Package size={20} className="mb-1" />
              <span className="text-xs font-bold uppercase">Off-the-shelf</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Component Name</label>
            <input 
                autoFocus 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue transition-all" 
                placeholder="e.g. Mounting Plate" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
            <input 
                required 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                list="category-options"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue transition-all" 
                placeholder="e.g. Structural or type your own" 
            />
            <datalist id="category-options">
                <option value="Structural" />
                <option value="Electronics" />
                <option value="Fasteners" />
                <option value="Pneumatics" />
                <option value="Motors" />
                <option value="Sensors" />
                <option value="Hardware" />
            </datalist>
          </div>

          {sourcing === 'custom_manufactured' ? (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Key Specifications</label>
              <textarea 
                  required 
                  value={specs} 
                  onChange={e => setSpecs(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue transition-all resize-none" 
                  rows={3} 
                  placeholder="e.g. Aluminum 6061, 5mm thickness, CNC machined" 
              />
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4 animate-in slide-in-from-top-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center gap-2">
                <Package size={12}/> Procurement Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Supplier</label>
                  <input 
                      required 
                      value={supplier} 
                      onChange={e => setSupplier(e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue transition-all bg-white" 
                      placeholder="e.g. DigiKey" 
                  />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">MPN</label>
                    <input 
                        required 
                        value={mpn} 
                        onChange={e => setMpn(e.target.value)} 
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue transition-all bg-white" 
                        placeholder="e.g. 17HS4401" 
                    />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit Cost</label>
                  <input 
                      required 
                      value={unitCost} 
                      onChange={e => setUnitCost(e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue transition-all bg-white" 
                      placeholder="e.g. $12.50" 
                  />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lead Time</label>
                    <input 
                        required 
                        value={leadTime} 
                        onChange={e => setLeadTime(e.target.value)} 
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue transition-all bg-white" 
                        placeholder="e.g. 3 days" 
                    />
                 </div>
              </div>
            </div>
          )}

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                Rationale / Notes <span className="text-gray-400 font-normal lowercase">(optional)</span>
             </label>
             <textarea 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue transition-all resize-none" 
                  rows={2} 
                  placeholder="Why was this component selected?" 
              />
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-brand-orange text-white rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            <Plus size={16} /> {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
};
