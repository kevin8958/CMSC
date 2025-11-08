import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });

  // 로그인 유저
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);

  if (!user) return res.status(401).json({ error: "Invalid user" });

  // company_id 받아야함 (쿼리)
  const company_id = req.query.company_id;
  if (!company_id)
    return res.status(400).json({ error: "company_id required" });

  // 회사 접근 권한 체크 - 기존 네 로직대로 company_members 참고
  const { data: membership } = await supabaseAdmin
    .from("company_members")
    .select("user_id")
    .eq("company_id", company_id)
    .eq("user_id", user.id)
    .eq("deleted", false)
    .maybeSingle();

  if (!membership)
    return res.status(403).json({ error: "No access to this company" });

  const { data: tasks, error } = await supabaseAdmin
    .from("tasks")
    .select(
      "id, title, status, sort_index, due_date, assignee, priority, description"
    )
    .eq("company_id", company_id)
    .order("status", { ascending: true })
    .order("sort_index", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ tasks });
}
