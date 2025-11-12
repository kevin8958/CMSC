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
    user_id: string | null;

    pay_month: string; // YYYY-MM-DD 형식
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

    // 계산 컬럼 (Generated)
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
    user_id: string | null;

    pay_month: string; // YYYY-MM-DD
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

    send_date?: string | null;
  }

  // ────────────────────────────────
  // Update 시 사용 타입
  // ────────────────────────────────
  interface Update extends Partial<Insert> {
    id: string;
  }

  // ────────────────────────────────
  // Frontend 전용 (UI에서 쓰기 좋은 타입)
  // ────────────────────────────────
  interface FormData {
    member: string; // user_id
    pay_month: Date;
    status: SalaryStatus;
    emp_type: EmpType;

    work_days: string;
    base_work_days: string;
    absent_days: string;

    base_salary: string;
    non_taxable: string;
    bonus: string;
    allowance: string;

    income_tax: string;
    local_tax: string;

    pension_fee: string;
    health_fee: string;
    employment_fee: string;
    longterm_care_fee: string;

    deduction_other: string;
    note: string;
  }
}
