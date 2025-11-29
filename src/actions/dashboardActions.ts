import { supabase } from "@/lib/supabase";

export async function fetchYearlyIncomeStats(companyId: string, year: number) {
  const start = `${year}-01`;
  const end = `${year}-12`;

  const { data, error } = await supabase
    .from("dashboard_income_yearly")
    .select("*")
    .eq("company_id", companyId)
    .gte("year_month", start)
    .lte("year_month", end)
    .order("year_month");

  if (error) throw error;
  return data || [];
}
