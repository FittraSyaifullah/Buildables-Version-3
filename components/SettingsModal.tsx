import React, { useState } from 'react';
import { X, Save, Ruler, User } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave }) => {
  const [settings, setSettings] = useState(currentSettings);
  const [activeTab, setActiveTab] = useState('standards');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
           <h2 className="font-bold text-lg text-brand-darkBlue">Settings</h2>
           <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded"><X size={20}/></button>
        </div>
        
        <div className="flex border-b border-gray-100">
            <button onClick={() => setActiveTab('general')} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'general' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500'}`}>General</button>
            <button onClick={() => setActiveTab('standards')} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'standards' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500'}`}>Standards</button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
            {activeTab === 'general' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-brand-blue/20">
                            <User size={18} className="text-gray-400"/>
                            <input 
                                type="text" 
                                value={settings.username} 
                                onChange={(e) => setSettings({...settings, username: e.target.value})}
                                className="flex-1 outline-none text-sm text-brand-darkBlue" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                         <div className="grid grid-cols-3 gap-2">
                            {['light', 'dark', 'system'].map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => setSettings({...settings, theme: theme as any})}
                                    className={`px-3 py-2 rounded-lg border text-sm capitalize ${settings.theme === theme ? 'border-brand-blue bg-brand-lightBlue text-brand-blue' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {theme}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'standards' && (
                <div className="space-y-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit System</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSettings({...settings, unitSystem: 'metric'})}
                                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${settings.unitSystem === 'metric' ? 'border-brand-blue bg-brand-lightBlue ring-1 ring-brand-blue' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className={`p-2 rounded ${settings.unitSystem === 'metric' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}><Ruler size={18}/></div>
                                <div>
                                    <div className="font-medium text-sm text-brand-darkBlue">Metric</div>
                                    <div className="text-xs text-gray-500">mm, kg, °C</div>
                                </div>
                            </button>
                             <button
                                onClick={() => setSettings({...settings, unitSystem: 'imperial'})}
                                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${settings.unitSystem === 'imperial' ? 'border-brand-blue bg-brand-lightBlue ring-1 ring-brand-blue' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className={`p-2 rounded ${settings.unitSystem === 'imperial' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}><Ruler size={18}/></div>
                                <div>
                                    <div className="font-medium text-sm text-brand-darkBlue">Imperial</div>
                                    <div className="text-xs text-gray-500">in, lb, °F</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Drawing Standards</label>
                        <select 
                            value={settings.standard}
                            onChange={(e) => setSettings({...settings, standard: e.target.value as any})}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm text-brand-darkBlue outline-none focus:ring-2 focus:ring-brand-blue/20"
                        >
                            <option value="iso">ISO (International)</option>
                            <option value="asme">ASME Y14.5 (USA)</option>
                            <option value="ansi">ANSI</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">This controls how generating drawings and GD&T concepts are formatted.</p>
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={() => { onSave(settings); onClose(); }} className="px-4 py-2 text-sm bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue flex items-center gap-2">
                <Save size={16} /> Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}