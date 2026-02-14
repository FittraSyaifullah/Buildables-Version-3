import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ArtifactType, ArtifactData, LLMResponseParsed, UserContext, Pillar } from "../types";

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

export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  userContext?: UserContext | null,
  activePillar: Pillar = 'copilot'
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
  
  *Tailoring Instructions:*
  - **Industry:** If "Medical", prioritize biocompatibility and ISO 13485. If "Aerospace", focus on weight/strength ratios and AS9100.
  - **Role:** If "Student", explain concepts clearly. If "Senior Engineer", be concise, technical, and focus on edge cases.
  - **Resources:** Only suggest manufacturing methods available in their resource list.
  ` : '';

  // Tailor the persona based on the active mode (Pillar)
  let modeInstruction = "";
  switch (activePillar) {
    case 'concept':
      modeInstruction = "MODE: CONCEPT FORMATION. Focus on creativity, topology optimization, and mechanical synthesis. Always default to generating 'CAD_CONCEPT' artifacts when a design is requested.";
      break;
    case 'sourcing':
      modeInstruction = "MODE: SOURCING INTELLIGENCE. Focus on supply chain, lead times, cost reduction, and alternative parts. Always default to generating 'BOM' artifacts for lists of parts.";
      break;
    case 'copilot':
    default:
      modeInstruction = "MODE: GENERAL COPILOT. Focus on design reviews, documentation, and answering engineering queries. Use 'DOCUMENT' artifacts for long-form text.";
      break;
  }

  const systemInstruction = `
You are Buildables v3, a specialized Engineering Copilot. 
Your goal is to assist mechanical engineers with design, sourcing, and documentation.

${contextInstruction}

${modeInstruction}

**CRITICAL INSTRUCTION FOR ARTIFACT GENERATION:**
If the user asks for a specific deliverable, you MUST generate a JSON block inside your response wrapped in \`\`\`json \`\`\` containing "_isArtifact": true.

**Schemas for Artifacts:**

1. **BOM (Bill of Materials):**
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
    "visualStyle": "shaded"
  }
}
\`\`\`
*Allowed 'sourcing' values:* 'verified_supplier', 'generic', 'reclaimed', 'custom_manufactured', 'off_the_shelf'.
*Important:* For 'off_the_shelf' components, you MUST provide 'supplier', 'mpn', 'leadTime', and 'unitCost'.

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
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }] }, 
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: h.parts })),
        { role: 'user', parts: [{ text: newMessage }] }
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