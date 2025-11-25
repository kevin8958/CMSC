import { supabase } from "@/lib/supabase";

export async function fetchNotices(companyId: string) {
  const { data, error } = await supabase
    .from("company_notices")
    .select("*")
    .eq("company_id", companyId)
    .order("start_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createNotice(body: {
  company_id: number;
  title: string;
  priority: "high" | "mid" | "low";
  start_date: string;
  end_date: string | null;
  description?: string;
}) {
  const { company_id, title, priority, start_date, end_date } = body;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("company_notices")
    .insert({
      company_id,
      title,
      priority,
      start_date,
      end_date,
      created_by: user?.id, // ★ 추가
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNotice(
  id: string,
  body: Partial<{
    title: string;
    priority: "high" | "mid" | "low";
    start_date: string;
    end_date: string | null;
    description?: string;
  }>
) {
  const { data, error } = await supabase
    .from("company_notices")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNotice(id: string) {
  const { error } = await supabase
    .from("company_notices")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
