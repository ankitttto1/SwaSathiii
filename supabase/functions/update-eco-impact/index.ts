import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type WasteCategory = "plastic" | "organic" | "metal" | "ewaste" | "paper" | "glass" | "unknown";

interface UpdateRequest {
  user_id: string;
  category: WasteCategory;
  confidence: number;
}

// Environmental impact per item (estimated values)
const IMPACT_PER_ITEM: Record<WasteCategory, { co2: number; water: number; trees: number }> = {
  plastic: { co2: 0.5, water: 5, trees: 0.05 },
  organic: { co2: 0.2, water: 2, trees: 0.02 },
  metal: { co2: 1.2, water: 10, trees: 0.08 },
  ewaste: { co2: 0.8, water: 15, trees: 0.1 },
  paper: { co2: 0.3, water: 8, trees: 0.15 },
  glass: { co2: 0.4, water: 6, trees: 0.05 },
  unknown: { co2: 0.3, water: 4, trees: 0.03 },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { user_id, category, confidence }: UpdateRequest = await req.json();

    if (!user_id || !category) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");

    if (!serviceKey || !supabaseUrl) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase config" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    };

    // Get current impact
    const impactResponse = await fetch(`${supabaseUrl}/rest/v1/eco_impacts?user_id=eq.${user_id}`, {
      method: "GET",
      headers,
    });

    const impacts = await impactResponse.json();
    const currentImpact = impacts[0];

    const impact = IMPACT_PER_ITEM[category as WasteCategory] || IMPACT_PER_ITEM.unknown;
    const weightedCo2 = impact.co2 * confidence;
    const weightedWater = impact.water * confidence;
    const weightedTrees = impact.trees * confidence;

    if (currentImpact) {
      // Update existing impact
      await fetch(`${supabaseUrl}/rest/v1/eco_impacts?user_id=eq.${user_id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          total_scans: currentImpact.total_scans + 1,
          [`${category}_items`]: (currentImpact[`${category}_items`] || 0) + 1,
          co2_saved: currentImpact.co2_saved + weightedCo2,
          water_saved: currentImpact.water_saved + weightedWater,
          trees_saved: currentImpact.trees_saved + weightedTrees,
          updated_at: new Date().toISOString(),
        }),
      });
    } else {
      // Create new impact record
      await fetch(`${supabaseUrl}/rest/v1/eco_impacts`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id,
          total_scans: 1,
          [`${category}_items`]: 1,
          co2_saved: weightedCo2,
          water_saved: weightedWater,
          trees_saved: weightedTrees,
        }),
      });
    }

    // Update user profile
    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/user_profiles?id=eq.${user_id}`, {
      method: "GET",
      headers,
    });

    const profiles = await profileResponse.json();
    if (profiles[0]) {
      await fetch(`${supabaseUrl}/rest/v1/user_profiles?id=eq.${user_id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          total_scans: profiles[0].total_scans + 1,
          co2_saved: profiles[0].co2_saved + weightedCo2,
          water_saved: profiles[0].water_saved + weightedWater,
          updated_at: new Date().toISOString(),
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true, impact: { co2: weightedCo2, water: weightedWater, trees: weightedTrees } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error updating eco impact:", err);
    return new Response(
      JSON.stringify({ error: "Update failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
