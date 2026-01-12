// actions/workerActions.ts
import { supabase } from "@/lib/supabase";

// ----------------------------------------------------------
// 1) Fetch Workers with pagination
// ----------------------------------------------------------
export const fetchWorkers = async (
  companyId: string,
  page: number,
  size: number,
  sortKey: string = "created_at", // 기본값
  sortOrder: "asc" | "desc" = "desc" // 기본값
) => {
  const from = (page - 1) * size;
  const to = from + size - 1;

  const { data, count, error } = await supabase
    .from("workers")
    .select("*", { count: "exact" })
    .eq("company_id", companyId)
    // ✅ 정렬 로직 적용
    .order(sortKey, { ascending: sortOrder === "asc" })
    .range(from, to);

  if (error) throw error;

  return {
    list: data,
    total: count || 0,
  };
};
// ----------------------------------------------------------
// 2) Create Worker
// ----------------------------------------------------------
export async function createWorker(
  params: Worker.CreateWorkerParams
): Promise<Worker.Worker> {
  const { data, error } = await supabase
    .from("workers")
    .insert([
      {
        company_id: params.company_id,
        name: params.name,
        email: params.email ?? null,
        department: params.department ?? null,
        position: params.position ?? null,
        joined_at: params.joined_at ?? null,
        total_leave: params.total_leave ?? 0,
        used_leave: params.used_leave ?? 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data!;
}

// ----------------------------------------------------------
// 3) Update Worker
// ----------------------------------------------------------
export async function updateWorker(
  id: string,
  data: Worker.UpdateWorkerParams
): Promise<Worker.Worker> {
  const { data: updated, error } = await supabase
    .from("workers")
    .update({
      ...data,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return updated!;
}

// ----------------------------------------------------------
// 4) Delete Worker
// ----------------------------------------------------------
export async function deleteWorker(id: string): Promise<boolean> {
  const { error } = await supabase.from("workers").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function fetchAllWorkers(companyId: string) {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
