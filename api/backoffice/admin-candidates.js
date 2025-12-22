// api/admin-candidates.js
import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { company_id } = req.query;
  if (!company_id) {
    return res.status(400).json({ error: "company_id is required" });
  }

  // 1) 전체 admin 프로필 (service role 이라 RLS 무시)
  const { data: allAdmins, error: adminsError } = await supabaseAdmin
    .from("profiles")
    .select("id, display_name, email")
    .eq("role", "admin");

  if (adminsError) {
    console.error("❌ allAdmins error:", adminsError);
    return res.status(500).json({ error: adminsError.message });
  }

  // 2) 현재 회사에 이미 등록된 admin 멤버들
  const { data: companyAdmins, error: companyAdminsError } = await supabaseAdmin
    .from("company_members")
    .select("user_id")
    .eq("company_id", company_id)
    .eq("role", "admin")
    .eq("deleted", false);

  if (companyAdminsError) {
    console.error("❌ companyAdmins error:", companyAdminsError);
    return res.status(500).json({ error: companyAdminsError.message });
  }

  const assignedIds = new Set((companyAdmins ?? []).map((r) => r.user_id));

  const result = (allAdmins ?? []).map((adm) => ({
    id: adm.id,
    display_name: adm.display_name,
    email: adm.email,
    alreadyAssigned: assignedIds.has(adm.id),
  }));

  return res.status(200).json({ data: result });
}
