import { create } from "zustand";
import {
  uploadCompanyFile,
  deleteCompanyFile,
  fetchCompanyFiles,
} from "@/actions/companyFileActions";

export const useCompanyFilesStore = create<CompanyFile.CompanyFilesState>()(
  (set, get) => ({
    files: [],
    loading: false,

    fetch: async (companyId: string) => {
      const data = await fetchCompanyFiles(companyId);
      set({ files: data });
    },

    upload: async ({ companyId, files }) => {
      set({ loading: true });

      try {
        await uploadCompanyFile({ companyId, files });
        await get().fetch(companyId);
      } finally {
        set({ loading: false });
      }
    },

    delete: async (item) => {
      await deleteCompanyFile({
        fileId: item.id,
        filePath: item.file_path,
      });

      set((state) => ({
        files: state.files.filter((f) => f.id !== item.id),
      }));
    },
  })
);
