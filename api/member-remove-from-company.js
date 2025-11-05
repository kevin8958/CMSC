import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { companyId, userId } = req.body;

  try {
    const { data: member } = await supabaseAdmin
      .from("company_members")
      .select("id")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!member) throw new Error("멤버를 찾을 수 없습니다");

    await supabaseAdmin
      .from("company_members")
      .update({ deleted: true })
      .eq("id", member.id);

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
