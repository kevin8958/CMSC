import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

type CreateChecklistParams = {
  company_id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  created_by: string;
};

export interface ChecklistComment {
  id: string;
  checklist_id: string;
  content: string;
  created_by: string;
  created_at: string;
  nickname: string | null;
}
export async function fetchChecklist(companyId: string) {
  const { data, error } = await supabase
    .from("checklist")
    .select(
      `
      *,
      comments:checklist_comments(count)
    `
    )
    .eq("company_id", companyId)
    .order("sort_index", { ascending: true });

  if (error) throw error;

  // comments 구조는 [{ count: number }] 형태이므로 변환 필요
  return (
    data?.map((item) => ({
      ...item,
      comment_count: item.comments?.[0]?.count ?? 0,
    })) ?? []
  );
}

export async function createChecklist(params: CreateChecklistParams) {
  const { data, error } = await supabase
    .from("checklist")
    .insert([
      {
        company_id: params.company_id,
        title: params.title,
        description: params.description ?? null,
        due_date: params.due_date ?? null,
        created_by: params.created_by,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateChecklist(id: string, data: any) {
  const { data: updated, error } = await supabase
    .from("checklist")
    .update({
      ...data,
      updated_at: dayjs().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

export async function deleteChecklist(id: string) {
  const { error } = await supabase.from("checklist").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function updateChecklistOrder(
  companyId: string,
  updates: Array<{ id: string; sort_index: number }>
) {
  const promises = updates.map((item) =>
    supabase
      .from("checklist")
      .update({ sort_index: item.sort_index })
      .eq("id", item.id)
  );

  await Promise.all(promises);

  // 안정화: 최신 데이터 반환
  return fetchChecklist(companyId);
}
export async function fetchChecklistComments(checklistId: string) {
  const { data, error } = await supabase.rpc("get_checklist_comments", {
    cid: checklistId,
  });

  if (error) throw error;
  return data || [];
}
export async function createChecklistComment(
  checklistId: string,
  content: string,
  createdBy: string
) {
  const { data, error } = await supabase
    .from("checklist_comments")
    .insert([
      {
        checklist_id: checklistId,
        content,
        created_by: createdBy,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
export async function deleteChecklistComment(id: string) {
  const { error } = await supabase
    .from("checklist_comments")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
