import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { company_id, member_id, start_date, end_date, days, reason, note } =
    req.body;

  if (!company_id || !member_id || !start_date || !end_date)
    return res.status(400).json({ error: "Missing required fields" });

  const { data, error } = await supabaseAdmin
    .from("attendance_records")
    .insert([
      {
        company_id,
        member_id,
        start_date,
        end_date,
        days,
        reason,
        note,
      },
    ])
    .select("id");

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ data });
}
