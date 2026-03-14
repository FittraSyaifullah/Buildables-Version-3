
export type Role = 'user' | 'model';

export type Pillar = 'concept' | 'sourcing' | 'copilot';

export enum ArtifactType {
  BOM = 'BOM',
  CAD_CONCEPT = 'CAD_CONCEPT',
  DOCUMENT = 'DOCUMENT',
  REVIEW_NOTE = 'REVIEW_NOTE',
  COMPONENT_DETAIL = 'COMPONENT_DETAIL',
  SAVED_BOM = 'SAVED_BOM',
  CONCEPT_CANVAS = 'CONCEPT_CANVAS',
  DFM_VALIDATION = 'DFM_VALIDATION'
}

export interface DfmValidationData {
  dfm_status: string;
  adjustments_made: string[];
  bambu_a1_slicer_settings: {
    recommended_material: string;
    layer_height: number;
    wall_loops: number;
    infill_percentage: number;
    print_orientation: string;
  };
  fastening_recommendation: string;
}

export interface RedWire {
  source_node_id: string;
  target_node_id: string;
  reason: string;
}

export interface GhostNode {
  suggested_action: 'Add Node' | 'Modify Node';
  node_type: 'component' | 'constraint' | 'aesthetic';
  suggestion_text: string;
}

export interface CanvasLintResult {
  status: 'valid' | 'conflict';
  red_wires?: RedWire[];
  ghost_nodes?: GhostNode[];
}

export interface ConceptNodeHistory {
  timestamp: number;
  author: string;
  change: string;
}

export interface ConceptNodeLibraryLink {
  name: string;
  url: string;
  provider: string;
}

export interface ConceptNodeData {
  id: string;
  type: 'requirement' | 'component' | 'subsystem' | 'constraint';
  label: string;
  description?: string;
  prompt?: string;
  renderUrl?: string;
  specs?: Record<string, string>;
  status: 'draft' | 'validated' | 'conflict';
  history?: ConceptNodeHistory[];
  libraryLinks?: ConceptNodeLibraryLink[];
}

export interface ConceptCanvasData {
  nodes: any[]; // Using any for compatibility with React Flow Node type if needed, but will define properly in component
  edges: any[];
}

export interface ArtifactData {
  title: string;
  type: ArtifactType;
  content: any; // Flexible content structure based on type
  id: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  relatedArtifactId?: string; // If a message triggered an artifact creation
  timestamp: number;
  attachments?: string[];
  imageAttachment?: string;
}

export interface BomItem {
  id: string;
  partNumber: string;
  description: string;
  manufacturer: string;
  quantity: number;
  unitPrice: number;
  leadTime: string;
  supplier: 'DigiKey' | 'Mouser' | 'Local' | 'Direct';
  alternatives?: number;
  notes?: string;
}

export interface CadComponent {
  name: string;
  category: string;
  sourcing: 'verified_supplier' | 'generic' | 'reclaimed' | 'custom_manufactured' | 'off_the_shelf';
  mpn?: string;
  supplier?: string;
  notes?: string;
  specs?: string;
  leadTime?: string;
  unitCost?: string;
}

export interface ComponentDetailData {
  partNumber: string;
  manufacturer: string;
  description: string;
  specs: Record<string, string>;
  datasheetUrl?: string;
}

export interface ComparisonPart {
  id: string;
  partNumber: string;
  manufacturer: string;
  specs: Record<string, string>;
  isReference?: boolean;
}

export interface LibraryPart {
  id: string;
  partNumber: string;
  name: string;
  manufacturer: string;
  category: string;
  description: string;
  status: 'Active' | 'Obsolete' | 'Prototyping' | 'In Stock' | 'On Order';
  stockCount: number;
  location?: string;
  lastUsed: string;
  specs: Record<string, string>;
  isFavorite?: boolean;
}

export interface ThreeDPrimitive {
  type: 'box' | 'sphere' | 'cylinder';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

export interface CadConceptData {
  conceptName: string;
  description: string;
  rationale: string;
  constraints: string[];
  components: CadComponent[];
  metrics: {
    mass: string;
    dimensions: string;
    costEstimate: string;
    sustainabilityRating?: 'A' | 'B' | 'C' | 'D';
  };
  visualStyle: 'wireframe' | 'shaded' | 'blueprint';
  threeDModel?: ThreeDPrimitive[];
}

export interface DocumentData {
  title: string;
  sections: { heading: string; body: string }[];
}

// For parsing the LLM response
export interface LLMResponseParsed {
  text: string;
  artifact?: ArtifactData;
}

export interface UserContext {
  workflow: string;
  resources: string[];
  lifecycle: string;
  industry: string;
  role: string;
  projectKnowledge?: string;
}

export interface AppSettings {
  unitSystem: 'metric' | 'imperial';
  standard: 'iso' | 'ansi' | 'asme';
  theme: 'light' | 'dark' | 'system';
  username: string;
}

export interface ProjectSummary {
  id: string;
  title: string;
  pillar: Pillar;
  lastModified: number;
  preview: string;
}

export interface SavedBom {
  id: string;
  title: string;
  projectId: string;
  items: BomItem[];
  createdAt: number;
  totalCost: number;
}

export interface LibraryDocument {
  id: string;
  title: string;
  type: 'datasheet' | 'manual' | 'compliance' | 'report' | 'whitepaper';
  format: 'PDF' | 'DOCX' | 'XLSX' | 'TXT';
  size: string;
  uploadedAt: number;
  tags: string[];
  linkedPartNumber?: string;
  url: string;
}
