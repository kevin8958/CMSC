import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Missing record id" });

  const { error } = await supabaseAdmin
    .from("attendance_records")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ ok: true });
}
