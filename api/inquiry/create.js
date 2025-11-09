import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);
  if (!user) return res.status(401).json({ error: "Invalid user" });

  const { phone, name, position, content, company_id } = req.body;

  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .insert({
      phone,
      name,
      position,
      content,
      company_id,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ inquiry: data });
}
