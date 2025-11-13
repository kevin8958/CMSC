import { supabaseAdmin } from "../_supabaseAdmin.js";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { company_id, month } = req.query;
  if (!company_id)
    return res.status(400).json({ error: "company_id required" });
  if (!month)
    return res.status(400).json({ error: "month (YYYY-MM) required" });

  const start = `${month}-01`;
  const end = dayjs(start).endOf("month").format("YYYY-MM-DD");

  const { data, error } = await supabaseAdmin
    .from("attendance_records")
    .select(
      `
      id,
      start_date,
      end_date,
      days,
      reason,
      member_id,
      company_members (
        id,
        profiles (
          nickname
        )
      )
    `
    )
    .eq("company_id", company_id)
    .gte("start_date", start)
    .lte("end_date", end)
    .order("start_date", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  const result = data.map((r) => ({
    id: r.id,
    user_name: r.company_members?.profiles?.nickname || "-",
    start_date: r.start_date,
    end_date: r.end_date,
    days: r.days,
    reason: r.reason || "-",
  }));

  return res.json({ data: result });
}
