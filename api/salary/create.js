// /api/salary/create.ts

import { supabaseAdmin } from "../_supabaseAdmin";

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
    member_id, // optional
    name,
    emp_type,
    pay_month, // yyyy-MM or yyyy-MM-01
    work_days,
    total_amount,
    net_amount,
  } = req.body;

  if (!company_id || !name || !emp_type || !pay_month)
    return res.status(400).json({ error: "required field missing" });

  // 회사 권한 체크
  const { data: membership } = await supabaseAdmin
    .from("company_members")
    .select("user_id")
    .eq("company_id", company_id)
    .eq("user_id", user.id)
    .eq("deleted", false)
    .maybeSingle();

  if (!membership) return res.status(403).json({ error: "No access" });

  // 중복체크
  const monthDate = pay_month.length === 7 ? `${pay_month}-01` : pay_month;

  const { data: exist } = await supabaseAdmin
    .from("salaries")
    .select("id")
    .eq("company_id", company_id)
    .eq("name", name)
    .eq("pay_month", monthDate)
    .limit(1);

  if (exist && exist.length > 0)
    return res.status(400).json({ error: "이미 해당 월에 작성된 대상입니다" });

  const { data, error } = await supabaseAdmin
    .from("salaries")
    .insert({
      company_id,
      member_id: member_id || null,
      name,
      emp_type,
      pay_month: monthDate,
      work_days: work_days || null,
      total_amount: total_amount || null,
      net_amount: net_amount || null,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ salary: data });
}
