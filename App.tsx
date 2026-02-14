import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Send, Paperclip, ChevronRight, X, PanelRightClose, PanelRightOpen, ArrowRight, Sparkles, FileText, XCircle, Box, Cpu, Shield, Layers, List, Search, AlertTriangle, DollarSign, Eye, Scale, Calculator } from 'lucide-react';
import { sendMessageToGemini } from './services/geminiService';
import { Message, ArtifactData, ArtifactType, UserContext, Pillar, AppSettings, ProjectSummary, ComponentDetailData, ComparisonPart } from './types';
import { BomView } from './components/Artifacts/BomView';
import { CadView } from './components/Artifacts/CadView';
import { DocumentView } from './components/Artifacts/DocumentView';
import { ParametricPartView } from './components/Artifacts/ParametricPartView';
import { FindSimilarModal } from './components/Modals/FindSimilarModal';
import { ComparePartsModal } from './components/Modals/ComparePartsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { Dashboard } from './components/Dashboard';

// Mock Data for Dashboard
const MOCK_PROJECTS: ProjectSummary[] = [
    { id: '1', title: 'Gearbox Assembly v2', pillar: 'concept', lastModified: Date.now() - 3600000, preview: 'Concept generation for a high-torque planetary gearbox with 20:1 reduction ratio.' },
    { id: '2', title: 'NEMA 17 Mount Stress Analysis', pillar: 'copilot', lastModified: Date.now() - 86400000, preview: 'Reviewing FEA constraints for the new aluminium bracket design.' },
    { id: '3', title: 'Robotic Arm BOM', pillar: 'sourcing', lastModified: Date.now() - 432000000, preview: 'Sourcing list for 6-DOF arm including servos, controllers, and bearings.' },
    { id: '4', title: 'Gripper Mechanism', pillar: 'concept', lastModified: Date.now() - 500000000, preview: 'Compliant mechanism design for soft robotics gripper.' },
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactData | null>(null);
  const [isArtifactPanelOpen, setIsArtifactPanelOpen] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activePillar, setActivePillar] = useState<Pillar>('copilot');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'chat' | 'dashboard'>('chat');
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>({
      unitSystem: 'metric',
      standard: 'iso',
      theme: 'light',
      username: 'John Doe'
  });

  // Parametric Search State
  const [parametricPartForModal, setParametricPartForModal] = useState<ComponentDetailData | null>(null);
  const [comparisonData, setComparisonData] = useState<{ref: ComparisonPart, candidates: ComparisonPart[]} | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string = input) => {
    if ((!text.trim() && attachedFiles.length === 0) || isLoading) return;

    let fullText = text;
    if (attachedFiles.length > 0) {
        fullText += `\n\n[Attached Context Files: ${attachedFiles.join(', ')}]`;
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: fullText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFiles([]); // Clear attachments
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Pass userContext to the service
    const response = await sendMessageToGemini(history, userMsg.text, userContext, activePillar);

    const modelMsg: Message = {
      id: crypto.randomUUID(),
      role: 'model',
      text: response.text,
      timestamp: Date.now(),
      relatedArtifactId: response.artifact?.id
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);

    if (response.artifact) {
      setCurrentArtifact(response.artifact);
      setIsArtifactPanelOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = (pillar: Pillar = 'copilot') => {
    setActivePillar(pillar);
    setMessages([]);
    setCurrentArtifact(null);
    setIsArtifactPanelOpen(false);
    setCurrentView('chat');
  };

  const handleOpenProject = (id: string) => {
    // In a real app, load project data here
    setCurrentView('chat');
    // Just simulating a load
    const proj = MOCK_PROJECTS.find(p => p.id === id);
    if(proj) {
        setActivePillar(proj.pillar);
        setMessages([{
            id: 'mock-load',
            role: 'user',
            text: `Opening project: ${proj.title}`,
            timestamp: Date.now()
        }, {
            id: 'mock-load-response',
            role: 'model',
            text: `I've loaded the context for **${proj.title}**. We were discussing ${proj.preview}`,
            timestamp: Date.now()
        }]);
    }
  };

  const handleFileUpload = () => {
      // Mock file upload
      const mockFiles = ['datasheet_motor_v2.pdf', 'requirements.docx'];
      const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
      setAttachedFiles(prev => [...prev, randomFile]);
  };

  const handleOnboardingComplete = (context: UserContext) => {
    setUserContext(context);
    setShowOnboarding(false);
    
    // Optional: Add a system welcome message based on context
    const welcomeMsg: Message = {
      id: crypto.randomUUID(),
      role: 'model',
      text: `Workspace configured for **${context.workflow}**. \nI've noted your access to ${context.resources.join(', ')} and your ${context.lifecycle} requirements. \n\nHow can I help you start your engineering task today?`,
      timestamp: Date.now()
    };
    setMessages([welcomeMsg]);
  };

  // Mock function to load parametric data
  const handleOpenParametric = (partName: string) => {
      // In production, this would fetch from a parts database
      const mockParametricData: ComponentDetailData = {
          partNumber: "LM317AEMPX/NOPB",
          manufacturer: "Texas Instruments",
          description: "IC REG LINEAR ADJ 1.5A SOT223-4",
          datasheetUrl: "#",
          specs: {
              "Accuracy (%)": "±1",
              "Junction to Ambient": "140°C/W(Typ)",
              "Junction to Case": "23.5°C/W(Typ)",
              "Line Regulation": "0.01%/V",
              "Load Regulation": "0.5%",
              "Maximum Input Voltage (V)": "40",
              "Maximum Operating Temperature (°C)": "125",
              "Maximum Output Current (A)": "1.5",
              "Maximum Storage Temperature (°C)": "150",
              "Minimum Input Voltage (V)": "4.2",
              "Minimum Operating Temperature (°C)": "-40",
              "Minimum Storage Temperature (°C)": "-65",
              "Number of Outputs": "1",
              "Output Type": "Adjustable",
              "Output Voltage (V)": "1.2 to 37",
              "Polarity": "Positive",
              "Reference Voltage (V)": "1.262",
              "Special Features": "Current Limit | Safe Area Protection",
              "Type": "Standard",
              "Typical Output Noise Voltage (uVrms)": "38",
              "Typical PSRR (dB)": "80",
              "Typical Quiescent Current (mA)": "0.05"
          }
      };

      setCurrentArtifact({
          id: crypto.randomUUID(),
          type: ArtifactType.COMPONENT_DETAIL,
          title: `Datasheet: ${partName}`,
          content: mockParametricData
      });
      setIsArtifactPanelOpen(true);
  };

  const handleFindSimilar = (selectedParams: string[]) => {
      // Mock finding similar parts
      if (currentArtifact?.type === ArtifactType.COMPONENT_DETAIL) {
          const ref = currentArtifact.content as ComponentDetailData;
          const refPart: ComparisonPart = {
              id: 'ref',
              partNumber: ref.partNumber,
              manufacturer: ref.manufacturer,
              specs: ref.specs,
              isReference: true
          };

          const candidates: ComparisonPart[] = [
              {
                  id: 'c1',
                  partNumber: 'MC78M15CDTG',
                  manufacturer: 'Onsemi',
                  specs: { ...ref.specs, "Maximum Output Current (A)": "0.5", "Accuracy (%)": "±4" }
              },
              {
                  id: 'c2',
                  partNumber: 'LM140LAH-15',
                  manufacturer: 'Texas Instruments',
                  specs: { ...ref.specs, "Maximum Operating Temperature (°C)": "100", "Load Regulation": "1.0%" }
              }
          ];

          setComparisonData({ ref: refPart, candidates });
          setParametricPartForModal(null); // Close the find modal
      }
  };

  const renderArtifactContent = () => {
    if (!currentArtifact) return <div className="p-8 text-center text-gray-500">No artifact selected</div>;

    switch (currentArtifact.type) {
      case ArtifactType.BOM:
        return <BomView 
            data={currentArtifact.content} 
            onAction={handleSendMessage} 
            onOpenParametric={handleOpenParametric} 
        />;
      case ArtifactType.CAD_CONCEPT:
        return <CadView 
            data={currentArtifact.content} 
            onAction={handleSendMessage} 
            onOpenParametric={handleOpenParametric}
        />;
      case ArtifactType.COMPONENT_DETAIL:
        return <ParametricPartView 
            data={currentArtifact.content} 
            onFindSimilar={() => setParametricPartForModal(currentArtifact.content)} 
        />;
      case ArtifactType.DOCUMENT:
      case ArtifactType.REVIEW_NOTE:
        return <DocumentView data={currentArtifact.content} />;
      default:
        return <div className="p-4">Unknown Artifact Type</div>;
    }
  };

  const getEmptyStateSuggestions = () => {
    switch (activePillar) {
      case 'concept':
        return [
          { 
              heading: "Heavy-duty Camera Mount", 
              prompt: "Create a CAD concept for a heavy-duty camera mount focused on vibration dampening.", 
              icon: <Box size={20}/> 
          },
          { 
              heading: "Compliant Gripper", 
              prompt: "Design a compliant mechanism for a soft robotics gripper.", 
              icon: <Cpu size={20}/> 
          },
          { 
              heading: "Waterproof Enclosure", 
              prompt: "Generate a concept for an IP67 water-resistant electronics enclosure.", 
              icon: <Shield size={20}/> 
          },
          { 
              heading: "Sheet Metal Bracket", 
              prompt: "Design a mounting bracket for a NEMA 17 stepper motor optimized for sheet metal fabrication.", 
              icon: <Layers size={20}/> 
          }
        ];
      case 'sourcing':
        return [
          { 
              heading: "Robotic Arm BOM", 
              prompt: "Draft a Bill of Materials for a 6-DOF robotic arm including servos, bearings, and fasteners.", 
              icon: <List size={20}/> 
          },
          { 
              heading: "Find Alternatives", 
              prompt: "Find in-stock alternatives for the STM32F405 microcontroller with matching footprint.", 
              icon: <Search size={20}/> 
          },
          { 
              heading: "Supply Chain Risk", 
              prompt: "Identify potential long lead-time components in a standard drone ESC design.", 
              icon: <AlertTriangle size={20}/> 
          },
          { 
              heading: "Cost Estimation", 
              prompt: "Estimate the production cost breakdown for 500 units of a Bluetooth LE beacon.", 
              icon: <DollarSign size={20}/> 
          }
        ];
      case 'copilot':
      default:
        return [
          { 
              heading: "Design Review", 
              prompt: "Review design assumptions for a high-temperature sensor enclosure.", 
              icon: <Eye size={20}/> 
          },
          { 
              heading: "Material Comparison", 
              prompt: "Explain the trade-offs between Aluminum 6061-T6 and 7075-T6 for aerospace brackets.", 
              icon: <Scale size={20}/> 
          },
          { 
              heading: "ISO Compliance", 
              prompt: "Summarize the key documentation requirements for ISO 13485 medical device compliance.", 
              icon: <FileText size={20}/> 
          },
          { 
              heading: "Torque Calculation", 
              prompt: "Calculate the required motor torque to lift a 5kg load using a 20mm radius pulley.", 
              icon: <Calculator size={20}/> 
          }
        ];
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-brand-darkBlue font-sans">
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        currentSettings={appSettings}
        onSave={setAppSettings}
      />
      
      {/* Modals for Parametric Search Flow */}
      {parametricPartForModal && (
          <FindSimilarModal 
            part={parametricPartForModal} 
            onClose={() => setParametricPartForModal(null)}
            onFind={handleFindSimilar}
          />
      )}

      {comparisonData && (
          <ComparePartsModal 
            referencePart={comparisonData.ref}
            candidates={comparisonData.candidates}
            onClose={() => setComparisonData(null)}
          />
      )}
      
      <Sidebar 
        onNewChat={() => handleNewChat(activePillar)} 
        activePillar={activePillar}
        onPillarChange={(p) => { setActivePillar(p); setCurrentView('chat'); }}
        activeView={currentView}
        onOpenDashboard={() => setCurrentView('dashboard')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        recentProjects={MOCK_PROJECTS}
        onOpenProject={handleOpenProject}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 relative ${isArtifactPanelOpen && currentView === 'chat' ? 'w-1/2' : 'w-full'}`}>
        
        {/* Mobile Header */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 md:hidden flex-shrink-0">
            <span className="font-bold text-brand-blue">Buildables v3</span>
        </div>

        {currentView === 'dashboard' ? (
            <Dashboard 
                projects={MOCK_PROJECTS} 
                onOpenProject={handleOpenProject}
                onNewProject={handleNewChat}
            />
        ) : (
            <>
                {/* Chat Scroll Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-24">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center opacity-0 animate-fade-in" style={{animation: 'fadeIn 0.5s forwards'}}>
                        <div className="w-16 h-16 bg-brand-lightBlue rounded-2xl mb-6 flex items-center justify-center">
                            <span className="font-sans text-3xl font-bold text-brand-blue">B</span>
                        </div>
                        <h1 className="font-bold text-3xl text-brand-darkBlue mb-3">
                            {activePillar === 'concept' ? 'Concept Formation' : 
                            activePillar === 'sourcing' ? 'Sourcing Intelligence' : 
                            'Engineering Copilot'}
                        </h1>
                        <p className="text-gray-500 mb-8 max-w-md text-lg">
                        {activePillar === 'concept' ? 'Describe a mechanical problem, and I will generate 3D concepts and specifications.' : 
                            activePillar === 'sourcing' ? 'Manage your supply chain, find components, and optimize your Bill of Materials.' : 
                            'Your general assistant for design reviews, calculations, and documentation.'}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                            {getEmptyStateSuggestions().map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleSendMessage(suggestion.prompt)} 
                                    className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl text-left transition-all hover:border-brand-blue hover:bg-brand-lightBlue/30 hover:shadow-sm group"
                                >
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500 group-hover:bg-white group-hover:text-brand-blue transition-colors mt-1">
                                        {suggestion.icon}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-brand-darkBlue text-sm mb-1 group-hover:text-brand-blue">{suggestion.heading}</div>
                                        <div className="text-xs text-gray-500 leading-snug line-clamp-2">{suggestion.prompt}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-6 py-8">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">
                            B
                            </div>
                        )}
                        
                        <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {msg.role === 'user' ? (
                                <div className="bg-brand-lightBlue text-brand-darkBlue px-5 py-3 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed border border-blue-100 whitespace-pre-wrap">
                                    {msg.text}
                                </div>
                            ) : (
                                <div className="text-brand-darkBlue px-1 py-1 text-[15px] leading-relaxed">
                                    {msg.text.split('\n').map((line, i) => (
                                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                                    ))}
                                    {msg.relatedArtifactId && (
                                        <button 
                                            onClick={() => setIsArtifactPanelOpen(true)}
                                            className="mt-3 flex items-center gap-2 text-xs font-bold text-brand-orange hover:text-orange-700 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100 transition-colors"
                                        >
                                            <PanelRightOpen size={14} />
                                            View Generated Artifact
                                            <ArrowRight size={12} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">B</div>
                            <div className="flex items-center gap-1 mt-3">
                                <div className="w-2 h-2 bg-brand-blue/40 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 bg-brand-blue/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-brand-blue/40 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                    </div>
                )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white sticky bottom-0 z-10">
                    <div className="max-w-3xl mx-auto bg-white border border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-brand-blue/20 focus-within:border-brand-blue transition-all overflow-hidden flex flex-col">
                        {/* File Attachments Area */}
                        {attachedFiles.length > 0 && (
                            <div className="flex gap-2 p-3 pb-0 overflow-x-auto">
                                {attachedFiles.map((file, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 animate-in fade-in zoom-in duration-200">
                                        <FileText size={12} className="text-brand-blue" />
                                        {file}
                                        <button onClick={() => setAttachedFiles(prev => prev.filter(f => f !== file))} className="text-gray-400 hover:text-red-500">
                                            <XCircle size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Ask ${activePillar === 'concept' ? 'Concept Formation' : activePillar === 'sourcing' ? 'Sourcing' : 'Copilot'}...`}
                        className="w-full max-h-40 p-4 resize-none outline-none text-base bg-transparent custom-scrollbar text-brand-darkBlue placeholder-gray-400"
                        rows={1}
                        style={{ minHeight: '60px' }}
                        />
                        <div className="flex justify-between items-center px-3 pb-3 pt-0">
                        <button 
                            onClick={handleFileUpload}
                            className="p-2 text-gray-400 hover:text-brand-blue rounded-lg hover:bg-brand-lightBlue transition-colors"
                            title="Attach Context (Datasheet, Spec, etc.)"
                        >
                            <Paperclip size={18} />
                        </button>
                        <button 
                            onClick={() => handleSendMessage()}
                            disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
                            className={`p-2 rounded-lg transition-all duration-200 ${input.trim() || attachedFiles.length > 0 ? 'bg-brand-blue text-white shadow-md hover:bg-blue-700' : 'bg-gray-100 text-gray-400'}`}
                        >
                            <Send size={18} />
                        </button>
                        </div>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-2">Buildables v3 can make mistakes. Verify component specs.</p>
                </div>
            </>
        )}

      </div>

      {/* Right Artifact Panel */}
      {isArtifactPanelOpen && currentView === 'chat' && (
        <div className="w-[45%] h-full border-l border-gray-200 bg-white shadow-xl flex flex-col animate-slide-in-right transform transition-transform duration-300">
          <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4 bg-brand-gray flex-shrink-0">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-lightBlue px-2 py-0.5 rounded">
                    {currentArtifact?.type || 'ARTIFACT'}
                </span>
                <span className="text-sm font-bold text-brand-darkBlue truncate max-w-[200px]">
                    {currentArtifact?.title}
                </span>
            </div>
            <div className="flex items-center gap-1">
                 <button onClick={() => setIsArtifactPanelOpen(false)} className="p-2 text-gray-400 hover:text-brand-darkBlue hover:bg-gray-100 rounded">
                    <PanelRightClose size={18} />
                 </button>
                 <button onClick={() => setIsArtifactPanelOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                    <X size={18} />
                 </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            {renderArtifactContent()}
          </div>
        </div>
      )}
      
      {/* Toggle Button for panel if closed but artifact exists */}
      {!isArtifactPanelOpen && currentArtifact && currentView === 'chat' && (
          <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setIsArtifactPanelOpen(true)}
                className="bg-white border border-gray-200 shadow-lg p-2 rounded-lg text-brand-blue hover:bg-brand-lightBlue transition-all"
              >
                  <PanelRightOpen size={20} />
              </button>
          </div>
      )}

      {/* CSS Animation for fade-in */}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;