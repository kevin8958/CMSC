import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { companyId } = req.query;
  const page = Number(req.query.page || 1);
  const size = Number(req.query.size || 10);
  const from = (page - 1) * size;
  const to = from + size - 1;

  if (!companyId) return res.status(400).json({ error: "companyId required" });

  const { data, count, error } = await supabaseAdmin
    .from("company_members")
    .select(
      `
      user_id,
      role,
      joined_at,
      created_at,
      profiles(id, display_name, email)
    `,
      { count: "exact" }
    )
    .eq("company_id", companyId)
    .eq("deleted", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ data, count });
}
