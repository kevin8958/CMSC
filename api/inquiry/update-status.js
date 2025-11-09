// /api/inquiry/update-status.js
import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { id, status } = req.body;
  if (!id || !status)
    return res.status(400).json({ error: "id, status required" });

  const { error } = await supabaseAdmin
    .from("inquiries")
    .update({ status })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ ok: true });
}
