namespace Income {
  interface Statement {
    id: string;
    company_id: string;
    year_month: string; // "2025-01"
    revenue: number; // 매출
    gross_profit: number; // 매출총이익
    operating_profit: number; // 영업이익
    pre_tax_profit: number; // 세전이익
    created_at: string;
    updated_at: string;
  }
  type Category = "cogs" | "sga" | "non_op_income" | "non_op_expense";
  interface Item {
    id: string;
    statement_id: string;
    category: Category;
    name: string;
    amount: number;
    created_at: string;
  }

  // Insert 용 타입
  interface ItemInsert {
    statement_id: string;
    category: Category;
    name: string;
    amount: number;
  }
  interface Store {
    loading: boolean;

    statement: Statement | null;

    /** 매출원가 */
    cogs: Item[];

    /** 판매관리비 */
    sga: Item[];

    /** 영업외수익 */
    nonOpIncome: Item[];

    /** 영업외비용 */
    nonOpExpense: Item[];

    // Actions
    fetchForMonth: (companyId: string, yearMonth: string) => Promise<void>;

    setRevenue: (value: number) => Promise<void>;

    addCogs: (name: string, amount: number) => Promise<void>;
    deleteCogs: (id: string) => Promise<void>;

    addSga: (name: string, amount: number) => Promise<void>;
    deleteSga: (id: string) => Promise<void>;

    addNonOpIncome: (name: string, amount: number) => Promise<void>;
    addNonOpExpense: (name: string, amount: number) => Promise<void>;
    deleteNonOp: (id: string) => Promise<void>;
  }
}
