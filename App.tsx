
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Send, Paperclip, ChevronRight, X, PanelRightClose, PanelRightOpen, ArrowRight, Sparkles, FileText, XCircle, Box, Cpu, Shield, Layers, List, Search, AlertTriangle, DollarSign, Eye, Scale, Calculator, Plus, Wrench, Zap, Globe, Ruler, Camera, ImageIcon } from 'lucide-react';
import { sendMessageToGemini } from './services/geminiService';
import { Message, ArtifactData, ArtifactType, UserContext, Pillar, AppSettings, ProjectSummary, ComponentDetailData, ComparisonPart, LibraryPart, SavedBom, LibraryDocument } from './types';
import { BomView } from './components/Artifacts/BomView';
import { CadView } from './components/Artifacts/CadView';
import { DocumentView } from './components/Artifacts/DocumentView';
import { ParametricPartView } from './components/Artifacts/ParametricPartView';
import { PartsLibrary } from './components/PartsLibrary';
import { FindSimilarModal } from './components/Modals/FindSimilarModal';
import { ComparePartsModal } from './components/Modals/ComparePartsModal';
import { AddComponentModal } from './components/Modals/AddComponentModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { Dashboard } from './components/Dashboard';
import { TutorialOverlay } from './components/TutorialOverlay';
import { SavedBomsView } from './components/SavedBomsView';
import { DocumentCenter } from './components/DocumentCenter';
import { Workspace } from './components/Workspace';
import Markdown from 'react-markdown';

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

