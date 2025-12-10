import {
  createAttendanceRecord,
  deleteAttendanceRecord,
  fetchAllAttendance,
  fetchMonthlyAttendance,
  updateAttendanceRecord,
} from "@/actions/attendanceActions";
import { create } from "zustand";
import { useCompanyStore } from "./useCompanyStore";
import dayjs from "dayjs";

export const useAttendanceStore = create<Attendance.AttendanceState>(
  (set, get) => ({
    members: [],
    memberLoading: false,
    recordLoading: false,
    selectedMember: null,

    // ✅ 특정 멤버 선택
    selectMember: (member) => set({ selectedMember: member }),

    monthlyRecords: [],
    monthlyLoading: false,

    fetchMonthlyRecords: async (companyId, month) => {
      set({ monthlyLoading: true });
      try {
        const data = await fetchMonthlyAttendance(companyId, month);
        set({ monthlyRecords: data });
      } finally {
        set({ monthlyLoading: false });
      }
    },
    createRecord: async (data) => {
      try {
        await createAttendanceRecord(data);

        // ✅ 등록 후 현재 선택 월 목록 리프레시
        const { currentCompanyId } = useCompanyStore.getState();
        const month = dayjs(data.start_date).format("yyyy-MM");

        await get().fetchMonthlyRecords(currentCompanyId!, month);
      } catch (err) {
        console.error("❌ createRecord error:", err);
        throw err;
      }
    },
    updateRecord: async (data) => {
      try {
        await updateAttendanceRecord(data);
        // ✅ 수정 후 현재 선택 월 목록 리프레시
        const { currentCompanyId } = useCompanyStore.getState();
        const month = dayjs(data.start_date).format("yyyy-MM");

        await get().fetchMonthlyRecords(currentCompanyId!, month);
      } catch (err) {
        console.error("❌ updateRecord error:", err);
      }
    },
    deleteRecord: async (id) => {
      try {
        await deleteAttendanceRecord(id);
      } catch (err) {
        console.error("❌ deleteRecord error:", err);
      }
    },
    allRecords: [],
    viewRecords: [],
    selectedYear: new Date().getFullYear(),

    fetchAll: async (workerId) => {
      const data = await fetchAllAttendance(workerId);

      const year = get().selectedYear;

      set({
        allRecords: data,
        viewRecords: data.filter(
          (r) => new Date(r.start_date).getFullYear() === year
        ),
      });
    },

    setYear: (year) => {
      const all = get().allRecords;

      set({
        selectedYear: year,
        viewRecords: all.filter(
          (r) => new Date(r.start_date).getFullYear() === year
        ),
      });
    },
  })
);
