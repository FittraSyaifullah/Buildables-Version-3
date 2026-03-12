import React, { useState } from 'react';
import { Package, Database, FileText, Search, Plus, Settings, ChevronRight } from 'lucide-react';
import { PartsLibrary } from './PartsLibrary';
import { SavedBomsView } from './SavedBomsView';
import { DocumentCenter } from './DocumentCenter';
import { LibraryPart, SavedBom, LibraryDocument } from '../types';

interface WorkspaceProps {
  // Parts Library Props
  parts: LibraryPart[];
  onViewPart: (part: LibraryPart) => void;
  onToggleFavorite: (partId: string) => void;
  onAddComponent: () => void;
  
  // Saved BOMs Props
  savedBoms: SavedBom[];
  onOpenBom: (bom: SavedBom) => void;
  onDeleteBom: (id: string) => void;
  
  // Document Center Props
  documents: LibraryDocument[];
  onDeleteDocument: (id: string) => void;
  onUploadDocument: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  parts, onViewPart, onToggleFavorite, onAddComponent,
  savedBoms, onOpenBom, onDeleteBom,
  documents, onDeleteDocument, onUploadDocument
}) => {
  const [activeTab, setActiveTab] = useState<'parts' | 'boms' | 'documents'>('parts');

  return (
    <div className="flex h-full w-full bg-white font-sans overflow-hidden">
      {/* Left Sidebar - Claude.ai inspired */}
      <div className="w-64 border-r border-gray-200 bg-[#F9F9F8] flex flex-col flex-shrink-0">
        <div className="p-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-900">Project Knowledge</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your engineering assets</p>
        </div>
        
        <div className="p-3 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('parts')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'parts' 
                  ? 'bg-white text-brand-darkBlue shadow-sm border border-gray-200' 
                  : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package size={16} className={activeTab === 'parts' ? 'text-brand-orange' : 'text-gray-400'} />
                Parts Library
              </div>
              {activeTab === 'parts' && <ChevronRight size={14} className="text-gray-400" />}
            </button>
            
            <button
              onClick={() => setActiveTab('boms')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'boms' 
                  ? 'bg-white text-brand-darkBlue shadow-sm border border-gray-200' 
                  : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database size={16} className={activeTab === 'boms' ? 'text-brand-orange' : 'text-gray-400'} />
                Saved BOMs
              </div>
              {activeTab === 'boms' && <ChevronRight size={14} className="text-gray-400" />}
            </button>
            
            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'documents' 
                  ? 'bg-white text-brand-darkBlue shadow-sm border border-gray-200' 
                  : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className={activeTab === 'documents' ? 'text-brand-orange' : 'text-gray-400'} />
                Document Center
              </div>
              {activeTab === 'documents' && <ChevronRight size={14} className="text-gray-400" />}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-white">
        {activeTab === 'parts' && (
          <PartsLibrary 
            parts={parts}
            onViewPart={onViewPart}
            onToggleFavorite={onToggleFavorite}
            onAddComponent={onAddComponent}
            hideHeader={true}
          />
        )}
        {activeTab === 'boms' && (
          <SavedBomsView 
            boms={savedBoms}
            onOpenBom={onOpenBom}
            onDeleteBom={onDeleteBom}
            hideHeader={true}
          />
        )}
        {activeTab === 'documents' && (
          <DocumentCenter 
            documents={documents}
            onDeleteDocument={onDeleteDocument}
            onUploadDocument={onUploadDocument}
            hideHeader={true}
          />
        )}
      </div>
    </div>
  );
};
