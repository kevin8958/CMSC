import { create } from "zustand";
import {
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "@/actions/noticeActions";

interface NoticeStore {
  list: Dashboard.Notice[];
  loading: boolean;

  fetch: (companyId: string, selectedDate: string) => Promise<void>;
  create: (body: any) => Promise<void>;
  update: (id: string, body: any) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useNoticeStore = create<NoticeStore>((set, get) => ({
  list: [],
  loading: false,

  fetch: async (companyId, selectedDate) => {
    set({ loading: true });
    const data = await fetchNotices(companyId, selectedDate);
    set({ list: data, loading: false });
  },

  create: async (body) => {
    const row = await createNotice(body);
    set({ list: [...get().list, row] });
  },

  update: async (id, body) => {
    const row = await updateNotice(id, body);
    set({
      list: get().list.map((n) => (n.id === id ? row : n)),
    });
  },

  remove: async (id) => {
    await deleteNotice(id);
    set({
      list: get().list.filter((n) => n.id !== id),
    });
  },
}));
