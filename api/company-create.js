import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });

  // 1) 중복 체크
  const { data: existing } = await supabaseAdmin
    .from("companies")
    .select("id")
    .eq("name", name)
    .eq("deleted", false);

  if (existing && existing.length > 0) {
    return res.status(400).json({ error: "이미 존재하는 회사명입니다." });
  }

  // 2) 생성
  const { data: company, error: createErr } = await supabaseAdmin
    .from("companies")
    .insert({ name })
    .select()
    .single();

  if (createErr) return res.status(500).json({ error: createErr.message });

  return res.json(company);
}
