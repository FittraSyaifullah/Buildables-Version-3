
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Send, Paperclip, ChevronRight, X, PanelRightClose, PanelRightOpen, ArrowRight, Sparkles, FileText, XCircle, Box, Cpu, Shield, Layers, List, Search, AlertTriangle, DollarSign, Eye, Scale, Calculator, Plus, Wrench, Zap, Globe, Ruler, Camera, ImageIcon } from 'lucide-react';
import { sendMessageToGemini } from './services/geminiService';
import { Message, ArtifactData, ArtifactType, UserContext, Pillar, AppSettings, ProjectSummary, ComponentDetailData, ComparisonPart, LibraryPart } from './types';
import { BomView } from './components/Artifacts/BomView';
import { CadView } from './components/Artifacts/CadView';
import { DocumentView } from './components/Artifacts/DocumentView';
import { ParametricPartView } from './components/Artifacts/ParametricPartView';
import { PartsLibrary } from './components/PartsLibrary';
import { FindSimilarModal } from './components/Modals/FindSimilarModal';
import { ComparePartsModal } from './components/Modals/ComparePartsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { Dashboard } from './components/Dashboard';
import { TutorialOverlay } from './components/TutorialOverlay';

// Mock Data for Dashboard
const MOCK_PROJECTS: ProjectSummary[] = [
    { id: '1', title: 'Gearbox Assembly v2', pillar: 'concept', lastModified: Date.now() - 3600000, preview: 'Concept generation for a high-torque planetary gearbox with 20:1 reduction ratio.' },
    { id: '2', title: 'NEMA 17 Mount Stress Analysis', pillar: 'copilot', lastModified: Date.now() - 86400000, preview: 'Reviewing FEA constraints for the new aluminium bracket design.' },
    { id: '3', title: 'Robotic Arm BOM', pillar: 'sourcing', lastModified: Date.now() - 432000000, preview: 'Sourcing list for 6-DOF arm including servos, controllers, and bearings.' },
    { id: '4', title: 'Gripper Mechanism', pillar: 'concept', lastModified: Date.now() - 500000000, preview: 'Compliant mechanism design for soft robotics gripper.' },
];

const MOCK_LIBRARY: LibraryPart[] = [
    {
        id: 'lib-1',
        partNumber: 'LM317AEMPX/NOPB',
        name: 'Adjustable Voltage Regulator',
        manufacturer: 'Texas Instruments',
        category: 'Integrated Circuits',
        description: 'IC REG LINEAR ADJ 1.5A SOT223-4',
        status: 'In Stock',
        stockCount: 145,
        location: 'Bin A-42',
        lastUsed: '2 days ago',
        specs: { "Output Voltage": "1.2V - 37V", "Current": "1.5A", "Package": "SOT-223" },
        isFavorite: true
    },
    {
        id: 'lib-2',
        partNumber: '17HS4401',
        name: 'NEMA 17 Stepper Motor',
        manufacturer: 'MotionKing',
        category: 'Actuators',
        description: 'Bipolar Stepper Motor 40mm 1.2A',
        status: 'Active',
        stockCount: 12,
        location: 'Shelf 3',
        lastUsed: '1 week ago',
        specs: { "Step Angle": "1.8°", "Holding Torque": "40Ncm", "Current": "1.2A" }
    },
    {
        id: 'lib-3',
        partNumber: 'STM32F405RGT6',
        name: 'STM32 F4 MCU',
        manufacturer: 'STMicroelectronics',
        category: 'Microcontrollers',
        description: 'ARM Cortex-M4 32b MCU+FPU, 1MB Flash',
        status: 'On Order',
        stockCount: 0,
        location: '-',
        lastUsed: '3 weeks ago',
        specs: { "Core": "ARM Cortex-M4", "Speed": "168MHz", "Flash": "1MB" }
    },
    {
        id: 'lib-4',
        partNumber: '608-2RS',
        name: 'Ball Bearing 8x22x7',
        manufacturer: 'SKF',
        category: 'Mechanical',
        description: 'Deep groove ball bearing, rubber sealed',
        status: 'In Stock',
        stockCount: 50,
        location: 'Drawer M-10',
        lastUsed: 'Yesterday',
        specs: { "ID": "8mm", "OD": "22mm", "Width": "7mm" }
    },
     {
        id: 'lib-5',
        partNumber: 'M3-10-SHCS',
        name: 'M3x10 Socket Head Cap Screw',
        manufacturer: 'Generic',
        category: 'Fasteners',
        description: 'Stainless Steel 304 M3 Bolt',
        status: 'In Stock',
        stockCount: 1200,
        location: 'Bin F-01',
        lastUsed: 'Today',
        specs: { "Thread": "M3", "Length": "10mm", "Material": "SS304" }
    }
];

