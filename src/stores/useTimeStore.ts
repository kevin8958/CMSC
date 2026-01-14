import { create } from "zustand";
import {
  fetchTimeLogs,
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
} from "@/actions/timeActions";

interface TimeState {
  logs: any[];
  total: number;
  loading: boolean;
  page: number;
  fetch: (
    companyId: string,
    page: number,
    size: number,
    sortKey: string,
    sortOrder: "asc" | "desc",
    searchTerm: string,
    filters: any
  ) => Promise<void>;
  create: (params: Time.CreateTimeParams) => Promise<void>;
  update: (id: string, params: Time.UpdateTimeParams) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useTimeStore = create<TimeState>((set) => ({
  logs: [],
  total: 0,
  loading: false,
  page: 1,

  fetch: async (
    companyId,
    page,
    size,
    sortKey,
    sortOrder,
    searchTerm,
    filters
  ) => {
    set({ loading: true });
    try {
      const { list, total } = await fetchTimeLogs(
        companyId,
        page,
        size,
        sortKey,
        sortOrder,
        searchTerm,
        filters
      );
      set({ logs: list, total, page });
    } finally {
      set({ loading: false });
    }
  },

  create: async (params) => {
    await createTimeLog(params);
  },

  update: async (id, params) => {
    await updateTimeLog(id, params);
  },

  remove: async (id) => {
    await deleteTimeLog(id);
  },
}));
