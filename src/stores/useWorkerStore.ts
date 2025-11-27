// stores/useWorkerStore.ts
import { create } from "zustand";
import {
  fetchWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
  type Worker,
  type CreateWorkerParams,
  type UpdateWorkerParams,
  fetchAllWorkers,
} from "@/actions/workerActions";

interface WorkerStore {
  workers: Worker[];
  allList: Worker[];
  loading: boolean;

  total: number;
  page: number;
  pageSize: number;

  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  fetch: (companyId: string, page?: number, size?: number) => Promise<void>;
  create: (data: CreateWorkerParams) => Promise<Worker | null>;
  update: (id: string, data: UpdateWorkerParams) => Promise<Worker | null>;
  remove: (id: string) => Promise<boolean>;
  fetchAll: (companyId: string) => Promise<void>;
}

export const useWorkerStore = create<WorkerStore>((set, get) => ({
  workers: [],
  allList: [],
  loading: false,

  total: 0,
  page: 1,
  pageSize: 10,

  setPage: (page) => set({ page }),
  setPageSize: (size) => set({ pageSize: size }),

  // ----------------------------------------------------------
  // Fetch (pagination 적용)
  // ----------------------------------------------------------
  fetch: async (companyId: string, page, size) => {
    const currentPage = page ?? get().page;
    const currentSize = size ?? get().pageSize;

    set({ loading: true });

    try {
      const { list, total } = await fetchWorkers(
        companyId,
        currentPage,
        currentSize
      );

      set({
        workers: list,
        total: total,
        page: currentPage,
        pageSize: currentSize,
      });
    } catch (err) {
      console.error("❌ fetchWorkers error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ----------------------------------------------------------
  // Create
  // ----------------------------------------------------------
  create: async (data: CreateWorkerParams) => {
    try {
      const created = await createWorker(data);

      set((state) => ({
        workers: [created, ...state.workers],
        total: state.total + 1,
      }));

      return created;
    } catch (err) {
      console.error("❌ createWorker error:", err);
      return null;
    }
  },

  // ----------------------------------------------------------
  // Update
  // ----------------------------------------------------------
  update: async (id: string, data: UpdateWorkerParams) => {
    try {
      const updated = await updateWorker(id, data);

      set((state) => ({
        workers: state.workers.map((w) =>
          w.id === id ? { ...w, ...updated } : w
        ),
      }));

      return updated;
    } catch (err) {
      console.error("❌ updateWorker error:", err);
      return null;
    }
  },

  // ----------------------------------------------------------
  // Delete
  // ----------------------------------------------------------
  remove: async (id: string) => {
    try {
      const ok = await deleteWorker(id);
      if (ok) {
        set((state) => ({
          workers: state.workers.filter((w) => w.id !== id),
          total: state.total - 1,
        }));
      }
      return ok;
    } catch (err) {
      console.error("❌ deleteWorker error:", err);
      return false;
    }
  },
  fetchAll: async (companyId: string) => {
    const data = await fetchAllWorkers(companyId);
    set({ allList: data });
  },
}));
