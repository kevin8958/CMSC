import { supabaseAdmin } from "../../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { task_id, content, author_id } = req.body;

  if (!task_id || !content)
    return res.status(400).json({ error: "task_id and content are required" });

  const { data, error } = await supabaseAdmin
    .from("task_comments")
    .insert([{ task_id, content, author_id }])
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
    .single();

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ comment: data });
}
