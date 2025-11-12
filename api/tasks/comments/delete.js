import { supabaseAdmin } from "../../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });

  const { comment_id } = req.body;
  if (!comment_id)
    return res.status(400).json({ error: "comment_id required" });

  const { error } = await supabaseAdmin
    .from("task_comments")
    .delete()
    .eq("id", comment_id);

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ ok: true });
}
