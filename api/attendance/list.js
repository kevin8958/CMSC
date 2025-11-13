import { supabaseAdmin } from "../_supabaseAdmin.js";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { member_id, year } = req.query;
  if (!member_id) return res.status(400).json({ error: "member_id required" });

  const start = year
    ? `${year}-01-01`
    : dayjs().startOf("year").format("YYYY-MM-DD");
  const end = year
    ? `${year}-12-31`
    : dayjs().endOf("year").format("YYYY-MM-DD");

  const { data, error } = await supabaseAdmin
    .from("attendance_records")
    .select("id, start_date, end_date, days, reason, note")
    .eq("member_id", member_id)
    .gte("start_date", start)
    .lte("end_date", end)
    .order("start_date", { ascending: true });

  if (error) return res.status(400).json({ error: error.message });

  // ✅ 연도별 그룹화
  const grouped = data.reduce((acc, record) => {
    const y = dayjs(record.start_date).year();
    acc[y] = acc[y] || [];
    acc[y].push(record);
    return acc;
  }, {});

  const yearly = Object.entries(grouped).map(([year, records]) => ({
    year: Number(year),
    used: records.reduce((sum, r) => sum + Number(r.days), 0),
    records,
  }));

  return res.json({ data: yearly });
}
