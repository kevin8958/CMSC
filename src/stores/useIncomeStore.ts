import { create } from "zustand";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { useCompanyStore } from "./useCompanyStore";
import {
  getOrCreateStatement,
  fetchRevenue,
  fetchCogs,
  fetchSga,
  fetchNonOp,
  recalcRevenue, // 이 함수가 최종적으로 모든 수익/이익을 체인으로 계산함
} from "@/actions/incomeActions";

// 한글 구분 -> DB category 매핑 표
const CATEGORY_MAP: Record<string, string> = {
  매출: "revenue",
  매출원가: "cogs",
  판매관리비: "sga",
  영업외수익: "non_op_income",
  영업외비용: "non_op_expense",
};

export const useIncomeStore = create<any>((set, get) => ({
  statement: null,
  revenues: [],
  cogs: [],
  sga: [],
  nonOpIncome: [],
  nonOpExpense: [],
  loading: false,

  fetchStatement: async (companyId: string, yearMonth: string) => {
    set({ loading: true });
    try {
      const statement = await getOrCreateStatement(companyId, yearMonth);
      const [rev, cog, sga, nInc, nExp] = await Promise.all([
        fetchRevenue(statement.id),
        fetchCogs(statement.id),
        fetchSga(statement.id),
        fetchNonOp(statement.id, "income"),
        fetchNonOp(statement.id, "expense"),
      ]);

      set({
        statement,
        revenues: rev || [],
        cogs: cog || [],
        sga: sga || [],
        nonOpIncome: nInc || [],
        nonOpExpense: nExp || [],
      });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ 엑셀 데이터 벌크 업로드 (수정됨)
  uploadIncomeExcelData: async (parsedData: any[], month: Date) => {
    const { currentCompanyId } = useCompanyStore.getState();
    if (!currentCompanyId) throw new Error("회사 정보가 없습니다.");

    const yearMonth = dayjs(month).format("YYYY-MM");
    set({ loading: true });
    try {
      const statement = await getOrCreateStatement(currentCompanyId, yearMonth);

      const finalItems = parsedData
        .map((d) => ({
          statement_id: statement.id,
          category: CATEGORY_MAP[d.category],
          name: d.name,
          amount: d.amount,
          // description: d.description || "",  <-- 이 줄을 삭제하거나 주석 처리
        }))
        .filter((item) => item.category);

      if (finalItems.length === 0) return;

      // 3. 단일 테이블인 income_items에 벌크 인서트
      const { error } = await supabase.from("income_items").insert(finalItems);
      if (error) throw error;

      // 4. ✅ 중요: 통계 데이터 재계산 실행
      // recalcRevenue가 호출되면 내부적으로 recalcGrossProfit -> recalcOperatingProfit -> recalcPreTaxProfit 순으로 실행됨
      await recalcRevenue(statement.id);

      // 5. 최신 데이터 리프레시
      await get().fetchStatement(currentCompanyId, yearMonth);
    } finally {
      set({ loading: false });
    }
  },

  // ✅ 엑셀 다운로드용 데이터 (수정됨)
  downloadAllIncomeRecords: async () => {
    const { revenues, cogs, sga, nonOpIncome, nonOpExpense } = get();
    // 한글로 다시 역변환해서 내보냄
    return [
      ...revenues.map((d: any) => ({ ...d, category_name: "매출" })),
      ...cogs.map((d: any) => ({ ...d, category_name: "매출원가" })),
      ...sga.map((d: any) => ({ ...d, category_name: "판매관리비" })),
      ...nonOpIncome.map((d: any) => ({ ...d, category_name: "영업외수익" })),
      ...nonOpExpense.map((d: any) => ({ ...d, category_name: "영업외비용" })),
    ];
  },

  // ✅ 전체 삭제 (수정됨)
  deleteAllIncomeData: async () => {
    const { statement } = get();
    if (!statement) return;

    set({ loading: true });
    try {
      // income_items 테이블에서 현재 statement_id를 가진 모든 데이터 삭제
      const { error } = await supabase
        .from("income_items")
        .delete()
        .eq("statement_id", statement.id);

      if (error) throw error;

      // 삭제 후 다시 통계 재계산 (모두 0원이 됨)
      await recalcRevenue(statement.id);
      await get().fetchStatement(statement.company_id, statement.year_month);
    } finally {
      set({ loading: false });
    }
  },
}));
