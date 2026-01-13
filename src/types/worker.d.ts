namespace Worker {
  interface Worker {
    id: string;
    company_id: string;
    name: string;
    email: string | null;
    department: string | null;
    position: string | null;
    duty: string | null; // ✅ 직무 추가
    birth_date?: string;
    phone?: string;

    // 공제/보험 설정
    has_health_insurance_dependent: boolean;
    has_dependent_deduction: boolean;
    has_additional_deduction: boolean;
    has_student_loan_deduction: boolean;
    has_youth_deduction: boolean;

    // ✅ 면허 및 교육 정보 추가
    is_license_holder: boolean;

    // 5대 법정의무교육
    edu_sex_harassment: boolean;
    edu_privacy: boolean;
    edu_disability: boolean;
    edu_safety: boolean;
    edu_pension: boolean;

    // 의료기관 특화 교육
    edu_child_abuse: boolean;
    edu_elder_abuse: boolean;
    edu_emergency: boolean;
    edu_disability_abuse: boolean;
    edu_infection: boolean;

    // 면허 보수교육
    edu_license_maintenance: boolean;

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
    duty?: string | null; // ✅ 추가
    birth_date?: string;
    phone?: string;
    has_health_insurance_dependent?: boolean;
    has_dependent_deduction?: boolean;
    has_additional_deduction?: boolean;
    has_student_loan_deduction?: boolean;
    has_youth_deduction?: boolean;

    // ✅ 교육 관련 파라미터 추가
    is_license_holder?: boolean;
    edu_sex_harassment?: boolean;
    edu_privacy?: boolean;
    edu_disability?: boolean;
    edu_safety?: boolean;
    edu_pension?: boolean;
    edu_child_abuse?: boolean;
    edu_elder_abuse?: boolean;
    edu_emergency?: boolean;
    edu_disability_abuse?: boolean;
    edu_infection?: boolean;
    edu_license_maintenance?: boolean;

    memo?: string;
    joined_at?: string | null;
    total_leave?: number;
    used_leave?: number;
  }

  interface UpdateWorkerParams {
    name?: string;
    email?: string | null;
    department?: string | null;
    position?: string | null;
    duty?: string | null; // ✅ 추가
    birth_date?: string;
    phone?: string;
    has_health_insurance_dependent?: boolean;
    has_dependent_deduction?: boolean;
    has_additional_deduction?: boolean;
    has_student_loan_deduction?: boolean;
    has_youth_deduction?: boolean;

    // ✅ 교육 관련 파라미터 추가
    is_license_holder?: boolean;
    edu_sex_harassment?: boolean;
    edu_privacy?: boolean;
    edu_disability?: boolean;
    edu_safety?: boolean;
    edu_pension?: boolean;
    edu_child_abuse?: boolean;
    edu_elder_abuse?: boolean;
    edu_emergency?: boolean;
    edu_disability_abuse?: boolean;
    edu_infection?: boolean;
    edu_license_maintenance?: boolean;

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
    duty: string | null; // ✅ 추가
    birth_date?: string;
    phone?: string;
    has_health_insurance_dependent?: boolean;
    has_dependent_deduction?: boolean;
    has_additional_deduction?: boolean;
    has_student_loan_deduction?: boolean;
    has_youth_deduction?: boolean;

    // ✅ 교육 관련 데이터 추가
    is_license_holder?: boolean;
    edu_sex_harassment?: boolean;
    edu_privacy?: boolean;
    edu_disability?: boolean;
    edu_safety?: boolean;
    edu_pension?: boolean;
    edu_child_abuse?: boolean;
    edu_elder_abuse?: boolean;
    edu_emergency?: boolean;
    edu_disability_abuse?: boolean;
    edu_infection?: boolean;
    edu_license_maintenance?: boolean;

    memo?: string;
    joined_at: string | null;
    total_leave: number;
    used_leave: number;
  };
}
