
import React, { useState } from 'react';
import { LibraryDocument } from '../types';
import { 
    FileText, 
    Search, 
    Filter, 
    Download, 
    ExternalLink, 
    Trash2, 
    Tag, 
    Calendar, 
    File, 
    Plus,
    MoreVertical,
    CheckCircle2,
    Clock
} from 'lucide-react';

interface DocumentCenterProps {
  documents: LibraryDocument[];
  onDeleteDocument: (id: string) => void;
  onUploadDocument: () => void;
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({ documents, onDeleteDocument, onUploadDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const types = ['All', 'datasheet', 'manual', 'compliance', 'report', 'whitepaper'];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.linkedPartNumber && doc.linkedPartNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'All' ? true : doc.type === filterType;

    return matchesSearch && matchesType;
  });

  const getFileIcon = (format: string) => {
    switch (format) {
      case 'PDF': return <FileText className="text-red-400" size={24} />;
      case 'XLSX': return <File className="text-emerald-400" size={24} />;
      default: return <File className="text-brand-blue" size={24} />;
    }
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-brand-gray font-sans">
      {/* Header */}
      <div className="bg-white border-b border-brand-blue/10 px-4 md:px-12 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-8 bg-brand-blue"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue">Knowledge Base</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-light text-brand-darkBlue">
              Document <span className="italic text-brand-orange">Center</span>
            </h1>
            <p className="text-gray-500 mt-4 font-light text-lg max-w-xl leading-relaxed">
                Centralized repository for datasheets, technical manuals, and compliance documentation.
            </p>
          </div>
          <button 
            onClick={onUploadDocument}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-darkBlue text-white rounded-2xl font-semibold hover:bg-brand-blue hover:shadow-2xl hover:-translate-y-0.5 transition-all shadow-lg group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Upload Document
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title, tags, or part number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-brand-gray border border-brand-blue/10 rounded-2xl outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/30 transition-all text-base font-light"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative group flex-1 md:flex-none">
              <button className="w-full flex items-center gap-3 px-6 py-4 border border-brand-blue/10 rounded-2xl bg-white hover:bg-brand-lightBlue text-brand-darkBlue font-medium min-w-[160px] justify-between shadow-sm transition-all">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-brand-blue" />
                  <span className="text-sm capitalize">{filterType}</span>
                </div>
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-brand-blue/10 rounded-2xl shadow-2xl z-20 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                 {types.map(t => (
                   <button 
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`w-full text-left px-6 py-3 text-sm hover:bg-brand-lightBlue transition-colors capitalize ${filterType === t ? 'font-bold text-brand-blue bg-brand-lightBlue/50' : 'text-gray-600'}`}
                   >
                      {t}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-12">
        {filteredDocs.length === 0 ? (
            <div className="text-center py-32">
                <div className="w-24 h-24 bg-brand-lightBlue/30 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-blue/10">
                    <FileText size={40} className="text-brand-blue/20" />
                </div>
                <h3 className="text-brand-darkBlue font-medium text-2xl font-serif">No documents found</h3>
                <p className="text-gray-500 mt-2 font-light">Try adjusting your search or upload a new file.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDocs.map(doc => (
                    <div key={doc.id} className="bg-white p-8 rounded-3xl border border-brand-blue/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-brand-blue/20 transition-all group flex flex-col h-full relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 rounded-2xl bg-brand-lightBlue/30 group-hover:bg-brand-lightBlue border border-brand-blue/5 group-hover:shadow-sm transition-all">
                                {getFileIcon(doc.format)}
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-300 hover:text-brand-blue hover:bg-brand-lightBlue/50 rounded-xl transition-all">
                                    <Download size={18} />
                                </button>
                                <button 
                                    onClick={() => onDeleteDocument(doc.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="font-serif font-medium text-brand-darkBlue text-xl mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">
                            {doc.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-brand-gray text-brand-darkBlue/40 border border-brand-blue/5">
                                {doc.type}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-brand-lightBlue/50 text-brand-blue border border-brand-blue/5">
                                {doc.format} • {doc.size}
                            </span>
                        </div>

                        {doc.linkedPartNumber && (
                            <div className="mb-6 p-3 bg-brand-gray/50 rounded-2xl border border-brand-blue/5 flex items-center gap-3">
                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Linked Part</div>
                                    <div className="text-xs font-mono font-bold text-brand-blue truncate">{doc.linkedPartNumber}</div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-1.5 mb-8">
                            {doc.tags.map(tag => (
                                <div key={tag} className="flex items-center gap-1 px-2 py-1 bg-brand-orange/5 text-brand-orange rounded-lg text-[10px] font-bold border border-brand-orange/10 uppercase tracking-tight">
                                    <Tag size={10} />
                                    {tag}
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-brand-blue/5 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <Clock size={12} />
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                            </div>
                            <button className="flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-darkBlue transition-colors">
                                View File <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
