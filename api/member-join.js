import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "no userId" });

  await supabaseAdmin
    .from("company_members")
    .update({ joined_at: new Date().toISOString() })
    .eq("user_id", userId);

  return res.json({ ok: true });
}
