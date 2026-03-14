
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Send, Paperclip, ChevronRight, X, PanelRightClose, PanelRightOpen, ArrowRight, Sparkles, FileText, XCircle, Box, Cpu, Shield, Layers, List, Search, AlertTriangle, DollarSign, Eye, Scale, Calculator, Plus, Wrench, Zap, Globe, Ruler, Camera, ImageIcon, ShieldAlert } from 'lucide-react';
import { sendMessageToGemini, lintCanvas } from './services/geminiService';
import { Message, ArtifactData, ArtifactType, UserContext, Pillar, AppSettings, ProjectSummary, ComponentDetailData, ComparisonPart, LibraryPart, SavedBom, LibraryDocument, CanvasLintResult } from './types';
import { BomView } from './components/Artifacts/BomView';
import { CadView } from './components/Artifacts/CadView';
import { DocumentView } from './components/Artifacts/DocumentView';
import { ParametricPartView } from './components/Artifacts/ParametricPartView';
import { DfmValidationView } from './components/Artifacts/DfmValidationView';
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
import { useNodesState, useEdgesState, addEdge, ReactFlowProvider } from '@xyflow/react';
import { ConceptCanvas } from './components/Concept/ConceptCanvas';
import { ProposalOverlay } from './components/Concept/ProposalOverlay';
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

// Initial Concept Data
const initialConceptNodes = [
  {
    id: '1',
    type: 'concept',
    position: { x: 250, y: 5 },
    data: { 
      label: 'Main Chassis', 
      type: 'subsystem', 
      description: 'Primary structural frame for the robotic assembly.',
      status: 'validated',
      specs: {
        "Material": "AL 6061-T6",
        "Weight": "1.2kg",
        "Finish": "Anodized Black"
      },
      history: [
        { timestamp: Date.now() - 86400000, author: "John Doe", change: "Initial design draft" },
        { timestamp: Date.now() - 3600000, author: "Jane Smith", change: "Validated material specs" }
      ],
      libraryLinks: [
        { name: "Structural Frame Library", url: "#", provider: "Internal" }
      ]
    },
  },
  {
    id: '2',
    type: 'concept',
    position: { x: 100, y: 150 },
    data: { 
      label: 'Power Distribution', 
      type: 'subsystem', 
      description: 'Manages 24V and 5V rails for logic and motors.',
      status: 'draft',
      specs: {
        "Input": "24V DC",
        "Efficiency": "94%",
        "Max Current": "20A"
      },
      history: [
        { timestamp: Date.now() - 43200000, author: "John Doe", change: "Added power rail requirements" }
      ],
      libraryLinks: [
        { name: "BMS Reference Design", url: "#", provider: "Texas Instruments" }
      ]
    },
  },
  {
    id: '3',
    type: 'concept',
    position: { x: 400, y: 150 },
    data: { 
      label: 'Motor Controller', 
      type: 'concept', 
      description: 'Dual-channel brushless driver with CAN interface.',
      status: 'draft',
      renderUrl: 'https://picsum.photos/seed/motor/400/225',
      specs: {
        "Protocol": "CAN 2.0B",
        "Peak Current": "40A",
        "Voltage Range": "12-48V"
      },
      history: [
        { timestamp: Date.now() - 172800000, author: "Jane Smith", change: "Selected controller architecture" }
      ],
      libraryLinks: [
        { name: "CAN Controller Library", url: "#", provider: "Mouser" }
      ]
    },
  },
];

const initialConceptEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

