namespace Salary {
  // 급여 상태
  type SalaryStatus = "pending" | "reviewed" | "paid";

  // 고용 형태
  type EmpType = "정규직" | "계약직" | "프리랜서";

  // ────────────────────────────────
  // DB Row (전체 컬럼 구조)
  // ────────────────────────────────
  interface Row {
    id: string;
    company_id: string;
    worker_id: string | null;
    user_name: string | null; // ✅ 추가

    pay_month: string; // YYYY-MM 형식
    status: SalaryStatus;
    emp_type: EmpType;

    work_days: number;
    base_work_days: number;
    absent_days: number;

    base_salary: number;
    non_taxable: number;
    bonus: number;
    allowance: number;

    income_tax: number;
    local_tax: number;

    pension_fee: number;
    health_fee: number;
    employment_fee: number;
    longterm_care_fee: number;

    deduction_other: number;
    note: string | null;

    recognized_amount: number;
    total_amount: number;
    tax_total: number;
    insurance_total: number;
    net_amount: number;

    send_date: string | null;
    created_at: string;
    updated_at: string;
  }

  // ────────────────────────────────
  // Insert 시 사용 타입
  // ────────────────────────────────
  interface Insert {
    company_id: string;
    worker_id: string | null;
    user_name?: string | null; // ✅ 추가

    pay_month: string;
    status?: SalaryStatus;
    emp_type?: EmpType;

    work_days?: number;
    base_work_days?: number;
    absent_days?: number;

    base_salary?: number;
    non_taxable?: number;
    bonus?: number;
    allowance?: number;

    income_tax?: number;
    local_tax?: number;

    pension_fee?: number;
    health_fee?: number;
    employment_fee?: number;
    longterm_care_fee?: number;

    deduction_other?: number;
    note?: string;

    recognized_amount?: number;
    total_amount?: number;
    tax_total?: number;
    insurance_total?: number;
    net_amount?: number;

    send_date?: string | null;
  }

  // ────────────────────────────────
  // Update 시 사용 타입
  // ────────────────────────────────
  interface Update extends Partial<Insert> {
    id: string;
  }

  interface SalaryDrawerProps {
    open: boolean;
    month: Date | null;
    mode: "create" | "edit";
    salary?: any;
    workers: Worker.Worker[];
    onClose: () => void;
    onConfirm: (data: Omit<Salary.Insert, "company_id">) => Promise<void>;
    onEdit: (data: Omit<Salary.Update, "company_id">) => Promise<void>;
    onDelete?: () => Promise<void>;
  }
}
