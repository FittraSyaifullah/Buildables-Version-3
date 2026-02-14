export type Role = 'user' | 'model';

export type Pillar = 'concept' | 'sourcing' | 'copilot';

export enum ArtifactType {
  BOM = 'BOM',
  CAD_CONCEPT = 'CAD_CONCEPT',
  DOCUMENT = 'DOCUMENT',
  REVIEW_NOTE = 'REVIEW_NOTE',
  COMPONENT_DETAIL = 'COMPONENT_DETAIL'
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