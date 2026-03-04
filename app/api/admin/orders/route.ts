import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Verify user is authenticated and is an admin
    const userSupabase = await createClient();
    const { data: { user } } = await userSupabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminRecord } = await userSupabase
      .from('admins')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminRecord) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("card_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Admin orders API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
