// stores/useWorkerStore.ts
import { create } from "zustand";
import {
  fetchWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
  fetchAllWorkers,
} from "@/actions/workerActions";

interface WorkerStore {
  workers: Worker.Worker[];
  allList: Worker.Worker[];
  loading: boolean;
  allListLoading: boolean;

  total: number;
  page: number;
  pageSize: number;
  // ✅ 정렬 상태 추가
  sortKey: string;
  sortOrder: "asc" | "desc";
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // ✅ fetch 함수 파라미터 확장
  fetch: (
    companyId: string,
    page?: number,
    size?: number,
    sortKey?: string,
    sortOrder?: "asc" | "desc",
    searchTerm?: string
  ) => Promise<void>;

  create: (data: Worker.CreateWorkerParams) => Promise<Worker.Worker | null>;
  update: (
    id: string,
    data: Worker.UpdateWorkerParams
  ) => Promise<Worker.Worker | null>;
  remove: (id: string) => Promise<boolean>;
  fetchAll: (companyId: string) => Promise<void>;
}

export const useWorkerStore = create<WorkerStore>((set, get) => ({
  workers: [],
  allList: [],
  loading: false,
  allListLoading: false,

  total: 0,
  page: 1,
  pageSize: 10,
  // ✅ 기본 정렬값 설정
  sortKey: "created_at",
  sortOrder: "desc",
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),

  setPage: (page) => set({ page }),
  setPageSize: (size) => set({ pageSize: size }),

  // ----------------------------------------------------------
  // Fetch (정렬 파라미터 적용)
  // ----------------------------------------------------------
  fetch: async (companyId, page, size, sortKey, sortOrder, searchTerm) => {
    const currentPage = page ?? get().page;
    const currentSize = size ?? get().pageSize;
    const currentSortKey = sortKey ?? get().sortKey;
    const currentSortOrder = sortOrder ?? get().sortOrder;
    const currentSearch = searchTerm ?? get().searchTerm;

    set({ loading: true });

    try {
      // ✅ 액션 함수로 정렬 파라미터 전달
      const { list, total } = await fetchWorkers(
        companyId,
        currentPage,
        currentSize,
        currentSortKey,
        currentSortOrder,
        currentSearch
      );

      set({
        workers: list,
        total: total,
        page: currentPage,
        pageSize: currentSize,
        sortKey: currentSortKey,
        sortOrder: currentSortOrder,
        searchTerm: currentSearch,
      });
    } catch (err) {
      console.error("❌ fetchWorkers error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ----------------------------------------------------------
  // Create, Update, Delete 로직은 기존과 동일하나
  // 재조회(fetch)가 필요한 경우 현재의 sortKey/Order를 사용하게 됩니다.
  // ----------------------------------------------------------
  create: async (data: Worker.CreateWorkerParams) => {
    try {
      const created = await createWorker(data);
      set((state) => ({
        workers: [created, ...state.workers],
        allList: [created, ...state.allList],
        total: state.total + 1,
      }));
      return created;
    } catch (err) {
      console.error("❌ createWorker error:", err);
      return null;
    }
  },

  update: async (id: string, data: Worker.UpdateWorkerParams) => {
    try {
      const updated = await updateWorker(id, data);
      set((state) => ({
        workers: state.workers.map((w) =>
          w.id === id ? { ...w, ...updated } : w
        ),
        allList: state.allList.map((w) =>
          w.id === id ? { ...w, ...updated } : w
        ),
      }));
      return updated;
    } catch (err) {
      console.error("❌ updateWorker error:", err);
      return null;
    }
  },

  remove: async (id: string) => {
    try {
      const ok = await deleteWorker(id);
      if (ok) {
        set((state) => ({
          workers: state.workers.filter((w) => w.id !== id),
          allList: state.allList.filter((w) => w.id !== id),
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
    set({ allListLoading: true });
    try {
      const data = await fetchAllWorkers(companyId);
      set({ allList: data });
    } catch (err) {
      console.error("❌ fetchAllWorkers error:", err);
    } finally {
      set({ allListLoading: false });
    }
  },
}));
