import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { companyId } = req.body;
  if (!companyId) return res.status(400).json({ error: "companyId required" });

  try {
    // 회사 존재 확인
    const { data: company } = await supabaseAdmin
      .from("companies")
      .select("id")
      .eq("id", companyId)
      .maybeSingle();

    if (!company) throw new Error("회사를 찾을 수 없습니다");

    // soft delete
    await supabaseAdmin
      .from("companies")
      .update({ deleted: true })
      .eq("id", companyId);

    await supabaseAdmin
      .from("company_members")
      .update({ deleted: true })
      .eq("company_id", companyId);

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
