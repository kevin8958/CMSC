import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useCompanyStore } from "@/stores/useCompanyStore";
import dayjs from "dayjs";

interface SalaryState {
  list: Salary.Row[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  totalAmountSum?: number;
  netAmountSum?: number;

  fetchSalaries: (
    page?: number,
    pageSize?: number,
    month?: Date | null
  ) => Promise<void>;
  addSalary: (data: Salary.Insert) => Promise<void>;
  updateSalary: (id: string, data: Salary.Update) => Promise<void>;
  deleteSalary: (id: string) => Promise<void>;
  clear: () => void;
}

export const useSalaryStore = create<SalaryState>((set, get) => ({
  list: [],
  total: 0,
  loading: false,
  page: 1,
  pageSize: 10,

  // ✅ 급여 목록 불러오기 (페이징 지원)
  fetchSalaries: async (page = 1, pageSize = 10, month?: Date | null) => {
    const { currentCompanyId } = useCompanyStore.getState();
    set({ loading: true, page, pageSize });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("salaries")
      .select("*", { count: "exact" })
      .eq("company_id", currentCompanyId)
      .order("pay_month", { ascending: false })
      .range(from, to);

    if (month) {
      const formatted = dayjs(month).format("yyyy-MM");
      query = query.eq("pay_month", formatted);
    }
    const { data, count, error } = await query;

    const formattedMonth = month ? dayjs(month).format("yyyy-MM") : null;

    const { data: sums, error: sumError } = await supabase.rpc(
      "get_salary_sums",
      {
        p_company_id: currentCompanyId,
        p_pay_month: formattedMonth, // ✅ 추가
      }
    );
    const totalAmountSum = sums?.[0]?.total_amount_sum ?? 0;
    const netAmountSum = sums?.[0]?.net_amount_sum ?? 0;

    if (error || sumError) {
      console.error(
        "❌ fetchSalaries error:",
        error?.message || sumError?.message
      );
      set({ loading: false });
      return;
    }

    set({
      list: data || [],
      total: count || 0,
      totalAmountSum: totalAmountSum || 0,
      netAmountSum: netAmountSum || 0,
      loading: false,
    });
  },

  // ✅ 급여 추가
  addSalary: async (data) => {
    const { error } = await supabase.from("salaries").insert(data);
    if (error) throw error;
    await get().fetchSalaries(get().page, get().pageSize);
  },

  // ✅ 급여 수정
  updateSalary: async (id, data) => {
    const { error } = await supabase.from("salaries").update(data).eq("id", id);
    if (error) throw error;

    const companyId =
      data.company_id || get().list.find((s) => s.id === id)?.company_id;
    if (companyId) await get().fetchSalaries(get().page, get().pageSize);
  },

  // ✅ 급여 삭제
  deleteSalary: async (id) => {
    const current = get().list.find((s) => s.id === id);
    const { error } = await supabase.from("salaries").delete().eq("id", id);
    if (error) throw error;

    if (current?.company_id)
      await get().fetchSalaries(get().page, get().pageSize);
  },

  clear: () => set({ list: [], total: 0, loading: false, page: 1 }),
}));
