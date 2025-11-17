// src/stores/useDocumentStore.ts
import { create } from "zustand";

export interface DocumentRow {
  id: string;
  file_name: string;
  file_size: number;
  owner_name: string;
  created_at: string;
}

interface DocumentStore {
  documents: DocumentRow[];
  total: number;
  loading: boolean;
  fetchDocuments: (page?: number, size?: number) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  downloadDocument: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  total: 0,
  loading: false,

  fetchDocuments: async (page = 1, size = 20) => {
    console.log("📄 fetchDocuments called:", { page, size });

    set({ loading: true });

    // 🔥 Mock Data (API 붙기 전까지)
    const mock = Array.from({ length: 5 }).map((_, i) => ({
      id: `doc-${page}-${i}`,
      file_name: `문서파일_${i + 1}.pdf`,
      file_size: 1024 * (3 + i), // KB
      owner_name: i % 2 === 0 ? "김철수" : "이영희",
      created_at: new Date().toISOString(),
    }));

    await new Promise((r) => setTimeout(r, 500)); // 로딩 효과용

    set({
      documents: mock,
      total: 5,
      loading: false,
    });
  },

  deleteDocument: async (id: string) => {
    console.log("🗑 deleteDocument:", id);
    // 실제 삭제 대신 store에서 제거
    const next = get().documents.filter((d) => d.id !== id);
    set({ documents: next, total: next.length });
  },

  downloadDocument: async (id: string) => {
    console.log("⬇ downloadDocument:", id);
    // 실제 다운로드는 나중에 API 붙일 때 구현
  },
}));
