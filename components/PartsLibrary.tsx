
import React, { useState } from 'react';
import { LibraryPart } from '../types';
import { Search, Filter, Plus, Package, MapPin, Tag, MoreHorizontal, FileText, LayoutGrid, List, Heart } from 'lucide-react';

interface PartsLibraryProps {
  parts: LibraryPart[];
  onViewPart: (part: LibraryPart) => void;
  onToggleFavorite: (partId: string) => void;
  onAddComponent?: () => void;
  hideHeader?: boolean;
}

export const PartsLibrary: React.FC<PartsLibraryProps> = ({ parts, onViewPart, onToggleFavorite, onAddComponent, hideHeader }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const categories = ['All', 'Favorites', ...Array.from(new Set(parts.map(p => p.category)))];

  const filteredParts = parts.filter(part => {
    const matchesSearch = 
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
        filterCategory === 'All' ? true :
        filterCategory === 'Favorites' ? part.isFavorite :
        part.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: LibraryPart['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Stock': return 'bg-brand-lightBlue text-brand-darkBlue border-brand-darkBlue/20';
      case 'Prototyping': return 'bg-brand-darkBlue/10 text-brand-darkBlue border-brand-darkBlue/20';
      case 'Obsolete': return 'bg-red-50 text-red-700 border-red-100';
      case 'On Order': return 'bg-brand-orange/10 text-brand-orange border-brand-orange/20';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-white font-sans">
      {/* Header */}
      {!hideHeader && (
        <div className="bg-white border-b border-brand-darkBlue/10 px-4 md:px-12 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                  <div className="h-px w-8 bg-brand-orange"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-orange">Inventory System</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-light text-brand-darkBlue flex items-center gap-4">
                Parts <span className="italic text-brand-darkBlue">Library</span>
              </h1>
              <p className="text-gray-500 mt-4 font-light text-lg max-w-xl leading-relaxed">
                  Centralized repository for standard components, custom hardware, and supply chain intelligence.
              </p>
            </div>
            {onAddComponent && (
              <button 
                onClick={onAddComponent}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-orange text-white rounded-2xl font-semibold hover:bg-orange-600 hover:shadow-2xl hover:-translate-y-0.5 transition-all shadow-lg group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                Add Component
              </button>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by MPN, Name, or Manufacturer..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-brand-darkBlue/10 rounded-2xl outline-none focus:ring-4 focus:ring-brand-darkBlue/5 focus:border-brand-darkBlue/30 transition-all text-base font-light"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative group flex-1 md:flex-none">
                <button className="w-full flex items-center gap-3 px-6 py-4 border border-brand-darkBlue/10 rounded-2xl bg-white hover:bg-brand-lightBlue text-brand-darkBlue font-medium min-w-[160px] justify-between shadow-sm transition-all">
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-brand-darkBlue" />
                    <span className="text-sm">{filterCategory}</span>
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-brand-darkBlue/10 rounded-2xl shadow-2xl z-20 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                   {categories.map(cat => (
                     <button 
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`w-full text-left px-6 py-3 text-sm hover:bg-brand-lightBlue transition-colors ${filterCategory === cat ? 'font-bold text-brand-darkBlue bg-brand-lightBlue/50' : 'text-gray-600'}`}
                     >
                        {cat}
                     </button>
                   ))}
                </div>
              </div>
              <div className="flex p-1.5 border border-brand-darkBlue/10 rounded-2xl bg-white shadow-sm">
                 <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-brand-darkBlue text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                    <List size={20} />
                 </button>
                 <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-brand-darkBlue text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                    <LayoutGrid size={20} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar when header is hidden */}
      {hideHeader && (
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search parts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-all">
                  <Filter size={16} className="text-gray-500" />
                  <span>{filterCategory}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 hidden group-hover:block overflow-hidden">
                   {categories.map(cat => (
                     <button 
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${filterCategory === cat ? 'font-medium text-brand-darkBlue bg-brand-lightBlue/30' : 'text-gray-600'}`}
                     >
                        {cat}
                     </button>
                   ))}
                </div>
              </div>
              <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-darkBlue' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-darkBlue' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
              {onAddComponent && (
                <button 
                  onClick={onAddComponent}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-all shadow-sm"
                >
                  <Plus size={16} />
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-12">
        {filteredParts.length === 0 ? (
            <div className="text-center py-32">
                <div className="w-24 h-24 bg-brand-lightBlue/30 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-darkBlue/10">
                    <Package size={40} className="text-brand-darkBlue/20" />
                </div>
                <h3 className="text-brand-darkBlue font-medium text-2xl font-serif">No components found</h3>
                <p className="text-gray-500 mt-2 font-light">Refine your search parameters or add a new component.</p>
            </div>
        ) : (
            viewMode === 'list' ? (
                <div className="bg-white border border-brand-darkBlue/5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead className="bg-gray-50 border-b border-brand-darkBlue/5 text-[10px] uppercase text-brand-darkBlue/40 font-bold tracking-[0.2em]">
                            <tr>
                                <th className="p-6 pl-10">Component Details</th>
                                <th className="p-6">Category</th>
                                <th className="p-6">Status</th>
                                <th className="p-6">Inventory</th>
                                <th className="p-6">Last Activity</th>
                                <th className="p-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-darkBlue/5">
                            {filteredParts.map(part => (
                                <tr key={part.id} className="hover:bg-brand-lightBlue/10 transition-colors group">
                                    <td className="p-6 pl-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-brand-darkBlue/5 flex items-center justify-center flex-shrink-0 text-brand-darkBlue/40 relative overflow-hidden group-hover:border-brand-darkBlue/20 group-hover:bg-white transition-all shadow-sm">
                                                <Package size={24} strokeWidth={1.5} />
                                                {part.isFavorite && (
                                                    <div className="absolute top-0 right-0 p-1">
                                                        <div className="w-2.5 h-2.5 bg-brand-orange rounded-full shadow-sm"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-brand-darkBlue text-base group-hover:text-brand-darkBlue transition-colors">{part.name}</div>
                                                <div className="font-mono text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{part.partNumber} <span className="mx-2 text-brand-darkBlue/20">|</span> {part.manufacturer}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-brand-lightBlue/50 text-brand-darkBlue border border-brand-darkBlue/5">
                                            {part.category}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(part.status)}`}>
                                            {part.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-sm font-semibold text-brand-darkBlue">{part.stockCount} <span className="text-gray-400 font-light">units</span></div>
                                        {part.location && (
                                            <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-1 font-medium uppercase tracking-tight">
                                                <MapPin size={10} className="text-brand-darkBlue/50" /> {part.location}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        <div className="text-sm text-gray-500 font-light italic">{part.lastUsed}</div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => onToggleFavorite(part.id)}
                                                className={`p-3 rounded-2xl transition-all ${part.isFavorite ? 'text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20' : 'text-gray-300 hover:text-brand-orange hover:bg-brand-orange/5'}`}
                                                title={part.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                            >
                                                <Heart size={18} fill={part.isFavorite ? "currentColor" : "none"} strokeWidth={1.5} />
                                            </button>
                                            <button 
                                                onClick={() => onViewPart(part)}
                                                className="p-3 text-gray-300 hover:text-brand-darkBlue hover:bg-brand-lightBlue/50 rounded-2xl transition-all"
                                                title="View Details"
                                            >
                                                <FileText size={18} strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredParts.map(part => (
                        <div key={part.id} className="bg-white border border-brand-darkBlue/5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-brand-darkBlue/20 transition-all p-8 flex flex-col group relative overflow-hidden">
                             <div className="absolute top-6 right-6 flex gap-1 z-10">
                                <button 
                                    onClick={() => onToggleFavorite(part.id)}
                                    className={`p-2 rounded-xl transition-all ${
                                        part.isFavorite 
                                            ? 'text-brand-orange bg-brand-orange/10 opacity-100' 
                                            : 'text-gray-300 hover:text-brand-orange hover:bg-brand-orange/5 opacity-0 group-hover:opacity-100'
                                    }`}
                                >
                                    <Heart size={20} fill={part.isFavorite ? "currentColor" : "none"} strokeWidth={1.5} />
                                </button>
                            </div>

                            <div 
                                onClick={() => onViewPart(part)}
                                className="w-16 h-16 rounded-2xl bg-gray-50 border border-brand-darkBlue/5 flex items-center justify-center text-brand-darkBlue/40 mb-8 group-hover:bg-brand-lightBlue group-hover:border-brand-darkBlue/20 group-hover:text-brand-darkBlue transition-all cursor-pointer shadow-sm"
                            >
                                <Package size={32} strokeWidth={1.5} />
                            </div>
                            
                            <h3 className="font-bold text-brand-darkBlue text-lg truncate cursor-pointer hover:text-brand-darkBlue transition-colors mb-1" onClick={() => onViewPart(part)} title={part.name}>{part.name}</h3>
                            <div className="font-mono text-[10px] text-gray-400 mb-6 uppercase tracking-wider">{part.partNumber}</div>
                            
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="text-[10px] font-semibold bg-brand-lightBlue/50 px-3 py-1 rounded-lg text-brand-darkBlue border border-brand-darkBlue/5">{part.category}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(part.status)}`}>{part.status}</span>
                            </div>

                            <div className="mt-auto pt-6 border-t border-brand-darkBlue/5 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Inventory</span>
                                <span className="font-mono font-bold text-brand-darkBlue text-lg">{part.stockCount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )
        )}
      </div>
    </div>
  );
};
