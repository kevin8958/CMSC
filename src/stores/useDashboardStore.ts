import { create } from "zustand";
import { fetchYearlyIncomeStats } from "@/actions/dashboardActions";
import { useCompanyStore } from "./useCompanyStore";

interface MonthlyStat {
  year_month: string;
  revenue: number;
  total_purchase: number;
}

interface DashboardStore {
  year: number;
  data: MonthlyStat[];
  loading: boolean;

  fetchYear: (year: number) => Promise<void>;
  prevYear: () => void;
  nextYear: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  year: new Date().getFullYear(),
  data: [],
  loading: false,

  fetchYear: async (year) => {
    const companyId = useCompanyStore.getState().currentCompanyId!;
    set({ loading: true });

    const raw = await fetchYearlyIncomeStats(companyId, year);

    // ✅ 12개월 기본 배열 생성
    const months = Array.from({ length: 12 }).map((_, idx) => {
      const month = String(idx + 1).padStart(2, "0");
      const ym = `${year}-${month}`;

      const found = raw.find((r) => r.year_month === ym);

      return {
        year_month: ym,
        revenue: found?.revenue ?? 0,
        total_purchase: found?.total_purchase ?? 0,
      };
    });

    set({
      year,
      data: months,
      loading: false,
    });
  },

  prevYear: async () => {
    const next = get().year - 1;
    await get().fetchYear(next);
  },

  nextYear: async () => {
    const next = get().year + 1;
    await get().fetchYear(next);
  },
}));
