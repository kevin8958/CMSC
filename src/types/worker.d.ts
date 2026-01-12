namespace Worker {
  interface Worker {
    id: string;
    company_id: string;
    name: string;
    email: string | null;
    department: string | null;
    position: string | null;
    birth_date?: string;
    phone?: string;
    has_health_insurance_dependent: boolean;
    has_dependent_deduction: boolean;
    has_additional_deduction: boolean;
    has_student_loan_deduction: boolean;
    has_youth_deduction: boolean;
    memo?: string;
    joined_at: string | null;
    total_leave: number;
    used_leave: number;
    created_at: string;
  }
  interface CreateWorkerParams {
    company_id: string;
    name: string;
    email?: string | null;
    department?: string | null;
    position?: string | null;
    birth_date?: string;
    phone?: string;
    has_health_insurance_dependent?: boolean;
    has_dependent_deduction?: boolean;
    has_additional_deduction?: boolean;
    has_student_loan_deduction?: boolean;
    has_youth_deduction?: boolean;
    memo?: string;
    joined_at?: string | null;
    total_leave?: number;
    used_leave?: number;
  }
  interface UpdateWorkerParams {
    name: string;
    email?: string | null;
    department?: string | null;
    position?: string | null;
    birth_date?: string;
    phone?: string;
    has_health_insurance_dependent?: boolean;
    has_dependent_deduction?: boolean;
    has_additional_deduction?: boolean;
    has_student_loan_deduction?: boolean;
    has_youth_deduction?: boolean;
    memo?: string;
    joined_at?: string | null;
    total_leave?: number;
    used_leave?: number;
  }
  type WorkerFormData = {
    name: string;
    email: string | null;
    department: string | null;
    position: string | null;
    birth_date?: string;
    phone?: string;
    has_health_insurance_dependent?: boolean;
    has_dependent_deduction?: boolean;
    has_additional_deduction?: boolean;
    has_student_loan_deduction?: boolean;
    has_youth_deduction?: boolean;
    memo?: string;
    joined_at: string | null;
    total_leave: number;
    used_leave: number;
  };
}
