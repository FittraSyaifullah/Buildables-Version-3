
import React, { useState } from 'react';
import { LibraryPart } from '../types';
import { Search, Filter, Plus, Package, MapPin, Tag, MoreHorizontal, FileText, LayoutGrid, List, Heart } from 'lucide-react';

interface PartsLibraryProps {
  parts: LibraryPart[];
  onViewPart: (part: LibraryPart) => void;
  onToggleFavorite: (partId: string) => void;
}

export const PartsLibrary: React.FC<PartsLibraryProps> = ({ parts, onViewPart, onToggleFavorite }) => {
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
      case 'Active': return 'bg-green-50 text-green-700 border-green-100';
      case 'In Stock': return 'bg-brand-lightBlue text-brand-blue border-brand-blue/20';
      case 'Prototyping': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Obsolete': return 'bg-red-50 text-red-700 border-red-100';
      case 'On Order': return 'bg-brand-orange/10 text-brand-orange border-brand-orange/20';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-brand-gray font-sans">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-md border-b border-brand-blue/10 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-serif font-medium text-brand-darkBlue flex items-center gap-3">
              <Package className="text-brand-orange" strokeWidth={1.5} />
              Centralized Parts Library
            </h1>
            <p className="text-gray-500 mt-2 font-light">Manage standard components, track inventory, and access datasheets.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-darkBlue text-white rounded-lg font-medium hover:bg-brand-blue transition-colors shadow-sm">
            <Plus size={18} />
            Add Component
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by MPN, Name, or Manufacturer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-blue/20 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue/50 transition-all shadow-sm"
            />
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-brand-blue/20 rounded-lg bg-white hover:bg-brand-lightBlue text-gray-700 font-medium min-w-[140px] justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                {filterCategory}
              </div>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-brand-blue/10 rounded-lg shadow-xl z-20 hidden group-hover:block animate-in fade-in zoom-in-95 duration-150">
               {categories.map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-lightBlue ${filterCategory === cat ? 'font-bold text-brand-blue' : 'text-gray-700'}`}
                 >
                    {cat}
                 </button>
               ))}
            </div>
          </div>
          <div className="flex border border-brand-blue/20 rounded-lg overflow-hidden bg-white shadow-sm">
             <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-brand-lightBlue text-brand-darkBlue' : 'text-gray-400 hover:text-gray-600'}`}
             >
                <List size={18} />
             </button>
             <div className="w-px bg-brand-blue/20"></div>
             <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-brand-lightBlue text-brand-darkBlue' : 'text-gray-400 hover:text-gray-600'}`}
             >
                <LayoutGrid size={18} />
             </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        {filteredParts.length === 0 ? (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-brand-lightBlue/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={24} className="text-brand-blue/40" />
                </div>
                <h3 className="text-gray-900 font-medium text-lg font-serif">No parts found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
            </div>
        ) : (
            viewMode === 'list' ? (
                <div className="bg-white border border-brand-blue/10 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-brand-lightBlue/20 border-b border-brand-blue/10 text-xs uppercase text-gray-500 font-bold tracking-wider">
                            <tr>
                                <th className="p-4 pl-6 font-medium">Component</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Inventory</th>
                                <th className="p-4 font-medium">Last Used</th>
                                <th className="p-4 text-center font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredParts.map(part => (
                                <tr key={part.id} className="hover:bg-brand-lightBlue/20 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-brand-gray border border-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400 relative overflow-hidden group-hover:border-brand-blue/30 transition-colors">
                                                <Package size={20} />
                                                {part.isFavorite && (
                                                    <div className="absolute top-0 right-0 p-0.5">
                                                        <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-brand-darkBlue text-sm">{part.name}</div>
                                                <div className="font-mono text-[11px] text-gray-500 mt-1">{part.partNumber} • {part.manufacturer}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                            {part.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(part.status)}`}>
                                            {part.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-gray-900">{part.stockCount} units</div>
                                        {part.location && (
                                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                <MapPin size={10} /> {part.location}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-500">{part.lastUsed}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button 
                                                onClick={() => onToggleFavorite(part.id)}
                                                className={`p-2 rounded-lg transition-colors ${part.isFavorite ? 'text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20' : 'text-gray-300 hover:text-brand-orange hover:bg-brand-orange/10'}`}
                                                title={part.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                            >
                                                <Heart size={16} fill={part.isFavorite ? "currentColor" : "none"} />
                                            </button>
                                            <button 
                                                onClick={() => onViewPart(part)}
                                                className="p-2 text-gray-300 hover:text-brand-darkBlue hover:bg-brand-lightBlue rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <FileText size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredParts.map(part => (
                        <div key={part.id} className="bg-white border border-brand-blue/10 rounded-xl shadow-sm hover:shadow-lg hover:border-brand-blue/30 transition-all p-5 flex flex-col group relative">
                             <div className="absolute top-4 right-4 flex gap-1 z-10">
                                <button 
                                    onClick={() => onToggleFavorite(part.id)}
                                    className={`p-1.5 rounded-lg transition-all ${
                                        part.isFavorite 
                                            ? 'text-brand-orange bg-brand-orange/10 opacity-100' 
                                            : 'text-gray-300 hover:text-brand-orange hover:bg-brand-orange/10 opacity-0 group-hover:opacity-100'
                                    }`}
                                >
                                    <Heart size={18} fill={part.isFavorite ? "currentColor" : "none"} />
                                </button>
                            </div>

                            <div 
                                onClick={() => onViewPart(part)}
                                className="w-12 h-12 rounded-xl bg-brand-gray border border-gray-100 flex items-center justify-center text-gray-400 mb-4 group-hover:bg-brand-lightBlue group-hover:border-brand-blue/20 group-hover:text-brand-blue transition-colors cursor-pointer"
                            >
                                <Package size={24} />
                            </div>
                            
                            <h3 className="font-bold text-brand-darkBlue truncate cursor-pointer hover:text-brand-blue" onClick={() => onViewPart(part)} title={part.name}>{part.name}</h3>
                            <div className="font-mono text-xs text-gray-500 mb-4">{part.partNumber}</div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">{part.category}</span>
                                <span className={`text-[10px] px-2 py-1 rounded border ${getStatusColor(part.status)}`}>{part.status}</span>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Inventory</span>
                                <span className="font-mono font-medium text-brand-darkBlue">{part.stockCount}</span>
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
