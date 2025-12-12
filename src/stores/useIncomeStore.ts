import { create } from "zustand";
import {
  getOrCreateStatement,
  fetchRevenue,
  addRevenueItem,
  deleteRevenueItem,
  createCogsItem,
  updateCogsItem,
  deleteCogsItem,
  fetchCogs,
  addSga,
  deleteSga,
  addNonOp,
  deleteNonOp,
  fetchSga,
  fetchNonOp,
} from "@/actions/incomeActions";

interface IncomeStore {
  statement: Income.Statement | null;
  revenues: Income.Item[];
  cogs: Income.Item[];
  sga: Income.Item[];
  nonOpIncome: Income.Item[];
  nonOpExpense: Income.Item[];
  loading: boolean;

  fetchStatement: (companyId: string, yearMonth: string) => Promise<void>;

  // 매출
  addRevenue: (name: string, amount: number) => Promise<void>;
  deleteRevenue: (id: string) => Promise<void>;

  // 매출원가(COGS)
  createCogs: (name: string, amount: number) => Promise<void>;
  updateCogs: (
    id: string,
    data: Partial<Pick<Income.Item, "name" | "amount">>
  ) => Promise<void>;
  deleteCogs: (id: string) => Promise<void>;

  // SGA
  addSga: (name: string, amount: number) => Promise<void>;
  deleteSga: (id: string) => Promise<void>;

  // NON OP
  addNonOpIncome: (name: string, amount: number) => Promise<void>;
  addNonOpExpense: (name: string, amount: number) => Promise<void>;
  deleteNonOp: (id: string) => Promise<void>;
}

export const useIncomeStore = create<IncomeStore>((set, get) => ({
  statement: null,
  revenues: [],
  cogs: [],
  sga: [],
  nonOpIncome: [],
  nonOpExpense: [],
  loading: false,

  fetchStatement: async (companyId, yearMonth) => {
    set({ loading: true });

    const statement = await getOrCreateStatement(companyId, yearMonth);
    const revenues = await fetchRevenue(statement.id);
    const cogs = await fetchCogs(statement.id);
    const sga = await fetchSga(statement.id);
    const nonOpIncome = await fetchNonOp(statement.id, "income");
    const nonOpExpense = await fetchNonOp(statement.id, "expense");

    set({
      statement,
      revenues: revenues || [],
      cogs: cogs || [],
      sga: sga || [],
      nonOpIncome: nonOpIncome || [],
      nonOpExpense: nonOpExpense || [],
      loading: false,
    });
  },
  // setRevenue: async (amount) => {
  //   const st = get().statement;
  //   if (!st) return;

  //   await updateRevenue(st.company_id, st.year_month, amount);

  //   // 최신 데이터 다시 불러오기
  //   await get().fetchStatement(st.company_id, st.year_month);
  // },

  addRevenue: async (name, amount) => {
    const st = get().statement;
    if (!st) return;

    await addRevenueItem(st.id, name, amount);
    await get().fetchStatement(st.company_id, st.year_month);
  },

  deleteRevenue: async (id) => {
    const st = get().statement;
    if (!st) return;

    await deleteRevenueItem(id);
    await get().fetchStatement(st.company_id, st.year_month);
  },

  createCogs: async (name, amount) => {
    const st = get().statement;
    if (!st) return;

    await createCogsItem(st.id, name, amount);

    await get().fetchStatement(st.company_id, st.year_month);
  },

  updateCogs: async (id, data) => {
    const st = get().statement;
    if (!st) return;

    await updateCogsItem(id, data);

    await get().fetchStatement(st.company_id, st.year_month);
  },

  deleteCogs: async (id) => {
    const st = get().statement;
    if (!st) return;

    await deleteCogsItem(id);

    await get().fetchStatement(st.company_id, st.year_month);
  },

  addSga: async (name, amount) => {
    const { statement } = get();
    if (!statement) return;
    const item = await addSga(statement.id, name, amount);
    set({ sga: [...get().sga, item] });
    await get().fetchStatement(statement.company_id, statement.year_month);
  },

  deleteSga: async (id) => {
    const { statement } = get();
    if (!statement) return;
    await deleteSga(id);
    set({ sga: get().sga.filter((x) => x.id !== id) });
    await get().fetchStatement(statement.company_id, statement.year_month);
  },

  addNonOpIncome: async (name, amount) => {
    const { statement } = get();
    if (!statement) return;
    const item = await addNonOp(statement.id, "income", name, amount);
    set({ nonOpIncome: [...get().nonOpIncome, item] });
    await get().fetchStatement(statement.company_id, statement.year_month);
  },

  addNonOpExpense: async (name, amount) => {
    const { statement } = get();
    if (!statement) return;
    const item = await addNonOp(statement.id, "expense", name, amount);
    set({ nonOpExpense: [...get().nonOpExpense, item] });
    await get().fetchStatement(statement.company_id, statement.year_month);
  },

  deleteNonOp: async (id) => {
    const { statement } = get();
    if (!statement) return;
    await deleteNonOp(id);
    set({
      nonOpIncome: get().nonOpIncome.filter((x) => x.id !== id),
      nonOpExpense: get().nonOpExpense.filter((x) => x.id !== id),
    });
    await get().fetchStatement(statement.company_id, statement.year_month);
  },
}));
