// /api/set-current-company.js
import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  const { company_id } = req.body;

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ last_selected_company_id: company_id })
    .eq("id", user.id); // or .eq("user_id", user.id)

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
}