const MOCK_DOCUMENTS: LibraryDocument[] = [
    {
        id: 'doc-1',
        title: 'LM317 Datasheet - Texas Instruments',
        type: 'datasheet',
        format: 'PDF',
        size: '1.2 MB',
        uploadedAt: Date.now() - 172800000,
        tags: ['Voltage Regulator', 'TI', 'Datasheet'],
        linkedPartNumber: 'LM317AEMPX/NOPB',
        url: '#'
    },
    {
        id: 'doc-2',
        title: 'NEMA 17 User Manual',
        type: 'manual',
        format: 'PDF',
        size: '3.5 MB',
        uploadedAt: Date.now() - 604800000,
        tags: ['Stepper Motor', 'Manual', 'MotionKing'],
        linkedPartNumber: '17HS4401',
        url: '#'
    },
    {
        id: 'doc-3',
        title: 'RoHS Compliance Certificate - SKF',
        type: 'compliance',
        format: 'PDF',
        size: '450 KB',
        uploadedAt: Date.now() - 2592000000,
        tags: ['Compliance', 'RoHS', 'Mechanical'],
        linkedPartNumber: '608-2RS',
        url: '#'
    },
    {
        id: 'doc-4',
        title: 'System Architecture Report v1.2',
        type: 'report',
        format: 'PDF',
        size: '8.1 MB',
        uploadedAt: Date.now() - 86400000,
        tags: ['Architecture', 'Internal', 'Design'],
        url: '#'
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
         { 
             name: "Finger Module A", 
             category: "Soft Body", 
             sourcing: "custom_manufactured", 
             specs: "Silicone Shore 40A, Cast" 
         },
         { 
             name: "Finger Module B", 
             category: "Soft Body", 
             sourcing: "custom_manufactured", 
             specs: "Silicone Shore 40A, Cast" 
         },
         { 
             name: "Base Manifold", 
             category: "Structural", 
             sourcing: "custom_manufactured", 
             specs: "PLA+, FDM Printed" 
         },
         { 
             name: "Actuator Mount", 
             category: "Structural", 
             sourcing: "off_the_shelf", 
             mpn: "ALU-MNT-40",
             supplier: "Misumi",
             unitCost: "$12.50",
             leadTime: "3 days",
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
      visualStyle: "shaded",
      threeDModel: [
        { type: "box", position: [0, 0, 0], rotation: [0, 0, 0], scale: [2, 0.5, 2], color: "#2c3e50" },
        { type: "cylinder", position: [-0.5, 0.5, 0], rotation: [0, 0, 0], scale: [0.3, 1, 0.3], color: "#e67e22" },
        { type: "cylinder", position: [0.5, 0.5, 0], rotation: [0, 0, 0], scale: [0.3, 1, 0.3], color: "#e67e22" },
        { type: "box", position: [0, 1.2, 0], rotation: [0, 0, 0], scale: [1.5, 0.4, 1.5], color: "#95a5a6" }
      ]
    }
};

const MOCK_SAVED_BOMS: SavedBom[] = [
    {
        id: 'bom-1',
        title: 'Robotic Arm Final BOM',
        projectId: '3',
        createdAt: Date.now() - 86400000 * 2,
        totalCost: 1245.50,
        items: [
            { id: '1', partNumber: '17HS4401', description: 'Stepper Motor', manufacturer: 'MotionKing', quantity: 6, unitPrice: 15.00, leadTime: '3 days', supplier: 'Direct' },
            { id: '2', partNumber: 'STM32F405', description: 'MCU', manufacturer: 'ST', quantity: 1, unitPrice: 12.00, leadTime: '5 days', supplier: 'DigiKey' }
        ]
    }
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactData | null>(null);
  const [isArtifactPanelOpen, setIsArtifactPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activePillar, setActivePillar] = useState<Pillar>('copilot');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  
  // Library State
  const [libraryParts, setLibraryParts] = useState<LibraryPart[]>(MOCK_LIBRARY);
  const [isAddLibraryPartOpen, setIsAddLibraryPartOpen] = useState(false);
  
  // BOMs State
  const [savedBoms, setSavedBoms] = useState<SavedBom[]>(MOCK_SAVED_BOMS);
  
  // Documents State
  const [libraryDocuments, setLibraryDocuments] = useState<LibraryDocument[]>(MOCK_DOCUMENTS);
  
  // Image Search State
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'chat' | 'dashboard' | 'workspace'>('chat');
  
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

    const response = await sendMessageToGemini(history, userMsg.text, userContext, currentImage);

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

  const handleNewChat = () => {
    setActivePillar('copilot'); // Keep a default for internal state if needed
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
    return [
      { 
          heading: "Concept Formation", 
          prompt: "Generate a CAD concept for a flexible robotic gripper.", 
          icon: <Box size={20}/> 
      },
      { 
          heading: "Sourcing & BOM", 
          prompt: "Turn my CAD model into a sourced, costed, and manufacturing-ready BOM.", 
          icon: <List size={20}/> 
      },
      { 
          heading: "Engineering Copilot", 
          prompt: "Review my design against industry standards and manufacturing guidelines.", 
          icon: <Cpu size={20}/> 
      },
      { 
          heading: "Document Designs", 
          prompt: "Draft and edit documentation from my designs.", 
          icon: <FileText size={20}/> 
      }
    ];
  };

  const tools = [
      { id: 'img-search', label: 'Visual Search', icon: <Camera size={18} />, color: 'bg-brand-darkBlue/10 text-brand-darkBlue', prompt: '' },
      { id: 'search', label: 'Web Search', icon: <Globe size={18} />, color: 'bg-brand-darkBlue/10 text-brand-darkBlue', prompt: 'Search the web for' },
      { id: 'calc', label: 'Calculator', icon: <Calculator size={18} />, color: 'bg-brand-orange/10 text-brand-orange', prompt: 'Calculate the' },
      { id: 'concept', label: 'Gen Concept', icon: <Box size={18} />, color: 'bg-brand-darkBlue/10 text-brand-darkBlue', prompt: 'Generate a CAD concept for' },
      { id: 'bom', label: 'Extract BOM', icon: <List size={18} />, color: 'bg-brand-orange/10 text-brand-orange', prompt: 'Extract a Bill of Materials for' },
      { id: 'specs', label: 'Verify Specs', icon: <Ruler size={18} />, color: 'bg-brand-darkBlue/10 text-brand-darkBlue', prompt: 'Verify the specifications for' },
      { id: 'compliance', label: 'Compliance', icon: <Shield size={18} />, color: 'bg-brand-orange/10 text-brand-orange', prompt: 'Check compliance requirements for' },
  ];

  const handleAddLibraryPart = (details: any) => {
    const newPart: LibraryPart = {
        id: crypto.randomUUID(),
        partNumber: details.mpn || `PN-${Math.floor(Math.random() * 10000)}`,
        name: details.name,
        manufacturer: details.supplier || 'Unknown',
        category: details.category,
        description: details.notes || '',
        status: details.sourcing === 'off_the_shelf' ? 'In Stock' : 'Prototyping',
        stockCount: 0,
        lastUsed: 'Just now',
        specs: details.specs ? { "Specs": details.specs } : {},
        isFavorite: false
    };
    setLibraryParts(prev => [newPart, ...prev]);
    setIsAddLibraryPartOpen(false);
  };

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
      
      if (currentView === 'workspace') {
          return (
              <Workspace 
                parts={libraryParts}
                onViewPart={handleViewLibraryPart}
                onToggleFavorite={handleToggleFavorite}
                onAddComponent={() => setIsAddLibraryPartOpen(true)}
                savedBoms={savedBoms}
                onOpenBom={(bom) => {
                    setCurrentArtifact({
                        id: bom.id,
                        type: ArtifactType.BOM,
                        title: bom.title,
                        content: { items: bom.items, totalCost: bom.totalCost }
                    });
                    setCurrentView('chat');
                    setIsArtifactPanelOpen(true);
                }}
                onDeleteBom={(id) => {
                    setSavedBoms(prev => prev.filter(b => b.id !== id));
                }}
                documents={libraryDocuments}
                onDeleteDocument={(id) => {
                    setLibraryDocuments(prev => prev.filter(d => d.id !== id));
                }}
                onUploadDocument={() => {
                    const newDoc: LibraryDocument = {
                        id: `doc-${Date.now()}`,
                        title: 'New Technical Specification',
                        type: 'report',
                        format: 'PDF',
                        size: '1.4 MB',
                        uploadedAt: Date.now(),
                        tags: ['New', 'Upload', 'Technical'],
                        url: '#'
                    };
                    setLibraryDocuments(prev => [newDoc, ...prev]);
                }}
              />
          );
      }

      return (
            <>
                {/* Chat Scroll Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-48">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center opacity-0 animate-fade-in px-4" style={{animation: 'fadeIn 0.5s forwards'}}>
                        <div className="w-20 h-20 bg-white rounded-full mb-8 flex items-center justify-center shadow-float border border-brand-darkBlue/5">
                            <span className="font-serif text-4xl font-bold text-brand-darkBlue tracking-tighter">B</span>
                        </div>
                        <h1 className="font-serif font-semibold text-5xl text-brand-darkBlue mb-6 tracking-tight leading-tight">
                            Buildables Workspace
                        </h1>
                        <p className="text-gray-500 mb-12 max-w-lg text-lg font-light leading-relaxed">
                            Your intelligent engineering copilot. Design concepts, source components, and run calculations with AI-powered precision.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {getEmptyStateSuggestions().map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleSendMessage(suggestion.prompt)} 
                                    className="flex items-start gap-4 p-5 bg-white border border-brand-darkBlue/5 rounded-2xl text-left transition-all duration-300 hover:border-brand-blue/30 hover:shadow-float hover:-translate-y-1 group"
                                >
                                    <div className="p-3 bg-brand-gray/50 rounded-xl text-brand-darkBlue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300 shadow-sm">
                                        {suggestion.icon}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="font-sans font-semibold text-brand-darkBlue text-sm mb-1.5 group-hover:text-brand-blue transition-colors">{suggestion.heading}</div>
                                        <div className="text-xs text-gray-500 leading-relaxed font-light">{suggestion.prompt}</div>
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
                            <div className="w-8 h-8 rounded-full bg-white border border-brand-darkBlue/10 text-brand-darkBlue flex-shrink-0 flex items-center justify-center text-sm font-serif font-bold mt-1 shadow-sm">
                            B
                            </div>
                        )}
                        
                        <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {msg.role === 'user' ? (
                                <div className="bg-brand-gray/80 text-brand-darkBlue px-5 py-3.5 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed font-sans shadow-sm border border-brand-darkBlue/5">
                                    {msg.text}
                                </div>
                            ) : (
                                <div className="text-brand-darkBlue px-1 py-1 text-[15px] leading-relaxed markdown-body">
                                    <Markdown>{msg.text}</Markdown>
                                    {msg.relatedArtifactId && (
                                        <button 
                                            onClick={() => setIsArtifactPanelOpen(true)}
                                            className="mt-4 flex items-center gap-2.5 text-xs font-semibold text-brand-darkBlue hover:text-brand-blue bg-white px-4 py-2.5 rounded-xl border border-brand-darkBlue/10 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 group"
                                        >
                                            <PanelRightOpen size={14} className="text-brand-blue" />
                                            View Generated Artifact
                                            <ArrowRight size={12} className="text-gray-400 group-hover:text-brand-blue transition-colors group-hover:translate-x-0.5" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-white border border-brand-darkBlue/10 text-brand-darkBlue flex-shrink-0 flex items-center justify-center text-sm font-serif font-bold mt-1 shadow-sm">B</div>
                            <div className="flex items-center gap-1.5 mt-4">
                                <div className="w-2 h-2 bg-brand-darkBlue/30 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 bg-brand-darkBlue/30 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-brand-darkBlue/30 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
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
                            <div ref={toolMenuRef} className="absolute bottom-full left-0 mb-4 w-72 bg-white rounded-2xl shadow-2xl border border-brand-darkBlue/10 overflow-hidden animate-in slide-in-from-bottom-2 zoom-in-95 duration-200 z-50">
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

                        <div className="bg-white rounded-3xl shadow-float border border-brand-darkBlue/5 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-brand-blue/20 focus-within:border-brand-blue/30 relative">
                             {/* Attachments Area */}
                            {(attachedFiles.length > 0 || imageAttachment) && (
                                <div className="flex gap-2 p-3 pb-0 overflow-x-auto">
                                    {attachedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-brand-lightBlue/50 px-3 py-1.5 rounded-xl text-xs font-medium text-brand-darkBlue animate-in fade-in zoom-in duration-200 border border-brand-darkBlue/5">
                                            <FileText size={12} className="text-brand-blue" />
                                            {file}
                                            <button onClick={() => setAttachedFiles(prev => prev.filter(f => f !== file))} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <XCircle size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {imageAttachment && (
                                        <div className="relative group animate-in fade-in zoom-in duration-200">
                                            <div className="h-10 w-10 rounded-xl overflow-hidden border border-brand-darkBlue/10 shadow-sm">
                                                <img src={imageAttachment} alt="Attached" className="h-full w-full object-cover" />
                                            </div>
                                            <button 
                                                onClick={() => setImageAttachment(null)} 
                                                className="absolute -top-1.5 -right-1.5 bg-white text-gray-500 hover:text-red-500 rounded-full p-0.5 shadow-sm border border-brand-darkBlue/10 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-end p-2">
                                <button 
                                    onClick={() => setIsToolMenuOpen(!isToolMenuOpen)}
                                    className={`p-2.5 rounded-2xl transition-all mr-2 flex-shrink-0 ${isToolMenuOpen ? 'bg-brand-lightBlue text-brand-blue rotate-45' : 'text-gray-400 hover:bg-brand-gray hover:text-brand-darkBlue'}`}
                                    title="Add Tool / Action"
                                >
                                    <Plus size={20} />
                                </button>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Ask Buildables to design, source, or analyze...`}
                                    className="w-full max-h-40 py-3 px-2 resize-none outline-none text-[16px] bg-transparent custom-scrollbar text-brand-darkBlue placeholder-gray-400 font-sans leading-relaxed"
                                    rows={1}
                                    style={{ minHeight: '52px' }}
                                />
                                
                                <div className="flex items-center gap-2 pb-1.5 pl-2">
                                    <button 
                                        onClick={handleFileUpload}
                                        className="p-2 text-gray-400 hover:text-brand-darkBlue rounded-xl hover:bg-brand-gray transition-colors"
                                        title="Attach Context"
                                    >
                                        <Paperclip size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleSendMessage()}
                                        disabled={(!input.trim() && attachedFiles.length === 0 && !imageAttachment) || isLoading}
                                        className={`p-2 rounded-xl transition-all duration-200 ${input.trim() || attachedFiles.length > 0 || imageAttachment ? 'bg-brand-darkBlue text-white shadow-md hover:bg-brand-blue hover:shadow-lg hover:-translate-y-0.5' : 'bg-brand-gray text-gray-400'}`}
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-[11px] text-gray-400 mt-3 font-medium tracking-wide">Buildables v3 can make mistakes. Verify component specs.</p>
                    </div>
                </div>
            </>
      );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-brand-darkBlue font-sans selection:bg-brand-orange/20">
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
      {isAddLibraryPartOpen && (
          <AddComponentModal 
            onClose={() => setIsAddLibraryPartOpen(false)}
            onAdd={handleAddLibraryPart}
            title="Add Library Component"
            submitLabel="Add to Library"
          />
      )}

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
        onNewChat={() => { handleNewChat(); setIsSidebarOpen(false); }} 
        activeView={currentView}
        onOpenDashboard={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }}
        onOpenWorkspace={() => { setCurrentView('workspace'); setIsSidebarOpen(false); }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        recentProjects={MOCK_PROJECTS}
        onOpenProject={(id) => { handleOpenProject(id); setIsSidebarOpen(false); }}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 relative ${isArtifactPanelOpen && currentView === 'chat' ? 'lg:w-1/2' : 'w-full'}`}>
        
        {/* Mobile Header */}
        <div className="h-16 border-b border-brand-darkBlue/5 flex items-center justify-between px-4 md:hidden flex-shrink-0 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-brand-darkBlue/70 hover:bg-brand-gray rounded-xl transition-colors">
                    <PanelRightOpen size={20} />
                </button>
                <span className="font-serif font-semibold text-lg text-brand-darkBlue tracking-tight">Buildables</span>
            </div>
            {currentView === 'chat' && currentArtifact && (
                <button 
                    onClick={() => setIsArtifactPanelOpen(!isArtifactPanelOpen)}
                    className={`p-2 rounded-xl transition-colors ${isArtifactPanelOpen ? 'text-brand-blue bg-brand-blue/10' : 'text-gray-400 hover:bg-brand-gray hover:text-brand-darkBlue'}`}
                >
                    <Box size={20} />
                </button>
            )}
        </div>

        {/* Desktop Sidebar Toggle (when closed) */}
        {!isSidebarOpen && (
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="hidden md:flex absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md border border-brand-darkBlue/10 shadow-float p-3 rounded-xl text-gray-500 hover:text-brand-blue hover:border-brand-blue/30 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                title="Open Sidebar"
            >
                <ChevronRight size={20} />
            </button>
        )}

        {renderMainView()}

      </div>

      {/* Right Artifact Panel */}
      {isArtifactPanelOpen && (
        <div className={`fixed right-0 top-0 bottom-0 z-30 w-full md:w-[45%] h-full border-l border-brand-darkBlue/5 bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.03)] flex flex-col animate-slide-in-right transform transition-transform duration-300`}>
          <div className="h-16 border-b border-brand-darkBlue/5 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md flex-shrink-0 z-10">
            <div className="flex items-center gap-3.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/5 border border-brand-blue/10 px-2.5 py-1 rounded-md">
                    {currentArtifact?.type || 'ARTIFACT'}
                </span>
                <span className="text-sm font-semibold text-brand-darkBlue truncate max-w-[200px] tracking-wide">
                    {currentArtifact?.title}
                </span>
            </div>
            <div className="flex items-center gap-1">
                 <button onClick={() => setIsArtifactPanelOpen(false)} className="p-2.5 text-gray-400 hover:text-brand-darkBlue hover:bg-brand-gray rounded-xl transition-all" title="Close Panel">
                    <PanelRightClose size={18} />
                 </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden relative bg-brand-gray/10">
            {renderArtifactContent()}
          </div>
        </div>
      )}
      
      {/* Toggle Button for panel if closed but artifact exists */}
      {!isArtifactPanelOpen && currentArtifact && currentView === 'chat' && (
          <div className="absolute top-6 right-6 z-20">
              <button 
                onClick={() => setIsArtifactPanelOpen(true)}
                className="bg-white/90 backdrop-blur-md border border-brand-darkBlue/10 shadow-float p-3 rounded-xl text-gray-500 hover:text-brand-blue hover:border-brand-blue/30 transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
