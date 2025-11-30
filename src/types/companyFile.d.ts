namespace CompanyFile {
  type CompanyFile = {
    id: string;
    file_path: string;
    file_name: string;
    file_size: number;
    mime_type: string | null;
    company_id: string;
    uploader_id: string;
    created_at: string;
  };

  interface CompanyFilesState {
    files: CompanyFile[];
    loading: boolean;
    fetch: (companyId: string) => Promise<void>;
    upload: (params: { companyId: string; files: File[] }) => Promise<void>;
    delete: (item: { id: string; file_path: string }) => Promise<void>;
  }

  interface DocumentDrawerProps {
    open: boolean;
    onClose: () => void;
  }
  /* 타입 */
  type DocumentRow = {
    id: string;
    file_name: string;
    file_size: number;
    owner_name?: string;
    file_path: string;
    created_at: string;
  };
}
