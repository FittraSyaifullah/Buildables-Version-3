import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ArtifactType, ArtifactData, LLMResponseParsed, UserContext } from "../types";

// Helper to extract JSON artifact from text if present
const parseArtifactFromResponse = (text: string): LLMResponseParsed => {
  const artifactRegex = /```json\s*({[\s\S]*?"_isArtifact":\s*true[\s\S]*?})\s*```/;
  const match = text.match(artifactRegex);

  if (match && match[1]) {
    try {
      const artifactJson = JSON.parse(match[1]);
      const cleanText = text.replace(match[0], "").trim();
      
      const artifact: ArtifactData = {
        id: crypto.randomUUID(),
        title: artifactJson.title || "Generated Artifact",
        type: artifactJson.type as ArtifactType,
        content: artifactJson.content
      };

      return {
        text: cleanText,
        artifact: artifact
      };
    } catch (e) {
      console.error("Failed to parse artifact JSON", e);
      return { text: text };
    }
  }

  return { text: text };
};

const linterInstruction = `
  **CANVAS LINTER MODE:**
  You are the conflict-resolution engine for the buildables.app node canvas. 
  Your job is to act as a senior mechanical engineer checking the work in the node graph.
  
  LINTING RULES:
  1. Spatial: Do the components physically fit inside the requested bounding box?
  2. Thermal: Are high-heat components (e.g., power regulators) placed without ventilation constraints?
  3. Electrical: Is there a power source for the microcontroller? 
  4. Aesthetic Clash: Did they request "Minimalist Bare" but also ask for "heavy RGB lighting"?
  
  Output Schema:
  If the graph is flawless, return \`{"status": "valid"}\`. 
  If there are errors, you MUST return this JSON schema:
  \`\`\`json
  {
    "status": "conflict",
    "red_wires": [
      {
        "source_node_id": "n2_battery",
        "target_node_id": "n4_bounding_box",
        "reason": "18650 cell length (65mm) exceeds bounding box Z-axis (50mm)"
      }
    ],
    "ghost_nodes": [
      {
        "suggested_action": "Add Node",
        "node_type": "component",
        "suggestion_text": "Add a 40mm fan node or increase bounding box to 70mm"
      }
    ]
  }
  \`\`\`
  `;

const dfmInstruction = `
  **DFM ENGINE MODE (FDM Focus):**
  You are the Design for Manufacturing (DFM) validation node for buildables.app. 
  Your job is to optimize geometry strictly for a Bambu Lab A1 3D printer.
  
  STRICT DFM RULES:
  1. Nozzle Math: All structural wall thicknesses must be exact multiples of 0.4mm or 0.6mm. Round up to nearest multiple (e.g., 1.5mm -> 1.6mm).
  2. Support-Free Mandate: Replace 90-degree overhangs with 45-degree chamfers or teardrop hole profiles.
  3. Tolerance Calibration: Apply a +0.15mm clearance on all X/Y axes for moving parts and snap-fits.
  4. Bed Adhesion: Identify the largest flat planar surface to serve as the "Z-Bottom".
  
  Artifact Schema:
  \`\`\`json
  {
    "_isArtifact": true,
    "type": "DFM_VALIDATION",
    "title": "DFM Optimization: [Part Name]",
    "content": {
      "dfm_status": "Optimized",
      "adjustments_made": [
        "Increased wall thickness from 1.5mm to 1.6mm for 0.4mm nozzle compatibility"
      ],
      "bambu_a1_slicer_settings": {
        "recommended_material": "PLA",
        "layer_height": 0.2,
        "wall_loops": 3,
        "infill_percentage": 15,
        "print_orientation": "Place Face A flat on build plate"
      },
      "fastening_recommendation": "Use cantilever snap-fits with 0.15mm clearance to avoid hardware"
    }
  }
  \`\`\`
  `;

export const lintCanvas = async (
  nodes: any[],
  edges: any[],
  userContext?: UserContext | null
): Promise<any> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
  LINT THIS CANVAS GRAPH:
  
  NODES:
  ${JSON.stringify(nodes, null, 2)}
  
  EDGES:
  ${JSON.stringify(edges, null, 2)}
  
  Check for spatial, thermal, electrical, and aesthetic conflicts based on your senior mechanical engineering expertise.
  Return ONLY the JSON response according to the CANVAS LINTER MODE schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: linterInstruction }] },
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Linter API Error:", error);
    return { status: "valid" }; // Fallback to valid if error
  }
};