// Mock Artifact for the specific request about the Gripper
const MOCK_GRIPPER_ARTIFACT: ArtifactData = {
    id: 'gripper-concept-updated',
    type: ArtifactType.CAD_CONCEPT,
    title: 'Concept: Flexible Gripper v2',
    content: {
      conceptName: "Conceptual Design for Flexible Gripper",
      description: "Updated concept incorporating a dedicated Actuator Mount for improved structural rigidity.",
      rationale: "Adding a custom actuator mount reduces play in the drive train and allows for modular motor swapping.",
      constraints: ["Material: Silicone/PLA", "Payload: 500g", "Actuation: Pneumatic/Cable"],
      components: [
         { name: "Finger Module A", category: "Soft Body", sourcing: "custom_manufactured", specs: "Silicone Shore 40A, Cast" },
         { name: "Finger Module B", category: "Soft Body", sourcing: "custom_manufactured", specs: "Silicone Shore 40A, Cast" },
         { name: "Base Manifold", category: "Structural", sourcing: "custom_manufactured", specs: "PLA+, FDM Printed" },
         { 
             name: "Actuator Mount", 
             category: "Structural", 
             sourcing: "custom_manufactured", 
             specs: "Anodized Aluminum, 5mm thickness, lightweight design",
             notes: "Newly added component"
         }
      ],
      metrics: {
         mass: "420g",
         dimensions: "120x120x150 mm",
         costEstimate: "$35.00",
         sustainabilityRating: "B"
      },
      visualStyle: "shaded"
    }
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactData | null>(null);
  const [isArtifactPanelOpen, setIsArtifactPanelOpen] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activePillar, setActivePillar] = useState<Pillar>('copilot');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  
  // Library State
  const [libraryParts, setLibraryParts] = useState<LibraryPart[]>(MOCK_LIBRARY);
  
  // Image Search State
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'chat' | 'dashboard' | 'library'>('chat');
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>({
      unitSystem: 'metric',
      standard: 'iso',
      theme: 'light',
      username: 'John Doe'
  });

  // Tools State
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);

  // Parametric Search State
  const [parametricPartForModal, setParametricPartForModal] = useState<ComponentDetailData | null>(null);
  const [comparisonData, setComparisonData] = useState<{ref: ComparisonPart, candidates: ComparisonPart[]} | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toolMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Click outside to close tool menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (toolMenuRef.current && !toolMenuRef.current.contains(event.target as Node)) {
            setIsToolMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async (text: string = input) => {
    if ((!text.trim() && attachedFiles.length === 0 && !imageAttachment) || isLoading) return;

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
    setAttachedFiles([]); 
    
    const currentImage = imageAttachment;
    setImageAttachment(null);
    
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await sendMessageToGemini(history, userMsg.text, userContext, activePillar, currentImage);

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
    setCurrentView('chat');
    
    if (id === '4') {
        const proj = MOCK_PROJECTS.find(p => p.id === id);
        if (proj) {
            setActivePillar(proj.pillar);
            setMessages([
                {
                    id: 'mock-hist-1',
                    role: 'user',
                    text: `Opening project: ${proj.title}`,
                    timestamp: Date.now() - 10000
                }, 
                {
                    id: 'mock-hist-2',
                    role: 'model',
                    text: `I've loaded the context for **${proj.title}**.`,
                    timestamp: Date.now() - 9000
                },
                {
                    id: 'mock-hist-3',
                    role: 'user',
                    text: "Update the design to include a custom Actuator Mount. It needs to be structural, made of Anodized Aluminum (5mm), and lightweight.",
                    timestamp: Date.now() - 5000
                },
                {
                    id: 'mock-hist-4',
                    role: 'model',
                    text: "I've updated the **Conceptual Design for Flexible Gripper** to include the 'Actuator Mount' with your specified requirements. You can view the updated BOM and details in the concept artifact.",
                    timestamp: Date.now(),
                    relatedArtifactId: MOCK_GRIPPER_ARTIFACT.id
                }
            ]);
            setCurrentArtifact(MOCK_GRIPPER_ARTIFACT);
            setIsArtifactPanelOpen(true);
        }
        return;
    }

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
      const mockFiles = ['datasheet_motor_v2.pdf', 'requirements.docx'];
      const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
      setAttachedFiles(prev => [...prev, randomFile]);
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              setImageAttachment(reader.result as string);
              setInput(prev => prev || "Identify this component, explain its function, and suggest 3 alternatives.");
              setIsToolMenuOpen(false);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleOnboardingComplete = (context: UserContext) => {
    setUserContext(context);
    setShowOnboarding(false);
    setShowTutorial(true);
    
    const welcomeMsg: Message = {
      id: crypto.randomUUID(),
      role: 'model',
      text: `Workspace configured for **${context.workflow}**. \nI've noted your access to ${context.resources.join(', ')} and your ${context.lifecycle} requirements. \n\nHow can I help you start your engineering task today?`,
      timestamp: Date.now()
    };
    setMessages([welcomeMsg]);
  };

  const handleOpenParametric = (partName: string) => {
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
  
  const handleViewLibraryPart = (part: LibraryPart) => {
      const detail: ComponentDetailData = {
          partNumber: part.partNumber,
          manufacturer: part.manufacturer,
          description: part.description,
          specs: part.specs,
          datasheetUrl: '#'
      };
      
      setCurrentArtifact({
          id: crypto.randomUUID(),
          type: ArtifactType.COMPONENT_DETAIL,
          title: `Library: ${part.partNumber}`,
          content: detail
      });
      setIsArtifactPanelOpen(true);
  };

  const handleToggleFavorite = (partId: string) => {
      setLibraryParts(prev => prev.map(part => 
          part.id === partId ? { ...part, isFavorite: !part.isFavorite } : part
      ));
  };

  const handleFindSimilar = (selectedParams: string[]) => {
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
          setParametricPartForModal(null); 
      }
  };

  const handleToolSelect = (toolId: string, prompt: string) => {
      if (toolId === 'img-search') {
          imageInputRef.current?.click();
      } else {
          setInput(prev => prev ? prev + " " + prompt : prompt);
          setIsToolMenuOpen(false);
      }
  };

  const renderArtifactContent = () => {
    if (!currentArtifact) return <div className="p-8 text-center text-gray-500">No artifact selected</div>;

    switch (currentArtifact.type) {
      case ArtifactType.BOM:
        return <BomView 
            data={currentArtifact.content} 
            onAction={(p) => handleSendMessage(p)} 
            onOpenParametric={handleOpenParametric} 
        />;
      case ArtifactType.CAD_CONCEPT:
        return <CadView 
            data={currentArtifact.content} 
            onAction={(p) => handleSendMessage(p)} 
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

  const tools = [
      { id: 'img-search', label: 'Visual Search', icon: <Camera size={18} />, color: 'bg-indigo-50 text-indigo-600', prompt: '' },
      { id: 'search', label: 'Web Search', icon: <Globe size={18} />, color: 'bg-blue-50 text-blue-600', prompt: 'Search the web for' },
      { id: 'calc', label: 'Calculator', icon: <Calculator size={18} />, color: 'bg-orange-50 text-orange-600', prompt: 'Calculate the' },
      { id: 'concept', label: 'Gen Concept', icon: <Box size={18} />, color: 'bg-purple-50 text-purple-600', prompt: 'Generate a CAD concept for' },
      { id: 'bom', label: 'Extract BOM', icon: <List size={18} />, color: 'bg-green-50 text-green-600', prompt: 'Extract a Bill of Materials for' },
      { id: 'specs', label: 'Verify Specs', icon: <Ruler size={18} />, color: 'bg-teal-50 text-teal-600', prompt: 'Verify the specifications for' },
      { id: 'compliance', label: 'Compliance', icon: <Shield size={18} />, color: 'bg-red-50 text-red-600', prompt: 'Check compliance requirements for' },
  ];

  const renderMainView = () => {
      if (currentView === 'dashboard') {
          return (
            <Dashboard 
                projects={MOCK_PROJECTS} 
                onOpenProject={handleOpenProject}
                onNewProject={handleNewChat}
            />
          );
      }
      
      if (currentView === 'library') {
          return (
              <PartsLibrary 
                parts={libraryParts}
                onViewPart={handleViewLibraryPart}
                onToggleFavorite={handleToggleFavorite}
              />
          );
      }

      return (
            <>
                {/* Chat Scroll Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-48">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center opacity-0 animate-fade-in" style={{animation: 'fadeIn 0.5s forwards'}}>
                        <div className="w-16 h-16 bg-white rounded-2xl mb-6 flex items-center justify-center shadow-sm border border-brand-blue/10">
                            <span className="font-serif text-3xl font-bold text-brand-blue">B</span>
                        </div>
                        <h1 className="font-serif font-medium text-3xl text-brand-darkBlue mb-4">
                            {activePillar === 'concept' ? 'Concept Formation' : 
                            activePillar === 'sourcing' ? 'Sourcing Intelligence' : 
                            'Engineering Copilot'}
                        </h1>
                        <p className="text-gray-500 mb-10 max-w-md text-lg font-light leading-relaxed">
                        {activePillar === 'concept' ? 'Describe a mechanical problem, and I will generate 3D concepts and specifications.' : 
                            activePillar === 'sourcing' ? 'Manage your supply chain, find components, and optimize your Bill of Materials.' : 
                            'Your general assistant for design reviews, calculations, and documentation.'}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                            {getEmptyStateSuggestions().map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleSendMessage(suggestion.prompt)} 
                                    className="flex items-center gap-4 p-4 bg-white border border-brand-blue/10 rounded-xl text-left transition-all hover:border-brand-blue/30 hover:shadow-md hover:-translate-y-0.5 group"
                                >
                                    <div className="p-2.5 bg-brand-lightBlue/50 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                        {suggestion.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-serif font-medium text-brand-darkBlue text-sm mb-0.5">{suggestion.heading}</div>
                                        <div className="text-xs text-gray-400 line-clamp-1">{suggestion.prompt}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-8 py-8">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-6 h-6 rounded bg-brand-blue text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1 shadow-sm">
                            B
                            </div>
                        )}
                        
                        <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {msg.role === 'user' ? (
                                <div className="bg-brand-lightBlue/50 text-brand-darkBlue px-5 py-3 rounded-2xl rounded-tr-sm text-[16px] leading-relaxed font-serif tracking-tight shadow-sm border border-brand-blue/10">
                                    {msg.text}
                                </div>
                            ) : (
                                <div className="text-brand-darkBlue px-1 py-1 text-[15px] leading-relaxed">
                                    {msg.text.split('\n').map((line, i) => (
                                        <p key={i} className="mb-3 last:mb-0">{line}</p>
                                    ))}
                                    {msg.relatedArtifactId && (
                                        <button 
                                            onClick={() => setIsArtifactPanelOpen(true)}
                                            className="mt-3 flex items-center gap-2 text-xs font-bold text-brand-orange hover:text-orange-600 bg-brand-orange/10 px-3 py-2 rounded-lg border border-brand-orange/20 transition-colors"
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
                            <div className="w-6 h-6 rounded bg-brand-blue text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1 shadow-sm">B</div>
                            <div className="flex items-center gap-1 mt-3">
                                <div className="w-2 h-2 bg-brand-blue/30 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 bg-brand-blue/30 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-brand-blue/30 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                    </div>
                )}
                </div>

                {/* Floating Input Area (Claude Style) */}
                <div className="absolute bottom-6 left-0 right-0 px-4 z-20 pointer-events-none">
                    <div className="max-w-3xl mx-auto pointer-events-auto">
                        {/* Tool Menu Popover */}
                        {isToolMenuOpen && (
                            <div ref={toolMenuRef} className="absolute bottom-full left-0 mb-4 w-72 bg-white rounded-2xl shadow-2xl border border-brand-blue/10 overflow-hidden animate-in slide-in-from-bottom-2 zoom-in-95 duration-200 z-50">
                                <div className="p-3 border-b border-gray-100 bg-brand-lightBlue/30 text-[10px] font-bold text-brand-darkBlue/50 uppercase tracking-wider">
                                    Engineering Tools
                                </div>
                                <div className="p-2 grid grid-cols-2 gap-2">
                                    {tools.map((tool) => (
                                        <button 
                                            key={tool.id}
                                            onClick={() => handleToolSelect(tool.id, tool.prompt)}
                                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-brand-lightBlue/20 transition-colors text-center group"
                                        >
                                            <div className={`p-2 rounded-lg ${tool.color} group-hover:scale-110 transition-transform`}>
                                                {tool.icon}
                                            </div>
                                            <span className="text-xs font-medium text-gray-600">{tool.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-blue/10 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-brand-blue/10 focus-within:border-brand-blue/30 relative">
                             {/* Attachments Area */}
                            {(attachedFiles.length > 0 || imageAttachment) && (
                                <div className="flex gap-2 p-3 pb-0 overflow-x-auto">
                                    {attachedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-brand-lightBlue/30 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 animate-in fade-in zoom-in duration-200 border border-brand-blue/10">
                                            <FileText size={12} className="text-brand-blue/50" />
                                            {file}
                                            <button onClick={() => setAttachedFiles(prev => prev.filter(f => f !== file))} className="text-gray-400 hover:text-red-500">
                                                <XCircle size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {imageAttachment && (
                                        <div className="relative group animate-in fade-in zoom-in duration-200">
                                            <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={imageAttachment} alt="Attached" className="h-full w-full object-cover" />
                                            </div>
                                            <button 
                                                onClick={() => setImageAttachment(null)} 
                                                className="absolute -top-1 -right-1 bg-white text-gray-500 hover:text-red-500 rounded-full p-0.5 shadow-sm border border-gray-200"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-end p-2">
                                <button 
                                    onClick={() => setIsToolMenuOpen(!isToolMenuOpen)}
                                    className={`p-2.5 rounded-xl transition-all mr-2 flex-shrink-0 ${isToolMenuOpen ? 'bg-brand-lightBlue text-brand-blue rotate-45' : 'text-gray-400 hover:bg-brand-lightBlue/50 hover:text-brand-blue'}`}
                                    title="Add Tool / Action"
                                >
                                    <Plus size={20} />
                                </button>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Ask ${activePillar === 'concept' ? 'Concept Formation' : activePillar === 'sourcing' ? 'Sourcing' : 'Copilot'}...`}
                                    className="w-full max-h-40 py-3 px-2 resize-none outline-none text-[16px] bg-transparent custom-scrollbar text-brand-darkBlue placeholder-brand-darkBlue/30 font-serif leading-relaxed"
                                    rows={1}
                                    style={{ minHeight: '52px' }}
                                />
                                
                                <div className="flex items-center gap-2 pb-1.5 pl-2">
                                    <button 
                                        onClick={handleFileUpload}
                                        className="p-2 text-gray-400 hover:text-brand-blue rounded-lg hover:bg-brand-lightBlue/30 transition-colors"
                                        title="Attach Context"
                                    >
                                        <Paperclip size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleSendMessage()}
                                        disabled={(!input.trim() && attachedFiles.length === 0 && !imageAttachment) || isLoading}
                                        className={`p-2 rounded-lg transition-all duration-200 ${input.trim() || attachedFiles.length > 0 || imageAttachment ? 'bg-brand-orange text-white shadow-md hover:bg-orange-400' : 'bg-brand-lightBlue/50 text-brand-blue/30'}`}
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-gray-400 mt-3 font-medium tracking-wide">Buildables v3 can make mistakes. Verify component specs.</p>
                    </div>
                </div>
            </>
      );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-brand-gray text-brand-darkBlue font-sans selection:bg-brand-orange/20">
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      {showTutorial && <TutorialOverlay onComplete={() => setShowTutorial(false)} />}
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        currentSettings={appSettings}
        onSave={setAppSettings}
      />
      
      {/* Hidden File Inputs */}
      <input type="file" ref={fileInputRef} className="hidden" />
      <input 
        type="file" 
        ref={imageInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleImageSelect}
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
        onOpenLibrary={() => setCurrentView('library')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        recentProjects={MOCK_PROJECTS}
        onOpenProject={handleOpenProject}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 relative ${isArtifactPanelOpen && currentView !== 'dashboard' && currentView !== 'library' ? 'w-1/2' : 'w-full'} ${currentView !== 'chat' && isArtifactPanelOpen ? 'md:pr-[45%]' : ''}`}>
        
        {/* Mobile Header */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 md:hidden flex-shrink-0 bg-white">
            <span className="font-bold text-brand-darkBlue">Buildables v3</span>
        </div>

        {renderMainView()}

      </div>

      {/* Right Artifact Panel */}
      {isArtifactPanelOpen && (
        <div className={`fixed right-0 top-0 bottom-0 z-30 w-full md:w-[45%] h-full border-l border-gray-200 bg-white shadow-[-5px_0_30px_rgba(0,0,0,0.02)] flex flex-col animate-slide-in-right transform transition-transform duration-300`}>
          <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5 rounded">
                    {currentArtifact?.type || 'ARTIFACT'}
                </span>
                <span className="text-sm font-bold text-brand-darkBlue truncate max-w-[200px] font-serif">
                    {currentArtifact?.title}
                </span>
            </div>
            <div className="flex items-center gap-1">
                 <button onClick={() => setIsArtifactPanelOpen(false)} className="p-2 text-gray-400 hover:text-brand-darkBlue hover:bg-gray-50 rounded-lg transition-colors" title="Close Panel">
                    <PanelRightClose size={18} />
                 </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            {renderArtifactContent()}
          </div>
        </div>
      )}
      
      {/* Toggle Button for panel if closed but artifact exists */}
      {!isArtifactPanelOpen && currentArtifact && (
          <div className="absolute top-6 right-6 z-20">
              <button 
                onClick={() => setIsArtifactPanelOpen(true)}
                className="bg-white border border-gray-200 shadow-lg p-2.5 rounded-xl text-gray-500 hover:text-brand-blue hover:border-brand-blue transition-all"
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
