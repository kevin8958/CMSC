// actions/workerActions.ts
import { supabase } from "@/lib/supabase";

// ----------------------------------------------------------
// 1) Fetch Workers with pagination, search, and advanced filters
// ----------------------------------------------------------
export const fetchWorkers = async (
  companyId: string,
  page: number,
  size: number,
  sortKey: string = "created_at",
  sortOrder: "asc" | "desc" = "desc",
  searchTerm: string = "",
  filters: {
    departments: string[];
    positions: string[]; // ✅ 직급 필터 추가
    deductions: string[];
  } = {
    departments: [],
    positions: [],
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

  // 2. 글로벌 검색 (searchTerm) - ✅ duty 추가
  if (searchTerm) {
    query = query.or(
      `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,duty.ilike.%${searchTerm}%,memo.ilike.%${searchTerm}%`
    );
  }

  // 3. "미지정(NULL)" 처리를 위한 필터 헬퍼 함수
  // selectedValues에 "미지정"이 포함되어 있으면 IS NULL 조건을 포함시킵니다.
  const applyAdvancedFilter = (column: string, selectedValues: string[]) => {
    if (!selectedValues || selectedValues.length === 0) return;

    const hasUnassigned = selectedValues.includes("미지정");
    const actualValues = selectedValues.filter((v) => v !== "미지정");

    if (hasUnassigned && actualValues.length > 0) {
      // 값들 중 하나이거나 NULL인 경우: (column IN (...) OR column IS NULL)
      query = query.or(
        `${column}.in.(${actualValues.join(",")}),${column}.is.null`
      );
    } else if (hasUnassigned) {
      // 미지정만 선택된 경우: column IS NULL
      query = query.is(column, null);
    } else {
      // 실제 값들만 선택된 경우: column IN (...)
      query = query.in(column, actualValues);
    }
  };

  // 4. 부서 필터링 (departments) - 미지정 대응
  applyAdvancedFilter("department", filters.departments);

  // 5. 직급 필터링 (positions) - 미지정 대응
  applyAdvancedFilter("position", filters.positions);

  // 6. 공제 항목 필터링 (deductions)
  if (filters.deductions && filters.deductions.length > 0) {
    filters.deductions.forEach((field) => {
      query = query.eq(field, true);
    });
  }

  // 7. 정렬 및 범위 지정 후 실행
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
// 2) Create Worker - ✅ duty 등 신규 필드 반영
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
        phone: params.phone ?? null,
        birth_date: params.birth_date ?? null,
        department: params.department ?? null,
        position: params.position ?? null,
        duty: params.duty ?? null, // ✅ 직무 추가
        joined_at: params.joined_at ?? null,
        memo: params.memo ?? "",
        total_leave: params.total_leave ?? 0,
        used_leave: params.used_leave ?? 0,
        // 공제 설정들
        has_health_insurance_dependent:
          params.has_health_insurance_dependent ?? false,
        has_dependent_deduction: params.has_dependent_deduction ?? false,
        has_additional_deduction: params.has_additional_deduction ?? false,
        has_student_loan_deduction: params.has_student_loan_deduction ?? false,
        has_youth_deduction: params.has_youth_deduction ?? false,
        // 교육 설정들 (필요시 추가)
        edu_sex_harassment: params.edu_sex_harassment ?? false,
        edu_privacy: params.edu_privacy ?? false,
        edu_disability: params.edu_disability ?? false,
        edu_safety: params.edu_safety ?? false,
        edu_pension: params.edu_pension ?? false,
        edu_child_abuse: params.edu_child_abuse ?? false,
        edu_elder_abuse: params.edu_elder_abuse ?? false,
        edu_emergency: params.edu_emergency ?? false,
        edu_disability_abuse: params.edu_disability_abuse ?? false,
        edu_infection: params.edu_infection ?? false,
        is_license_holder: params.is_license_holder ?? false,
        edu_license_maintenance: params.edu_license_maintenance ?? false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("createWorker DB Error:", error);
    throw error;
  }
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

  if (error) {
    console.error("updateWorker DB Error:", error);
    throw error;
  }
  return updated!;
}

// ----------------------------------------------------------
// 4) Delete Worker
// ----------------------------------------------------------
export async function deleteWorker(id: string): Promise<boolean> {
  const { error } = await supabase.from("workers").delete().eq("id", id);

  if (error) {
    console.error("deleteWorker DB Error:", error);
    throw error;
  }
  return true;
}

// ----------------------------------------------------------
// 5) Fetch All Workers (For filter options, etc.)
// ----------------------------------------------------------
export async function fetchAllWorkers(companyId: string) {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchAllWorkers DB Error:", error);
    throw error;
  }
  return data || [];
}
