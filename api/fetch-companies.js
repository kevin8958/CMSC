import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 10);

  const offset = (page - 1) * pageSize;
  const limit = offset + pageSize - 1;

  // ✅ 현재 로그인 유저 가져오기
  const token = req.headers.authorization?.replace("Bearer ", "");
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);

  if (!user)
    return res.status(200).json({
      companies: [],
      total: 0,
      currentCompanyId: null,
    });

  // ✅ 유저 profile
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role, last_selected_company_id")
    .eq("id", user.id)
    .maybeSingle();

  let companies = [];
  let total = 0;

  // ✅ super_admin (pagination)
  if (profile?.role === "super_admin") {
    const { data, count } = await supabaseAdmin
      .from("companies_with_stats")
      .select("*", { count: "exact" })
      .eq("deleted", false)
      .order("created_at", { ascending: false })
      .range(offset, limit);

    companies = data ?? [];
    total = count ?? 0;
  }

  // ✅ admin (여러 회사 소유)
  else if (profile?.role === "admin") {
    const { data } = await supabaseAdmin
      .from("admin_companies")
      .select("companies(id, name)")
      .eq("admin_id", user.id);

    companies = (data ?? []).flatMap((r) =>
      Array.isArray(r.companies) ? r.companies : [r.companies]
    );
    companies.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    total = companies.length;
  }

  // ✅ 일반 유저
  else {
    const { data } = await supabaseAdmin
      .from("company_members")
      .select("companies(id, name)")
      .eq("user_id", user.id)
      .eq("deleted", false);

    companies = (data ?? []).flatMap((r) =>
      Array.isArray(r.companies) ? r.companies : [r.companies]
    );
    total = companies.length;
  }

  return res.status(200).json({
    companies,
    total,
    currentCompanyId:
      profile?.last_selected_company_id || companies[0]?.id || null,
  });
}