const layoutNodesByCategory = (nodes: any[]) => {
  const categories = ['requirement', 'subsystem', 'component', 'constraint'];
  const columnWidth = 400;
  const rowHeight = 220;
  const padding = 80;

  // Filter out any existing group nodes to avoid duplicates and ensure nodes are valid
  const conceptNodes = nodes.filter(n => n && n.type === 'concept');
  
  const categoryMap: Record<string, any[]> = {};
  conceptNodes.forEach(node => {
    if (!node) return;
    const type = node.data?.type || 'component';
    if (!categoryMap[type]) categoryMap[type] = [];
    categoryMap[type].push(node);
  });

  const groupNodes = categories.map((cat, idx) => {
    const nodesInCat = categoryMap[cat] || [];
    const height = Math.max(1, nodesInCat.length) * rowHeight + 100;
    return {
      id: `group-${cat}`,
      type: 'group',
      data: { label: cat.charAt(0).toUpperCase() + cat.slice(1) + 's' },
      position: { x: idx * columnWidth + padding - 20, y: padding - 60 },
      style: { width: columnWidth - 40, height: height },
      draggable: true,
    };
  });

  const positionedNodes = conceptNodes.map(node => {
    if (!node) return null;
    const type = node.data?.type || 'component';
    const categoryIndex = categories.indexOf(type);
    
    const nodesInCat = categoryMap[type] || [];
    const rowIndex = nodesInCat.indexOf(node);

    return {
      ...node,
      parentId: `group-${type}`,
      extent: 'parent',
      position: {
        x: 20,
        y: rowIndex * rowHeight + 80
      }
    };
  }).filter(Boolean);

  return [...groupNodes, ...positionedNodes];
};

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
  
  // Concept Canvas State
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodesByCategory(initialConceptNodes) as any[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialConceptEdges);
  const [isConceptGenerating, setIsConceptGenerating] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState<string>('Hardware Architecture');
  const [isLinting, setIsLinting] = useState(false);
  const [lintResults, setLintResults] = useState<CanvasLintResult | null>(null);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleGenerateConceptNode = async (prompt: string) => {
    setIsConceptGenerating(true);
    setLintResults(null); // Clear previous lint results when generating
    
    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendMessageToGemini(history, prompt, userContext);
      
      // Add to messages so it's tracked in history
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        text: prompt,
        timestamp: Date.now(),
      };
      
      const modelMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: response.text,
        timestamp: Date.now(),
        relatedArtifactId: response.artifact?.id
      };

      setMessages(prev => [...prev, userMsg, modelMsg]);

      if (response.artifact && response.artifact.type === ArtifactType.CONCEPT_CANVAS) {
          if (response.artifact.title) {
            setCanvasTitle(response.artifact.title);
          }
          const { nodes: newNodes, edges: newEdges } = response.artifact.content;
          if (newNodes) {
              const processedNodes = newNodes.map((n: any) => ({
                  ...n,
                  id: n.id || crypto.randomUUID(),
                  type: 'concept',
                  data: {
                      ...n,
                      label: n.label || 'New Node',
                      type: n.type || 'component',
                      status: n.status || 'draft',
                      history: n.history || [{ timestamp: Date.now(), author: "AI Copilot", change: "Generated from canvas" }]
                  }
              }));
              setNodes(prev => {
                const nodeMap = new Map();
                prev.filter(n => n.type === 'concept').forEach(n => nodeMap.set(n.id, n));
                processedNodes.forEach(n => {
                  const existing = nodeMap.get(n.id);
                  nodeMap.set(n.id, { ...existing, ...n, data: { ...existing?.data, ...n.data } });
                });
                return layoutNodesByCategory(Array.from(nodeMap.values()));
              });
          }
          if (newEdges) {
              setEdges(prev => {
                const edgeMap = new Map();
                prev.forEach(e => edgeMap.set(e.id, e));
                newEdges.forEach((e: any) => {
                  const id = e.id || `${e.source}-${e.target}`;
                  edgeMap.set(id, { ...e, id });
                });
                return Array.from(edgeMap.values());
              });
          }
      }
    } catch (error) {
      console.error("Failed to generate concept node:", error);
    } finally {
      setIsConceptGenerating(false);
    }
  };

  const handleLintCanvas = async () => {
    if (nodes.length === 0 || isLinting) return;
    
    setIsLinting(true);
    try {
      // Prepare nodes for linting (remove internal React Flow props)
      const nodesForLint = nodes.filter(n => n.type === 'concept').map(n => ({
        id: n.id,
        label: n.data.label,
        type: n.data.type,
        description: n.data.description,
        specs: n.data.specs
      }));
      
      const edgesForLint = edges.map(e => ({
        source: e.source,
        target: e.target,
        label: (e as any).label
      }));

      const results = await lintCanvas(nodesForLint, edgesForLint, userContext);
      setLintResults(results);
      
      if (results.status === 'conflict') {
        // Add a message to the chat about the conflicts
        const modelMsg: Message = {
          id: crypto.randomUUID(),
          role: 'model',
          text: `I've analyzed your architecture and found ${results.red_wires?.length || 0} potential conflicts. Check the canvas for details.`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, modelMsg]);
      }
    } catch (error) {
      console.error("Linting failed", error);
    } finally {
      setIsLinting(false);
    }
  };

  const handleApplySuggestion = (suggestion: any) => {
    // This is a simplified implementation - in a real app, this would trigger a more complex generation
    handleGenerateConceptNode(suggestion.suggestion_text);
    setLintResults(null);
  };

  // Image Search State
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'chat' | 'dashboard' | 'workspace' | 'concept'>('chat');
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: text,
      timestamp: Date.now(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
      imageAttachment: imageAttachment || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
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
      
      // Auto-navigate for Concept Canvas
      if (response.artifact && response.artifact.type === ArtifactType.CONCEPT_CANVAS) {
          if (response.artifact.title) {
            setCanvasTitle(response.artifact.title);
          }
          const { nodes: newNodes, edges: newEdges } = response.artifact.content;
          if (newNodes) {
              // Ensure unique IDs and proper formatting
              const processedNodes = newNodes.map((n: any) => ({
                  ...n,
                  id: n.id || crypto.randomUUID(),
                  type: 'concept', // ReactFlow node type
                  data: {
                      ...n,
                      label: n.label || 'New Node',
                      type: n.type || 'component', // Domain type
                      status: n.status || 'draft',
                      history: n.history || [{ timestamp: Date.now(), author: "AI Copilot", change: "Generated" }]
                  }
              }));
              
              setNodes(prev => {
                const nodeMap = new Map();
                prev.filter(n => n.type === 'concept').forEach(n => nodeMap.set(n.id, n));
                processedNodes.forEach(n => {
                  const existing = nodeMap.get(n.id);
                  nodeMap.set(n.id, { ...existing, ...n, data: { ...existing?.data, ...n.data } });
                });
                return layoutNodesByCategory(Array.from(nodeMap.values()));
              });
          }
          if (newEdges) {
              setEdges(prev => {
                const edgeMap = new Map();
                prev.forEach(e => edgeMap.set(e.id, e));
                newEdges.forEach((e: any) => {
                  const id = e.id || `${e.source}-${e.target}`;
                  edgeMap.set(id, { ...e, id });
                });
                return Array.from(edgeMap.values());
              });
          }
          setCurrentView('concept');
      } else {
          setIsArtifactPanelOpen(true);
      }
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
    if (pillar === 'concept') {
        setCurrentView('concept');
    } else {
        setCurrentView('chat');
    }
    setIsSidebarOpen(false);
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
        if (proj.pillar === 'concept') {
            setCurrentView('concept');
        }
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
      fileInputRef.current?.click();
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const newFiles = Array.from(e.target.files).map(f => f.name);
          setAttachedFiles(prev => [...prev, ...newFiles]);
          e.target.value = ''; // Reset input
      }
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
          setIsToolMenuOpen(false);
      } else if (toolId === 'lint' && currentView === 'concept') {
          handleLintCanvas();
          setIsToolMenuOpen(false);
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
      case ArtifactType.DFM_VALIDATION:
        return <DfmValidationView data={currentArtifact.content} />;
      default:
        return <div className="p-4">Unknown Artifact Type</div>;
    }
  };

  const getEmptyStateSuggestions = () => {
    return [
      { heading: "Design Concepts", prompt: "Design a concept architecture for a 6 DOF robotic arm.", icon: <Box size={20}/> },
      { heading: "Sourcing & BOM", prompt: "Turn my CAD model into a sourced, costed, and manufacturing-ready BOM.", icon: <List size={20}/> },
      { heading: "AI Copilot", prompt: "Review my design against industry standards and manufacturing guidelines.", icon: <Ruler size={20}/> },
      { heading: "Run Calculations", prompt: "Calculate the required torque for a robotic arm lifting 5kg at 0.5m.", icon: <Calculator size={20}/> }
    ];
  };

  const tools = [
      { id: 'img-search', label: 'Visual Search', icon: <Camera size={18} />, color: 'bg-brand-darkBlue/10 text-brand-darkBlue', prompt: '' },
      { id: 'search', label: 'Web Search', icon: <Globe size={18} />, color: 'bg-brand-darkBlue/10 text-brand-darkBlue', prompt: 'Search the web for' },
      { id: 'calc', label: 'Calculator', icon: <Calculator size={18} />, color: 'bg-brand-orange/10 text-brand-orange', prompt: 'Calculate the' },
      { id: 'concept', label: 'Gen Concept', icon: <Box size={18} />, color: 'bg-brand-darkBlue/10 text-brand-darkBlue', prompt: 'Design a concept architecture for' },
      { id: 'bom', label: 'Extract BOM', icon: <List size={18} />, color: 'bg-brand-orange/10 text-brand-orange', prompt: 'Extract a Bill of Materials for' },
      { id: 'specs', label: 'Verify Specs', icon: <Ruler size={18} />, color: 'bg-brand-darkBlue/10 text-brand-darkBlue', prompt: 'Verify the specifications for' },
      { id: 'dfm', label: 'DFM Check', icon: <Wrench size={18} />, color: 'bg-brand-orange/10 text-brand-orange', prompt: 'Perform a DFM check for 3D printing on' },
      { id: 'lint', label: 'Lint Canvas', icon: <ShieldAlert size={18} />, color: 'bg-red-50 text-red-600', prompt: 'Check for conflicts in my current architecture' },
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
      if (currentView === 'concept') {
          return (
            <div className="relative w-full h-full">
              <ReactFlowProvider>
                <ConceptCanvas 
                  title={canvasTitle}
                  onTitleChange={setCanvasTitle}
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onGenerateNode={handleGenerateConceptNode}
                  isGenerating={isConceptGenerating}
                  onLint={handleLintCanvas}
                  lintResults={lintResults}
                  isLinting={isLinting}
                  onCloseLint={() => setLintResults(null)}
                  onApplySuggestion={handleApplySuggestion}
                />
              </ReactFlowProvider>
              <button 
                onClick={() => setIsProposalOpen(true)}
                className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-brand-darkBlue text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-brand-darkBlue/90 transition-all"
              >
                <FileText size={16} />
                View UX Proposal
              </button>
              <ProposalOverlay isOpen={isProposalOpen} onClose={() => setIsProposalOpen(false)} />
            </div>
          );
      }

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
                    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center opacity-0 animate-fade-in" style={{animation: 'fadeIn 0.5s forwards'}}>
                        <div className="w-16 h-16 bg-white rounded-2xl mb-6 flex items-center justify-center shadow-sm border border-brand-darkBlue/10">
                            <span className="font-serif text-3xl font-bold text-brand-darkBlue">B</span>
                        </div>
                        <h1 className="font-serif font-medium text-3xl text-brand-darkBlue mb-4">
                            Buildables Workspace
                        </h1>
                        <p className="text-gray-500 mb-10 max-w-md text-lg font-light leading-relaxed">
                            Locally hosted AI workspace that helps mechanical engineers design concepts, find parts, and run calculations.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                            {getEmptyStateSuggestions().map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleSendMessage(suggestion.prompt)} 
                                    className="flex items-center gap-4 p-4 bg-white border border-brand-darkBlue/10 rounded-xl text-left transition-all hover:border-brand-darkBlue/30 hover:shadow-md hover:-translate-y-0.5 group"
                                >
                                    <div className="p-2.5 bg-brand-lightBlue/50 rounded-lg text-brand-darkBlue group-hover:bg-brand-darkBlue group-hover:text-white transition-colors">
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
                            <div className="w-6 h-6 rounded bg-brand-orange text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1 shadow-sm">
                            B
                            </div>
                        )}
                        
                        <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {msg.role === 'user' ? (
                                <div className="flex flex-col items-end gap-2">
                                    {(msg.attachments?.length || msg.imageAttachment) && (
                                        <div className="flex flex-wrap justify-end gap-2 mb-1">
                                            {msg.attachments?.map((file, i) => (
                                                <div key={i} className="flex items-center gap-2 bg-brand-darkBlue/10 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-darkBlue border border-brand-darkBlue/20">
                                                    <FileText size={12} className="text-brand-darkBlue/70" />
                                                    {file}
                                                </div>
                                            ))}
                                            {msg.imageAttachment && (
                                                <div className="h-16 w-16 rounded-lg overflow-hidden border border-brand-darkBlue/20 shadow-sm">
                                                    <img src={msg.imageAttachment} alt="Attached" className="h-full w-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {msg.text && (
                                        <div className="bg-brand-darkBlue text-white px-5 py-3 rounded-2xl rounded-tr-sm text-[16px] leading-relaxed font-serif tracking-tight shadow-sm border border-brand-darkBlue/10">
                                            {msg.text}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-brand-darkBlue px-1 py-1 text-[15px] leading-relaxed markdown-body">
                                    <Markdown>{msg.text}</Markdown>
                                    {msg.relatedArtifactId && (
                                        <div className="mt-4">
                                            <button 
                                                onClick={() => {
                                                    if (msg.relatedArtifactId) {
                                                        const artifact = currentArtifact; // This might be stale if multiple artifacts exist, but for now it works
                                                        if (artifact?.type === ArtifactType.CONCEPT_CANVAS) {
                                                            setCurrentView('concept');
                                                        } else {
                                                            setIsArtifactPanelOpen(true);
                                                        }
                                                    }
                                                }}
                                                className="flex items-center gap-3 text-sm font-bold text-brand-darkBlue bg-white hover:bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 shadow-sm transition-all group w-full sm:w-auto"
                                            >
                                                <div className="p-1.5 bg-brand-orange/10 text-brand-orange rounded-lg group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                                    {currentArtifact?.type === ArtifactType.DFM_VALIDATION ? <Wrench size={16} /> : <Box size={16} />}
                                                </div>
                                                <span className="flex-1 text-left">View Generated Artifact</span>
                                                <ArrowRight size={16} className="text-gray-400 group-hover:text-brand-darkBlue transition-colors" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded bg-brand-orange text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1 shadow-sm">B</div>
                            <div className="flex items-center gap-1 mt-3">
                                <div className="w-2 h-2 bg-brand-orange/50 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 bg-brand-orange/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-brand-orange/50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
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

                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-darkBlue/10 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-brand-darkBlue/10 focus-within:border-brand-darkBlue/30 relative">
                             {/* Attachments Area */}
                            {(attachedFiles.length > 0 || imageAttachment) && (
                                <div className="flex gap-2 p-3 pb-0 overflow-x-auto">
                                    {attachedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-brand-lightBlue/30 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 animate-in fade-in zoom-in duration-200 border border-brand-darkBlue/10">
                                            <FileText size={12} className="text-brand-darkBlue/50" />
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
                                    className={`p-2.5 rounded-xl transition-all mr-2 flex-shrink-0 ${isToolMenuOpen ? 'bg-brand-lightBlue text-brand-darkBlue rotate-45' : 'text-gray-400 hover:bg-brand-lightBlue/50 hover:text-brand-darkBlue'}`}
                                    title="Add Tool / Action"
                                >
                                    <Plus size={20} />
                                </button>

                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Ask Buildables to design, source, or analyze...`}
                                    className="w-full max-h-40 py-3 px-2 resize-none outline-none text-[16px] bg-transparent custom-scrollbar text-brand-darkBlue placeholder-brand-darkBlue/30 font-serif leading-relaxed"
                                    rows={1}
                                    style={{ minHeight: '52px' }}
                                />
                                
                                <div className="flex items-center gap-2 pb-1.5 pl-2">
                                    <button 
                                        onClick={handleFileUpload}
                                        className="p-2 text-gray-400 hover:text-brand-darkBlue rounded-lg hover:bg-brand-lightBlue/30 transition-colors"
                                        title="Attach Context"
                                    >
                                        <Paperclip size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleSendMessage()}
                                        disabled={(!input.trim() && attachedFiles.length === 0 && !imageAttachment) || isLoading}
                                        className={`p-2 rounded-lg transition-all duration-200 ${input.trim() || attachedFiles.length > 0 || imageAttachment ? 'bg-brand-orange text-white shadow-md hover:bg-brand-orange/90' : 'bg-brand-lightBlue/50 text-brand-darkBlue/30'}`}
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
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple 
        onChange={handleFileSelect} 
      />
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
        onNewChat={handleNewChat} 
        activeView={currentView}
        onOpenDashboard={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }}
        onOpenWorkspace={() => { setCurrentView('workspace'); setIsSidebarOpen(false); }}
        onOpenConcept={() => { setCurrentView('concept'); setIsSidebarOpen(false); }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        recentProjects={MOCK_PROJECTS}
        onOpenProject={(id) => { handleOpenProject(id); setIsSidebarOpen(false); }}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className={`flex flex-col h-full transition-all duration-300 relative min-w-0 ${isArtifactPanelOpen && currentArtifact?.type === ArtifactType.CAD_CONCEPT ? 'w-full md:w-[400px] flex-shrink-0' : 'flex-1'}`}>
        
        {/* Mobile Header */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 md:hidden flex-shrink-0 bg-white sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 text-brand-darkBlue/70">
                    <PanelRightOpen size={20} />
                </button>
                <span className="font-serif font-bold text-brand-darkBlue">Buildables</span>
            </div>
            {currentView === 'chat' && currentArtifact && (
                <button 
                    onClick={() => setIsArtifactPanelOpen(!isArtifactPanelOpen)}
                    className={`p-1.5 rounded-lg ${isArtifactPanelOpen ? 'text-brand-darkBlue bg-brand-lightBlue' : 'text-gray-400'}`}
                >
                    <Box size={20} />
                </button>
            )}
        </div>

        {/* Desktop Sidebar Toggle (when closed) */}
        {!isSidebarOpen && (
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="hidden md:flex absolute top-6 left-6 z-20 bg-white border border-gray-200 shadow-lg p-2.5 rounded-xl text-gray-500 hover:text-brand-darkBlue hover:border-brand-darkBlue transition-all"
                title="Open Sidebar"
            >
                <ChevronRight size={20} />
            </button>
        )}

        {renderMainView()}

      </div>

      {/* Right Artifact Panel */}
      {isArtifactPanelOpen && (
        <div className={`fixed md:relative right-0 top-0 bottom-0 z-30 w-full ${currentArtifact?.type === ArtifactType.CAD_CONCEPT ? 'md:flex-1' : 'md:w-[45%] lg:w-[50%] flex-shrink-0'} h-full border-l border-gray-200 bg-white shadow-[-5px_0_30px_rgba(0,0,0,0.02)] flex flex-col animate-slide-in-right transform transition-transform duration-300`}>
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
                className="bg-white border border-gray-200 shadow-lg p-2.5 rounded-xl text-gray-500 hover:text-brand-darkBlue hover:border-brand-darkBlue transition-all"
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
