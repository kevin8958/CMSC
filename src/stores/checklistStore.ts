import { create } from "zustand";
import {
  fetchChecklist,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  updateChecklistOrder,
  fetchChecklistComments,
  createChecklistComment,
  deleteChecklistComment,
  type ChecklistComment,
} from "@/actions/checklistActions";

interface ChecklistItem {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  sort_index: number;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

type CreateChecklistParams = {
  company_id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  created_by: string;
};

interface ChecklistStore {
  list: ChecklistItem[];
  loading: boolean;
  comments: Record<string, ChecklistComment[]>;

  fetch: (companyId: string) => Promise<void>;
  create: (params: CreateChecklistParams) => Promise<void>;
  update: (id: string, data: Partial<ChecklistItem>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reorder: (
    companyId: string,
    updates: Array<{ id: string; sort_index: number }>
  ) => Promise<void>;

  setList: (list: ChecklistItem[]) => void;

  // ⭐ comments
  fetchComments: (checklistId: string) => Promise<void>;
  addComment: (
    checklistId: string,
    content: string,
    createdBy: string
  ) => Promise<void>;
  deleteComment: (commentId: string, checklistId: string) => Promise<void>;
}

export const useChecklistStore = create<ChecklistStore>((set, get) => ({
  list: [],
  loading: false,
  comments: {},

  setList: (list) => set({ list }),

  fetch: async (companyId) => {
    set({ loading: true });
    const data = await fetchChecklist(companyId);
    set({ list: data, loading: false });
  },

  create: async (params) => {
    const data = await createChecklist(params);
    const current = get().list;
    const newList = [...current, data].sort(
      (a, b) => (a.sort_index ?? 0) - (b.sort_index ?? 0)
    );

    set({ list: newList });
  },

  update: async (id, data) => {
    const updated = await updateChecklist(id, data);
    set({
      list: get().list.map((item) => (item.id === id ? updated : item)),
    });
  },

  remove: async (id) => {
    await deleteChecklist(id);
    set({ list: get().list.filter((item) => item.id !== id) });
  },

  reorder: async (companyId, updates) => {
    const reloaded = await updateChecklistOrder(companyId, updates);
    set({ list: reloaded });
  },

  fetchComments: async (checklistId) => {
    const data = await fetchChecklistComments(checklistId);

    set((state) => ({
      comments: {
        ...state.comments,
        [checklistId]: data,
      },
    }));
  },

  addComment: async (checklistId, content, createdBy) => {
    const created = await createChecklistComment(
      checklistId,
      content,
      createdBy
    );

    set((state) => ({
      comments: {
        ...state.comments,
        [checklistId]: [...(state.comments[checklistId] ?? []), created],
      },
    }));
  },

  deleteComment: async (commentId, checklistId) => {
    await deleteChecklistComment(commentId);
    set((state) => ({
      comments: {
        ...state.comments,
        [checklistId]: state.comments[checklistId].filter(
          (c) => c.id !== commentId
        ),
      },
    }));
  },
}));
