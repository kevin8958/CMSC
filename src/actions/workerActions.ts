// actions/workerActions.ts
import { supabase } from "@/lib/supabase";

// ----------------------------------------------------------
// 1) Fetch Workers with pagination
// ----------------------------------------------------------
export const fetchWorkers = async (
  companyId: string,
  page: number,
  size: number,
  sortKey: string = "created_at",
  sortOrder: "asc" | "desc" = "desc",
  searchTerm: string = "",
  filters: { departments: string[]; deductions: string[] } = {
    departments: [],
    deductions: [],
  }
) => {
  const from = (page - 1) * size;
  const to = from + size - 1;

  // 1. 기본 쿼리 생성
  let query = supabase
    .from("workers")
    .select("*", { count: "exact" })
    .eq("company_id", companyId);

  // 2. 글로벌 검색 (searchTerm)
  if (searchTerm) {
    query = query.or(
      `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,memo.ilike.%${searchTerm}%`
    );
  }

  // 3. 부서 필터링 (departments)
  // 선택된 부서가 있을 경우에만 .in() 필터 적용
  if (filters.departments.length > 0) {
    query = query.in("department", filters.departments);
  }

  // 4. 공제 항목 필터링 (deductions)
  // 선택된 불리언 필드들(has_...)에 대해 true인 데이터만 필터링
  if (filters.deductions.length > 0) {
    filters.deductions.forEach((field) => {
      query = query.eq(field, true);
    });
  }

  // 5. 정렬 및 범위 지정 후 실행
  const { data, count, error } = await query
    .order(sortKey, { ascending: sortOrder === "asc" })
    .range(from, to);

  if (error) {
    console.error("fetchWorkers DB Error:", error);
    throw error;
  }

  return {
    list: data || [],
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
