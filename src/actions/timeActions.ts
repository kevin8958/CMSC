import { supabase } from "@/lib/supabase";

export const fetchTimeLogs = async (
  companyId: string,
  page: number,
  size: number,
  sortKey: string = "work_date",
  sortOrder: "asc" | "desc" = "desc",
  searchTerm: string = "",
  filters: {
    departments: string[];
    positions: string[];
    dateRange: { start: string; end: string };
  }
) => {
  const from = (page - 1) * size;
  const to = from + size - 1;

  // 기본 쿼리: workers 테이블과 조인하여 이름/부서/직급 정보 가져오기
  let query = supabase
    .from("time_logs")
    .select(
      `
      *,
      worker:workers!inner(name, department, position)
    `,
      { count: "exact" }
    )
    .eq("company_id", companyId)
    .gte("work_date", filters.dateRange.start)
    .lte("work_date", filters.dateRange.end);

  // 검색어 처리 (근로자 이름 검색)
  if (searchTerm) {
    query = query.ilike("worker.name", `%${searchTerm}%`);
  }

  // 부서/직급 필터 처리 (미지정 포함)
  const applyFilter = (column: string, values: string[]) => {
    if (values.length === 0) return;
    const hasUnassigned = values.includes("미지정");
    const actualValues = values.filter((v) => v !== "미지정");

    if (hasUnassigned && actualValues.length > 0) {
      query = query.or(
        `worker.${column}.in.(${actualValues.join(",")}),worker.${column}.is.null`
      );
    } else if (hasUnassigned) {
      query = query.is(`worker.${column}`, null);
    } else {
      query = query.in(`worker.${column}`, actualValues);
    }
  };

  applyFilter("department", filters.departments);
  applyFilter("position", filters.positions);

  const { data, count, error } = await query
    .order(sortKey, { ascending: sortOrder === "asc" })
    .range(from, to);

  if (error) throw error;

  return {
    list:
      data.map((item: any) => ({
        ...item,
        name: item.worker.name,
        department: item.worker.department,
        position: item.worker.position,
      })) || [],
    total: count || 0,
  };
};

export const createTimeLog = async (params: Time.CreateTimeParams) => {
  const { data, error } = await supabase
    .from("time_logs")
    .insert([params])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateTimeLog = async (
  id: string,
  params: Time.UpdateTimeParams
) => {
  const { data, error } = await supabase
    .from("time_logs")
    .update(params)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteTimeLog = async (id: string) => {
  const { error } = await supabase.from("time_logs").delete().eq("id", id);
  if (error) throw error;
  return true;
};
