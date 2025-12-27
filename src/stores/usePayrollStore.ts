import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useCompanyStore } from "@/stores/useCompanyStore";
import dayjs from "dayjs";

// 1. 급여 레코드 타입 정의 (A/B 통합)
export interface PayrollRecord {
  id?: string;
  company_id: string;
  pay_month: string;
  payroll_type: "A" | "B";
  status: string;

  // 기본 정보
  user_name: string;
  dept_name?: string;
  position?: string;

  // [지급 항목]
  base_salary: number;
  fixed_ot_pay?: number; // A전용
  fixed_night_pay?: number; // A전용
  ot_pay: number; // A(추가연장), B(연장수당)
  annual_leave_pay: number;
  childcare_allowance: number;
  car_allowance: number;
  meal_allowance: number;
  annual_leave_settle?: number; // A전용
  night_work_pay?: number; // A전용
  unused_off_pay?: number; // A전용
  position_allowance: number;
  duty_allowance?: number; // A전용
  bonus: number;
  incentive: number;
  adjustment_pay: number;

  // [공제 항목]
  employment_insurance: number;
  health_insurance: number;
  longterm_care: number;
  national_pension: number;
  income_tax: number;
  local_income_tax: number;
  tax_settlement: number;

  // [계산 결과]
  total_amount: number; // 급여총액
  total_deduction: number; // 공제총액
  net_amount: number; // 실수령액

  note?: string;
  created_at?: string;
  updated_at?: string;
}

interface PayrollState {
  list: PayrollRecord[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  totalAmountSum: number;
  netAmountSum: number;

  // Actions
  fetchRecords: (
    page?: number,
    pageSize?: number,
    month?: Date | null
  ) => Promise<void>;
  uploadExcelData: (
    data: Partial<PayrollRecord>[],
    month: Date,
    type: "A" | "B"
  ) => Promise<void>;
  deleteAllRecords: (month: Date) => Promise<void>;
  downloadAllRecords: (month: Date) => Promise<PayrollRecord[]>;
  setPage: (page: number) => void;
  clear: () => void;
}

export const usePayrollStore = create<PayrollState>((set, get) => ({
  list: [],
  total: 0,
  loading: false,
  page: 1,
  pageSize: 10,
  totalAmountSum: 0,
  netAmountSum: 0,

  /**
   * ✅ 급여 목록 및 합계 데이터 조회
   */
  fetchRecords: async (page = 1, pageSize = 10, month?: Date | null) => {
    const { currentCompanyId } = useCompanyStore.getState();
    if (!currentCompanyId) return;

    set({ loading: true, page, pageSize });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const formattedMonth = month ? dayjs(month).format("YYYY-MM") : null;

    // 1. 목록 쿼리
    let query = supabase
      .from("payroll_records")
      .select("*", { count: "exact" })
      .eq("company_id", currentCompanyId)
      .order("user_name", { ascending: true }) // 이름순 정렬
      .range(from, to);

    if (formattedMonth) {
      query = query.eq("pay_month", formattedMonth);
    }

    // 2. 합계 데이터 쿼리 (RPC 호출)
    const { data: sums, error: sumError } = await supabase.rpc(
      "get_payroll_sums",
      {
        p_company_id: currentCompanyId,
        p_pay_month: formattedMonth,
      }
    );

    const { data, count, error } = await query;

    if (error || sumError) {
      console.error(
        "❌ fetchRecords error:",
        error?.message || sumError?.message
      );
      set({ loading: false });
      return;
    }

    set({
      list: (data as PayrollRecord[]) || [],
      total: count || 0,
      totalAmountSum: sums?.[0]?.total_amount_sum ?? 0,
      netAmountSum: sums?.[0]?.net_amount_sum ?? 0,
      loading: false,
    });
  },

  /**
   * ✅ 엑셀 데이터 대량 업로드 (Bulk Insert)
   */
  uploadExcelData: async (data, month, type) => {
    const { currentCompanyId } = useCompanyStore.getState();
    if (!currentCompanyId) throw new Error("회사 정보가 없습니다.");

    const formattedMonth = dayjs(month).format("YYYY-MM");

    // DB 스키마에 맞게 데이터 가공
    const finalData = data.map((item) => ({
      ...item,
      company_id: currentCompanyId,
      pay_month: formattedMonth,
      payroll_type: type,
    }));

    set({ loading: true });

    const { error } = await supabase.from("payroll_records").insert(finalData);

    if (error) {
      set({ loading: false });
      throw error;
    }

    // 업로드 성공 후 첫 페이지로 이동 및 목록 새로고침
    await get().fetchRecords(1, get().pageSize, month);
  },

  /**
   * ✅ 해당 월 데이터 전체 삭제
   */
  deleteAllRecords: async (month) => {
    const { currentCompanyId } = useCompanyStore.getState();
    if (!currentCompanyId) return;

    const formattedMonth = dayjs(month).format("YYYY-MM");

    set({ loading: true });

    const { error } = await supabase
      .from("payroll_records")
      .delete()
      .eq("company_id", currentCompanyId)
      .eq("pay_month", formattedMonth);

    if (error) {
      set({ loading: false });
      throw error;
    }

    // 삭제 성공 후 목록 새로고침 (데이터가 없으므로 빈 리스트가 됨)
    await get().fetchRecords(1, get().pageSize, month);
  },
  downloadAllRecords: async (month: Date) => {
    const { currentCompanyId } = useCompanyStore.getState();
    if (!currentCompanyId) return [];

    const formattedMonth = dayjs(month).format("YYYY-MM");

    const { data, error } = await supabase
      .from("payroll_records")
      .select("*")
      .eq("company_id", currentCompanyId)
      .eq("pay_month", formattedMonth)
      .order("user_name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  setPage: (page) => set({ page }),

  clear: () => set({ list: [], total: 0, loading: false, page: 1 }),
}));
