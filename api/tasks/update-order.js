// /api/tasks/update-order.js
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

  const { company_id, updates } = req.body;
  if (!company_id || !Array.isArray(updates))
    return res
      .status(400)
      .json({ error: "company_id and updates array required" });

  // 간단 권한 체크(회사 멤버인지)
  const { data: membership } = await supabaseAdmin
    .from("company_members")
    .select("user_id")
    .eq("company_id", company_id)
    .eq("user_id", user.id)
    .eq("deleted", false)
    .maybeSingle();

  if (!membership)
    return res.status(403).json({ error: "No access to this company" });

  // bulk 업데이트
  // (트랜잭션이 필요하면 RPC(Postgres function)로 묶는 것을 권장)
  for (const u of updates) {
    const { id, status, sort_index } = u;
    const { error } = await supabaseAdmin
      .from("tasks")
      .update({ status, sort_index })
      .eq("id", id)
      .eq("company_id", company_id);
    if (error) return res.status(500).json({ error: error.message });
  }

  return res.json({ ok: true });
}