export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  userContext?: UserContext | null,
  imageBase64?: string | null
): Promise<LLMResponseParsed> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contextInstruction = userContext ? `
  **USER CONTEXT PROFILE:**
  The user has configured the following engineering environment.
  - **Primary Workflow:** ${userContext.workflow}
  - **Available Resources:** ${userContext.resources.join(', ')}
  - **Product Lifecycle:** ${userContext.lifecycle}
  - **Industry Domain:** ${userContext.industry}
  - **Engineering Role:** ${userContext.role}
  - **Project Knowledge:** ${userContext.projectKnowledge}
  
  *Tailoring Instructions:*
  - **Industry:** If "Medical", prioritize biocompatibility and ISO 13485. If "Aerospace", focus on weight/strength ratios and AS9100.
  - **Role:** If "Student", explain concepts clearly. If "Senior Engineer", be concise, technical, and focus on edge cases.
  - **Resources:** Only suggest manufacturing methods available in their resource list.
  ` : '';

  const modeInstruction = `
  MODE: UNIFIED ENGINEERING COPILOT. 
  You are an expert mechanical engineer, supply chain manager, and design reviewer.
  - When a user asks for a design, concept, architecture, or to "design a concept", generate a 'CONCEPT_CANVAS' artifact for node-based ideation. This is the primary tool for early-stage engineering.
  - When a user asks for a physical 3D concept or specific CAD details, generate a 'CAD_CONCEPT' artifact.
  - When a user asks for a list of parts, pricing, or a BOM, generate a 'BOM' artifact.
  - When a user asks for documentation, reports, or long-form text, generate a 'DOCUMENT' artifact.
  - When a user asks for details on a specific component, generate a 'COMPONENT_DETAIL' artifact.
  - When a user asks to "validate for 3D printing", "optimize for manufacturing", "DFM check", or provides a JSON object of a 3D enclosure, use the DFM ENGINE MODE.
  - When a user asks to "check for conflicts", "lint the canvas", "validate the design", or "review the architecture", use the CANVAS LINTER MODE.
  `;

  const imageInstruction = imageBase64 ? `
  **IMAGE ANALYSIS MODE:**
  The user has provided an image. 
  1. IDENTIFY: Precisely identify the component, tool, or diagram shown.
  2. PURPOSE: Explain its function in a mechanical system.
  3. ALTERNATIVES: Suggest 3 viable alternatives or modern equivalents if applicable.
  ` : "";

  const systemInstruction = `
You are Buildables v3, a specialized Engineering Copilot. 
Your goal is to assist mechanical engineers with design, sourcing, and documentation.

${contextInstruction}

${modeInstruction}
${linterInstruction}
${dfmInstruction}
${imageInstruction}

**CRITICAL INSTRUCTION FOR ARTIFACT GENERATION:**
If the user asks for a specific deliverable, you MUST generate a JSON block inside your response wrapped in \`\`\`json \`\`\` containing "_isArtifact": true.

**Schemas for Artifacts:**

1. **Concept Canvas (Node-based Architecture):**
Use this when the user wants to ideate, map requirements, or build a hardware concept architecture. It is the default for new design ideas.
**CRITICAL:** Generate a COHESIVE OVERVIEW. This means:
- **TITLE:** Provide a descriptive title for the concept (e.g., "High-Torque Planetary Gearbox Architecture").
- Include at least 5-8 nodes for a complex request.
- Use the 'type' field: 'requirement', 'subsystem', 'component', 'constraint'.
- Create logical 'edges' (connections) between them (e.g., requirement -> subsystem -> component).
- Provide technical 'specs' for each node.
\`\`\`json
{
  "_isArtifact": true,
  "type": "CONCEPT_CANVAS",
  "title": "Concept Architecture: [Concept Name]",
  "content": {
    "nodes": [
      { "id": "1", "type": "requirement", "label": "...", "description": "...", "status": "draft" },
      { "id": "2", "type": "subsystem", "label": "...", "description": "...", "status": "draft" },
      { "id": "3", "type": "component", "label": "...", "description": "...", "status": "draft" }
    ],
    "edges": [
      { "id": "e1-2", "source": "1", "target": "2", "label": "satisfies" },
      { "id": "e2-3", "source": "2", "target": "3", "label": "contains" }
    ]
  }
}
\`\`\`

2. **BOM (Bill of Materials):**
\`\`\`json
{
  "_isArtifact": true,
  "type": "BOM",
  "title": "BOM: [Assembly Name]",
  "content": {
    "items": [
      { "id": "1", "partNumber": "...", "description": "...", "manufacturer": "...", "quantity": 1, "unitPrice": 0.00, "leadTime": "3 days", "supplier": "DigiKey", "notes": "..." }
    ],
    "totalCost": 100.00
  }
}
\`\`\`

2. **CAD Concept:**
\`\`\`json
{
  "_isArtifact": true,
  "type": "CAD_CONCEPT",
  "title": "Concept: [Concept Name]",
  "content": {
    "conceptName": "...",
    "description": "...",
    "rationale": "...",
    "constraints": ["Material: AL6061", "Max Load: 50N"],
    "components": [
       { 
         "name": "NEMA 17 Stepper", 
         "category": "Actuator", 
         "sourcing": "off_the_shelf", 
         "mpn": "17HS4401",
         "supplier": "DigiKey",
         "leadTime": "5 days",
         "unitCost": "$14.50",
         "notes": "Standard size, high torque",
         "specs": "1.8deg, 12V, 0.4A"
       },
       { "name": "Mounting Bracket", "category": "Structural", "sourcing": "custom_manufactured", "specs": "AL6061-T6, 3mm thickness" }
    ],
    "metrics": {
       "mass": "1.2 kg",
       "dimensions": "200x150x100 mm",
       "costEstimate": "$45.00",
       "sustainabilityRating": "B"
    },
    "visualStyle": "shaded",
    "threeDModel": [
      { "type": "box", "position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1], "color": "#ff8800" },
      { "type": "cylinder", "position": [0, 1, 0], "rotation": [0, 0, 0], "scale": [0.5, 2, 0.5], "color": "#444444" }
    ]
  }
}
\`\`\`
*Allowed 'sourcing' values:* 'verified_supplier', 'generic', 'reclaimed', 'custom_manufactured', 'off_the_shelf'.
*Important:* For 'off_the_shelf' components, you MUST provide 'supplier', 'mpn', 'leadTime', and 'unitCost'.
*Important:* 'threeDModel' is an array of primitives ('box', 'sphere', 'cylinder') that visually represent the concept. Provide a few primitives to give a rough 3D shape.

3. **Document/Review:**
\`\`\`json
{
  "_isArtifact": true,
  "type": "DOCUMENT",
  "title": "Review: [Topic]",
  "content": {
    "title": "...",
    "sections": [
      { "heading": "Design Assumptions", "body": "..." },
      { "heading": "Risk Analysis", "body": "..." }
    ]
  }
}
\`\`\`

4. **Component Detail (Datasheet/Specs):**
Use this when the user asks for specs, datasheets, or parametric info for a specific part.
\`\`\`json
{
  "_isArtifact": true,
  "type": "COMPONENT_DETAIL",
  "title": "Specs: [Part Number]",
  "content": {
    "partNumber": "...",
    "manufacturer": "...",
    "description": "...",
    "specs": {
      "Input Voltage": "12V",
      "Current": "2A",
      "Package": "SOT-223"
    },
    "datasheetUrl": "https://..."
  }
}
\`\`\`

If no specific artifact is needed, just reply with text. 
Maintain a professional, engineering-focused tone. Concise, precise, and helpful.
`;

  try {
    const model = 'gemini-3-flash-preview'; 
    
    // Construct parts array
    let requestParts: any[] = [{ text: newMessage }];
    
    // Add image if present
    if (imageBase64) {
        // Strip data prefix if present (e.g. "data:image/jpeg;base64,")
        const base64Data = imageBase64.split(',')[1];
        const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
        
        requestParts.unshift({
            inlineData: {
                mimeType: mimeType,
                data: base64Data
            }
        });
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }] }, 
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: h.parts })),
        { role: 'user', parts: requestParts }
      ],
      config: {
        temperature: 0.2, 
      }
    });

    const textResponse = response.text || "I'm having trouble processing that request.";
    return parseArtifactFromResponse(textResponse);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Error communicating with the Engineering Copilot. Please check your connection or API key." };
  }
};