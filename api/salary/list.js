import { supabaseAdmin } from "../_supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);
  if (!user) return res.status(401).json({ error: "Invalid user" });

  const company_id = req.query.company_id;
  if (!company_id)
    return res.status(400).json({ error: "company_id required" });

  // 회사 접근권한 검사
  const { data: membership } = await supabaseAdmin
    .from("company_members")
    .select("user_id")
    .eq("company_id", company_id)
    .eq("user_id", user.id)
    .eq("deleted", false)
    .maybeSingle();

  if (!membership) return res.status(403).json({ error: "No access" });

  const { data, error } = await supabaseAdmin
    .from("salaries")
    .select("*")
    .eq("company_id", company_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ salaries: data });
}
