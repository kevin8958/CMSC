import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);
  if (!user) return res.status(401).json({ error: "Invalid user" });

  const {
    company_id,
    status,
    title,
    description,
    priority,
    due_date,
    assignee,
  } = req.body;
  if (!company_id || !status || !title)
    return res
      .status(400)
      .json({ error: "company_id, status, title required" });

  // status 내에서 max sort_index + 1
  const { data: last } = await supabaseAdmin
    .from("tasks")
    .select("sort_index")
    .eq("company_id", company_id)
    .eq("status", status)
    .order("sort_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextIndex = last?.sort_index + 1 || 0;

  const { data, error } = await supabaseAdmin
    .from("tasks")
    .insert({
      company_id,
      status,
      title,
      description,
      priority,
      due_date,
      assignee,
      sort_index: nextIndex,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ task: data });
}
