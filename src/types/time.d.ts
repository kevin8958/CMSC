namespace Time {
  export interface TimeLog {
    id: string;
    company_id: string;
    worker_id: string;
    work_date: string;
    clock_in: string | null;
    clock_out: string | null;
    remarks: string | null;
    created_at: string;
    // Join 정보
    worker?: {
      name: string;
      department: string | null;
      position: string | null;
    };
  }

  export interface CreateTimeParams {
    company_id: string;
    worker_id: string;
    work_date: string;
    clock_in?: string | null;
    clock_out?: string | null;
    remarks?: string | null;
  }

  export interface UpdateTimeParams {
    work_date?: string;
    clock_in?: string | null;
    clock_out?: string | null;
    remarks?: string | null;
  }
}
