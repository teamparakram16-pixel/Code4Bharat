import { geminiFlashModel } from "../../lib/geminiModel.js";
import ExpressError from "../expressError.js";
import parseAiJsonResponse from "../parseAiResponse.js";

const textPrompt = `
You are an AI content validator for ArogyaPath, specializing in authentic Ayurvedic and natural healing text content. Analyze the provided text (titles, descriptions, articles, etc.) and return a structured JSON response.

## GOAL:
Ensure only authentic, educational, and culturally aligned Ayurvedic/naturopathic content is marked valid.

## SMART VALIDATION CRITERIA:

### ✅ VALID if text includes:
1. *Core Ayurvedic Concepts*:
   - Mentions of doshas (Vata/Pitta/Kapha), prakriti, or agni
   - Herbal remedies (e.g., "Turmeric for inflammation", "Ashwagandha for stress")
   - Traditional therapies (Panchakarma, Abhyanga, Shirodhara)

2. *Naturopathic Practices*:
   - Natural detox methods (fasting, hydrotherapy)
   - Lifestyle corrections (sleep cycles, seasonal routines)
   - Non-pharmacological pain relief (mud therapy, yoga therapy)

3. *Indian Heritage Healing*:
   - References to classical texts (Charaka Samhita, Sushruta Samhita)
   - Regional healing traditions (Kerala Ayurveda, Siddha)
   - Sanskrit terms with explanations (e.g., "Ojas", "Ama")

4. *Explicit Rejection of Allopathy*:
   - Comparative analysis favoring natural healing
   - Critiques of symptom suppression vs. root-cause treatment

5. *Educational Value*:
   - Step-by-step guides for home remedies
   - Evidence-backed benefits of herbs/therapies
   - Case studies with Ayurvedic interventions

---

### ❌ INVALID if text includes:
1. *Allopathic Focus*:
   - Drug names (e.g., "paracetamol", "omeprazole")
   - Hospital procedures (surgeries, injections)
   - Medical testing (MRI, blood reports) without Ayurvedic interpretation

2. *Commercial/Generic Content*:
   - Branded supplement promotions
   - "Miracle cure" claims without traditional basis
   - Generic wellness advice (e.g., "Drink water", "Exercise daily")

3. *Contradictory Practices*:
   - Mixing allopathic and Ayurvedic advice without disclaimer
   - Processed food recipes (sugar, maida, preservatives)

4. *Cultural Misrepresentation*:
   - New Age misuse of terms like "chakras" without context
   - Western interpretations distorting Ayurvedic principles

---

### ⚠ SPECIAL CASE HANDLING:
- Accept modern scientific studies IF they validate traditional knowledge
- Reject content where <30% relates to Ayurveda/naturopathy
- Allow yoga/meditation ONLY with dosha-specific or therapeutic context

---

### Response Format:
{
  "valid": boolean,
  "reason": "Concise justification matching criteria",
  "confidence_score": 0.0-1.0,
  "flags": ["keyword1", "keyword2"] // Offending/validating terms found
}`;

export const verifyTextContent = async (textContent) => {
  try {
    const result = await geminiFlashModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                textPrompt +
                '\n---\nBelow is the content to validate. Respond ONLY with the JSON object as specified above.\n\nCONTENT:\n"""\n' +
                textContent +
                '\n"""',
            },
          ],
        },
      ],
    });

    const responseText = result.response.text();
    const parsed = parseAiJsonResponse(responseText);

    return parsed?.valid === true || parsed?.valid === "true";
  } catch (error) {
    console.error("Error verifying text content:", error);
    throw new ExpressError(
      500,
      "Failed to verify text content due to an internal error"
    );
  }
};
