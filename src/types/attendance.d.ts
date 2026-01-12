namespace Attendance {
  interface CreateAttendanceParams {
    company_id: string;
    worker_id: string;
    start_date: string;
    end_date: string;
    days: number;
    reason?: string;
    note?: string;
  }
  interface UpdateAttendanceParams {
    id: string;
    start_date: string;
    end_date: string;
    reason?: string | null;
    note?: string | null;
  }
  interface NewAttendanceInput {
    company_id: string;
    worker_id: string;
    start_date: string;
    end_date: string;
    days: number;
    reason?: string;
    note?: string;
  }

  interface MonthlyRecord {
    id: string;
    user_name: string;
    user_position: string;
    user_department: string;
    start_date: string;
    end_date: string;
    days: number;
    reason: string;
  }

  interface AttendanceRecord {
    id: string;
    start_date: string;
    end_date: string;
    days: number;
    reason: string | null;
    note: string | null;
  }

  interface YearlyAttendance {
    year: number;
    used: number;
    records: AttendanceRecord[];
  }

  interface AttendanceState {
    recordLoading: boolean; // 🔹 연차내역 로딩
    selectedMember: any | null;
    monthlyRecords: MonthlyRecord[];
    monthlyLoading: boolean;

    selectMember: (member: any) => void;
    fetchMonthlyRecords: (companyId: string, month: string) => Promise<void>;

    createRecord: (data: NewAttendanceInput) => Promise<void>;
    updateRecord: (data: any) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;

    allRecords: AttendanceRecord[];
    selectedYear: number;
    viewRecords: AttendanceRecord[];

    fetchAll: (workerId: string) => Promise<void>;
    setYear: (year: number) => void;
  }
}
