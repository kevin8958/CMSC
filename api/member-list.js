import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const page = Number(req.query.page || 1);
  const size = Number(req.query.size || 10);
  const from = (page - 1) * size;
  const to = from + size - 1;

  const { data, count, error } = await supabaseAdmin
    .from("profiles")
    .select(
      `
    id,
    email,
    display_name,
    company_members!left(role, joined_at)
  `,
      { count: "exact" }
    )
    .eq("company_members.deleted", false)
    .neq("role", "super_admin") // 👈 이 한줄 추가
    .order("email", { ascending: true })
    .range(from, to);

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ data, count });
}
