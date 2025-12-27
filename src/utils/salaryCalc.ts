// src/utils/salaryCalc.ts
export type SalaryCalcInput = {
  base_salary: number; // 급여
  non_taxable: number; // 비과세급
  base_work_days: number; // 소정근로일수
  absent_days: number; // 미달근무일
  bonus: number; // 상여금
  allowance: number; // 수당
  income_tax: number; // 소득세
  local_tax: number; // 지방소득세
  pension_fee: number; // 국민연금
  health_fee: number; // 건강보험
  employment_fee: number; // 고용보험
  longterm_care_fee: number; // 장기요양
  deduction_other: number; // 기타공제
};

export type SalaryCalcOutput = {
  recognized_amount: number;
  total_amount: number;
  tax_total: number;
  insurance_total: number;
  net_amount: number;
};

export function calcSalary(i: SalaryCalcInput): SalaryCalcOutput {
  const base = Number(i.base_salary) || 0;
  const nonTax = Number(i.non_taxable) || 0;
  const baseDays = Number(i.base_work_days) || 0;
  const absent = Number(i.absent_days) || 0;

  const bonus = Number(i.bonus) || 0;
  const allowance = Number(i.allowance) || 0;

  const incomeTax = Number(i.income_tax) || 0;
  const localTax = Number(i.local_tax) || 0;

  const pens = Number(i.pension_fee) || 0;
  const health = Number(i.health_fee) || 0;
  const employ = Number(i.employment_fee) || 0;
  const care = Number(i.longterm_care_fee) || 0;

  const other = Number(i.deduction_other) || 0;

  // ✅ 실질인정금액: (급여 + 비과세급) × ((소정근로일수 - 미달근무일) / 소정근로일수)
  const ratio = baseDays > 0 ? (baseDays - absent) / baseDays : 0;
  const recognized_amount = Math.floor((base + nonTax) * ratio);

  // ✅ 급여총액
  const total_amount = recognized_amount + bonus + allowance;

  // ✅ 세금총액
  const tax_total = incomeTax + localTax;

  // ✅ 4대보험 총액
  const insurance_total = pens + health + employ + care;

  // ✅ 실지급액
  const net_amount = total_amount - tax_total - insurance_total - other;

  return {
    recognized_amount,
    total_amount,
    tax_total,
    insurance_total,
    net_amount,
  };
}
