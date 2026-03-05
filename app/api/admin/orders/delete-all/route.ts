import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function DELETE() {
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

    // Delete all card orders
    const { error } = await supabase
      .from('card_orders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // This deletes all rows

    if (error) {
      console.error("Error deleting card orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "All card orders deleted" });
  } catch (error) {
    console.error("Error in delete-all route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
