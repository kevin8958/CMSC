// /api/inquiry/delete.js
import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "id required" });

  const { error } = await supabaseAdmin.from("inquiries").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ ok: true });
}
