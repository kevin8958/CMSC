import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { id, start_date, end_date, reason, note } = req.body;

  if (!id) return res.status(400).json({ error: "Missing record id" });

  // 자동 일수 계산
  const start = new Date(start_date);
  const end = new Date(end_date);
  const diffDays = Math.max(
    Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1,
    1
  );

  const { error } = await supabaseAdmin
    .from("attendance_records")
    .update({
      start_date,
      end_date,
      days: diffDays,
      reason,
      note,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ ok: true });
}
