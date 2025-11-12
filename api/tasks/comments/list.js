import { supabaseAdmin } from "../../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: "taskId required" });

  const { data, error } = await supabaseAdmin
    .from("task_comments")
    .select(
      `
        id,
        task_id,
        author_id,
        content,
        created_at,
        updated_at,
        profiles (
          id,
          nickname,
          email
        )
      `
    )
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ data });
}
