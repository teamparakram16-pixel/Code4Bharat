import { geminiFlashModel } from "../../lib/geminiModel.js";
import parseAiJsonResponse from "../parseAiResponse.js";

const filtersPrompt = `You are an AI content classifier for ArogyaPath. Analyze posts and return structured data with confidence scoring.

## INPUT SOURCE & ANALYSIS SCOPE:
You must analyze **all of the following fields** to determine categories:
- \`title\`: The post's heading or main topic.
- \`description\`: Main content body containing detailed context or narrative.
- \`routines\`: An array of objects (e.g., remedies, steps, practices). Each routine can include  timing, content instructions.

## OUTPUT FORMAT:
{
  "diseases": string[],       // Lowercase disease names (empty if none)
  "medicines": string[],      // Lowercase Ayurvedic terms (empty if none)
  "filters": {
    "assigned": string[],     // Valid filter keys from approved list
    "rejected": string[]      // Proposed but invalid filters
  },
  "tags": string[],           // Combined list: diseases + medicines + assigned filters
  "reasoning": {
    "disease": string,        // Explanation for disease detection
    "medicine": string,       // Explanation for herb detection
    "filters": string         // Justification for filter assignments
  },
  "confidence_score": number  // 0.0-1.0 overall accuracy estimate
}

## CLASSIFICATION RULES:

### 1. DISEASE DETECTION
 Criteria:
- Explicit mentions only (no inferred conditions)
- Must include symptoms/conditions (not just wellness terms)
- Multi-word terms space-separated ("high blood pressure")

 Confidence Factors:
+0.3: Direct noun phrase match ("treating diabetes")
+0.1: Contextual mention ("helps with arthritis pain")
-0.2: Ambiguous references ("good for heart health")

### 2. MEDICINE IDENTIFICATION
 Criteria:
- Classical Ayurvedic names only
- Standardized spelling (use "ashwagandha" not "ashwagandha root")
- Exclude non-therapeutic mentions ("turmeric color")

 Confidence Factors:
+0.4: Exact match with therapeutic context
+0.2: Partial match with preparation details
-0.3: Branded product mentions

### 3. FILTER ASSIGNMENT
 Approved Filters:
"herbs", "routines", "wellnessTips", 
"diet", "yoga", "detox", "seasonal"

 Assignment Rules:
- "herbs": ≥2 medicine mentions OR remedy preparation
- "diet": Food protocols with >50 words description
- "yoga": Asanas + breathwork + therapeutic intent

 Confidence Factors:
+0.25 per qualifying evidence unit
-0.15 per borderline case

## TAGS FIELD
 Build the tags array as a **flattened list**:
- tags = diseases + medicines + filters.assigned
- Keep all items lowercase
- Do not include duplicates

## EXAMPLE OUTPUT:
{
  "diseases": ["viral fever"],
  "medicines": ["tulsi", "ginger"],
  "filters": {
    "assigned": ["herbs", "wellnessTips"],
    "rejected": ["detox"]
  },
  "tags": ["viral fever", "tulsi", "ginger", "herbs", "wellnessTips"],
  "reasoning": {
    "disease": "Direct mention of 'viral fever' in symptoms list",
    "medicine": "Tulsi referenced as kadha ingredient, ginger in dosage instructions",
    "filters": "Herbs assigned for multiple remedies, wellnessTips for prevention focus"
  },
  "confidence_score": 0.87
}

## Edge Case Handling:
- Use empty arrays for missing categories
- Confidence ≤ 0.5 should flag for manual review
- Explain rejections clearly in reasoning
`;

const generateFilters = async (title, description, routines) => {
  try {
    // Combine the input fields into a single string
    const textContent = `
        Title: ${title}
        Description: ${description}
        Routines: ${JSON.stringify(routines, null, 2)}
        `;

    const result = await geminiFlashModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: filtersPrompt + "\n" + textContent }],
        },
      ],
    });

    const response = result.response;
    const responseText = response.text();

    const parsedAiResponse = parseAiJsonResponse(responseText);

    return parsedAiResponse.tags.map((filter) => filter.toLowerCase());
  } catch (error) {
    console.error("Error generating content:", error);
    return []; // Return an empty array in case of error
  }
};

export default generateFilters;
