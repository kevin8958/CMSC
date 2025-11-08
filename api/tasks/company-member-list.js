import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { companyId } = req.query;
  if (!companyId) return res.status(400).json({ error: "companyId required" });

  // pagination 없음 → 전체 조회
  const { data, error } = await supabaseAdmin
    .from("company_members")
    .select(
      `
      user_id,
      role,
      joined_at,
      created_at,
      profiles(id, nickname, email)
    `
    )
    .eq("company_id", companyId)
    .eq("deleted", false)
    .order("role", { ascending: false }) // admin 먼저 나오게
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  // count 필요 없음
  return res.json({ data });
}
