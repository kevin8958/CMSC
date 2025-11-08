import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);
  if (!user) return res.status(401).json({ error: "Invalid user" });

  const { task_id } = req.body;
  if (!task_id) return res.status(400).json({ error: "task_id required" });

  const { error } = await supabaseAdmin
    .from("tasks")
    .delete()
    .eq("id", task_id);

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ ok: true });
}
