import { create } from "zustand";
import {
  fetchExpenses,
  insertExpense,
  fetchExpenseSummary,
  updateExpense,
  deleteExpense,
} from "@/actions/expenseActions";

interface Expense {
  id: number;
  company_id: string;
  user_id: string;
  category: "fixed" | "variable" | "other";
  date: string;
  method: string;
  place: string;
  amount: number;
  memo?: string;
}
interface ExpenseSummary {
  fixed: number;
  variable: number;
  other: number;
}

interface ExpenseStore {
  list: Expense[];
  loading: boolean;

  summary: ExpenseSummary;
  loadSummary: (companyId: string, month: Date) => Promise<void>;
  loadExpenses: (
    companyId: string,
    category: "fixed" | "variable" | "other",
    month: Date,
    page: number
  ) => Promise<void>;

  addExpense: (payload: {
    user_id: string;
    company_id: string;
    category: "fixed" | "variable" | "other";
    date: Date;
    method: string;
    place: string;
    amount: number;
    memo?: string;
  }) => Promise<void>;
  updateExpense: (id: number, payload: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  list: [],
  loading: false,
  summary: { fixed: 0, variable: 0, other: 0 },

  loadSummary: async (companyId, month) => {
    const data = await fetchExpenseSummary({
      company_id: companyId,
      month,
    });

    // RPC 결과는 배열 1개가 return됨
    const row = data?.[0] || {};

    set({
      summary: {
        fixed: row.fixed_sum || 0,
        variable: row.variable_sum || 0,
        other: row.other_sum || 0,
      },
    });
  },
  loadExpenses: async (companyId, category, month, page) => {
    set({ loading: true });
    const data = await fetchExpenses({
      company_id: companyId,
      category,
      month,
      page,
    });
    set({ list: data, loading: false });
  },

  addExpense: async (payload) => {
    await insertExpense(payload);
    // 다시 fetch 하도록: loadExpenses 호출은 외부에서 하게 하자
  },
  updateExpense: async (id, payload) => {
    if (!payload.date) return;
    await updateExpense(id, {
      date: payload.date,
      method: payload.method || "",
      place: payload.place || "",
      amount: payload.amount || 0,
      memo: payload.memo || "",
    });
  },
  deleteExpense: async (id: number) => {
    await deleteExpense(id);
  },
}));
