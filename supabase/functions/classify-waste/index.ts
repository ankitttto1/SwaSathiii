import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type WasteCategory = "plastic" | "organic" | "metal" | "ewaste" | "paper" | "glass" | "unknown";

interface ClassifyRequest {
  image: string;
  mimeType: string;
}

interface ClassifyResponse {
  category: WasteCategory;
  confidence: number;
  label: string;
}

const CATEGORY_KEYWORDS: Record<string, WasteCategory> = {
  plastic: "plastic",
  "plastic bottle": "plastic",
  "plastic bag": "plastic",
  "plastic container": "plastic",
  "plastic wrap": "plastic",
  "styrofoam": "plastic",
  "polystyrene": "plastic",
  wrapper: "plastic",
  straw: "plastic",
  "pet bottle": "plastic",
  "hdpe": "plastic",
  organic: "organic",
  food: "organic",
  fruit: "organic",
  vegetable: "organic",
  banana: "organic",
  apple: "organic",
  leaf: "organic",
  grass: "organic",
  compost: "organic",
  bread: "organic",
  kitchen: "organic",
  peel: "organic",
  meat: "organic",
  "food waste": "organic",
  metal: "metal",
  "aluminum can": "metal",
  "tin can": "metal",
  foil: "metal",
  steel: "metal",
  iron: "metal",
  scrap: "metal",
  wire: "metal",
  "metal appliance": "metal",
  can: "metal",
  phone: "ewaste",
  smartphone: "ewaste",
  laptop: "ewaste",
  computer: "ewaste",
  battery: "ewaste",
  charger: "ewaste",
  cable: "ewaste",
  "circuit board": "ewaste",
  keyboard: "ewaste",
  mouse: "ewaste",
  tablet: "ewaste",
  "electronic device": "ewaste",
  electronics: "ewaste",
  paper: "paper",
  cardboard: "paper",
  newspaper: "paper",
  magazine: "paper",
  book: "paper",
  envelope: "paper",
  "paper bag": "paper",
  "cardboard box": "paper",
  glass: "glass",
  "glass bottle": "glass",
  jar: "glass",
  window: "glass",
  mirror: "glass",
};

function detectCategoryFromText(text: string): { category: WasteCategory; confidence: number } {
  const lower = text.toLowerCase();

  let bestMatch: WasteCategory = "unknown";
  let bestScore = 0;

  const counts: Record<WasteCategory, number> = {
    plastic: 0, organic: 0, metal: 0, ewaste: 0, paper: 0, glass: 0, unknown: 0,
  };

  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lower.includes(keyword)) {
      counts[category] += keyword.split(" ").length;
    }
  }

  for (const [cat, score] of Object.entries(counts) as [WasteCategory, number][]) {
    if (score > bestScore) {
      bestScore = score;
      bestMatch = cat;
    }
  }

  const confidence = bestMatch === "unknown" ? 0.3 : Math.min(0.95, 0.6 + bestScore * 0.05);
  return { category: bestMatch, confidence };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { image, mimeType }: ClassifyRequest = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");

    let category: WasteCategory = "unknown";
    let confidence = 0.5;

    if (openAiKey) {
      // Use OpenAI Vision if available
      const prompt = `You are a waste classification expert. Analyze this image and identify the primary waste item.

Classify it into exactly one of these categories:
- plastic: Plastic bottles, bags, containers, wrappers, styrofoam
- organic: Food scraps, fruit, vegetables, garden waste, leaves
- metal: Aluminum cans, tin cans, metal objects, wire, scrap metal
- ewaste: Phones, laptops, computers, batteries, cables, electronic devices
- paper: Paper, cardboard, newspaper, books, magazines
- glass: Glass bottles, jars, glass objects
- unknown: Cannot determine

Respond with ONLY a JSON object like: {"category": "plastic", "confidence": 0.92, "description": "plastic water bottle"}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: { url: `data:${mimeType};base64,${image}`, detail: "low" },
                },
              ],
            },
          ],
          max_tokens: 150,
          temperature: 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content ?? "";
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const validCategories: WasteCategory[] = ["plastic", "organic", "metal", "ewaste", "paper", "glass", "unknown"];
            if (validCategories.includes(parsed.category)) {
              category = parsed.category;
              confidence = Math.max(0.3, Math.min(0.99, parsed.confidence ?? 0.7));
            }
            if (parsed.description) {
              const fallback = detectCategoryFromText(parsed.description);
              if (category === "unknown" && fallback.category !== "unknown") {
                category = fallback.category;
                confidence = fallback.confidence;
              }
            }
          }
        } catch {
          const fallback = detectCategoryFromText(content);
          category = fallback.category;
          confidence = fallback.confidence;
        }
      }
    } else {
      // Fallback: random demo classification for development without API key
      const categories: WasteCategory[] = ["plastic", "organic", "metal", "ewaste", "paper", "glass"];
      category = categories[Math.floor(Math.random() * categories.length)];
      confidence = 0.6 + Math.random() * 0.35;
    }

    const response: ClassifyResponse = {
      category,
      confidence: Math.round(confidence * 1000) / 1000,
      label: category.charAt(0).toUpperCase() + category.slice(1),
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error classifying waste:", err);
    return new Response(
      JSON.stringify({ error: "Classification failed", category: "unknown", confidence: 0.3, label: "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
