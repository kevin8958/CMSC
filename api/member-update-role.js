import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { userId, role } = req.body;

  if (!userId || !role)
    return res.status(400).json({ error: "필수 파라미터 누락" });

  try {
    // profiles (전역 role)
    const { error: pErr } = await supabaseAdmin
      .from("profiles")
      .update({ role })
      .eq("id", userId);
    if (pErr) throw pErr;

    // company_members (모든 회사 동기화)
    const { error: cErr } = await supabaseAdmin
      .from("company_members")
      .update({ role })
      .eq("user_id", userId);
    if (cErr) throw cErr;

    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
