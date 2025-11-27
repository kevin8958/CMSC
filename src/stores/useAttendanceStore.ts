import { create } from "zustand";

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
  records: YearlyAttendance[];
  monthlyRecords: MonthlyRecord[];
  monthlyLoading: boolean;

  selectMember: (member: any) => void;
  fetchMemberRecords: (memberId: string) => Promise<void>;
  clearRecords: () => void;
  fetchMonthlyRecords: (companyId: string, month: string) => Promise<void>;

  createRecord: (data: NewAttendanceInput) => Promise<void>;
  updateRecord: (data: any) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  members: [],
  memberLoading: false,
  recordLoading: false,
  selectedMember: null,
  records: [],

  // ✅ 특정 멤버 선택
  selectMember: (member) => set({ selectedMember: member }),

  // ✅ 특정 멤버의 연차 내역 불러오기
  fetchMemberRecords: async (memberId) => {
    set({ recordLoading: true });
    try {
      const res = await fetch(`/api/attendance/list?member_id=${memberId}`);
      const { data } = await res.json();
      set({ records: data || [] });
    } catch (err) {
      console.error("❌ fetchMemberRecords error:", err);
      set({ records: [] });
    } finally {
      set({ recordLoading: false });
    }
  },

  // ✅ Drawer 닫을 때 초기화
  clearRecords: () => set({ records: [] }),

  monthlyRecords: [],
  monthlyLoading: false,

  fetchMonthlyRecords: async (companyId, month) => {
    set({ monthlyLoading: true });
    try {
      const res = await fetch(
        `/api/attendance/monthly?company_id=${companyId}&month=${month}`
      );
      const { data } = await res.json();
      set({ monthlyRecords: data || [] });
    } catch (err) {
      console.error("❌ fetchMonthlyRecords error:", err);
      set({ monthlyRecords: [] });
    } finally {
      set({ monthlyLoading: false });
    }
  },
  createRecord: async (data) => {
    try {
      const res = await fetch(`/api/attendance/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Create failed");
    } catch (err) {
      console.error("❌ createRecord error:", err);
    }
  },
  updateRecord: async (updated) => {
    try {
      const res = await fetch(`/api/attendance/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      console.error("❌ updateRecord error:", err);
    }
  },

  deleteRecord: async (id) => {
    try {
      await fetch(`/api/attendance/delete?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("❌ deleteRecord error:", err);
    }
  },
}));
