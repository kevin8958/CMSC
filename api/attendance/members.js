import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { company_id } = req.query;
  if (!company_id)
    return res.status(400).json({ error: "company_id required" });

  // ✅ 1. 회사 멤버 + 프로필 정보 가져오기
  const { data: members, error: memberError } = await supabaseAdmin
    .from("company_members")
    .select(
      `
      id,
      user_id,
      total_annual_days,
      used_annual_days,
      profiles (
        id,
        nickname,
        email,
        hire_date,
        position,
        job_title
      )
    `
    )
    .eq("company_id", company_id)
    .eq("deleted", false);

  if (memberError) {
    console.error("❌ Supabase error:", memberError);
    return res.status(500).json({ error: memberError.message });
  }

  // ✅ 2. 연차 사용 데이터 (attendance_records)
  const { data: records, error: recordError } = await supabaseAdmin
    .from("attendance_records")
    .select("member_id, days")
    .eq("company_id", company_id);

  if (recordError) return res.status(500).json({ error: recordError.message });

  // ✅ 3. JS에서 member_id별 사용일 합계 계산
  const usageMap = records.reduce((acc, cur) => {
    const id = cur.member_id;
    acc[id] = (acc[id] || 0) + Number(cur.days || 0);
    return acc;
  }, {});

  // ✅ 4. 멤버별로 total / used / remain 계산
  const result = members.map((m) => {
    const used = usageMap[m.id] || Number(m.used_annual_days || 0);
    const total = Number(m.total_annual_days || 15);
    return {
      id: m.id,
      user_id: m.user_id,
      name: m.profiles?.nickname || "-",
      email: m.profiles?.email || "-",
      hire_date: m.profiles?.hire_date || null,
      position: m.profiles?.position || null,
      job_title: m.profiles?.job_title || null,
      total_days: total,
      used_days: used,
      remain_days: total - used,
    };
  });

  // ✅ 5. 응답 반환
  return res.json({ data: result });
}
