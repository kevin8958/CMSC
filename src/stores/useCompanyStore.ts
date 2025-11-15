import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

// @types
export interface Company {
  id: string;
  name: string;
  created_at?: string;
  member_count?: number;
  admins?: string[];
}

interface CompanyStore {
  companies: Company[];
  currentCompanyId: string | null;
  loading: boolean;
  initialized: boolean;
  fetching: boolean;
  total: number;
  page: number;
  pageSize: number;
  fetchCompanies: (page?: number, pageSize?: number) => Promise<void>;
  selectCompany: (companyId: string) => Promise<void>;
  createCompany: (name: string) => Promise<Company | null>;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      companies: [],
      currentCompanyId: null,
      loading: false,
      initialized: false,
      fetching: false,

      total: 0,
      page: 1,
      pageSize: 20,

      // ✅ 회사 목록 불러오기 (pagination 지원)
      fetchCompanies: async (page = get().page, pageSize = get().pageSize) => {
        set({ fetching: true, loading: true, page, pageSize });
        const s = await supabase.auth.getSession();
        const token = s.data.session?.access_token;

        const res = await fetch(
          `/api/fetch-companies?page=${page}&pageSize=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { companies, total, currentCompanyId } = await res.json();

        set({
          companies,
          total,
          currentCompanyId,
          loading: false,
          initialized: true,
          fetching: false,
        });
      },

      // ✅ 회사 선택 시 DB 업데이트
      selectCompany: async (companyId: string) => {
        const s = await supabase.auth.getSession();
        await fetch("/api/set-current-company", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${s.data.session?.access_token}`,
          },
          body: JSON.stringify({ company_id: companyId }),
        });
        set({ currentCompanyId: companyId });
      },

      // ✅ 새 회사 생성
      createCompany: async (name: string) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: existing } = await supabase
          .from("companies")
          .select("id")
          .eq("deleted", false)
          .ilike("name", name.trim());
        if (existing && existing.length > 0)
          throw new Error("이미 존재하는 회사명입니다.");

        const { data: company, error: createError } = await supabase
          .from("companies")
          .insert({ name })
          .select()
          .maybeSingle();
        if (createError) throw createError;

        await get().fetchCompanies();
        return company;
      },
    }),
    {
      name: "company-store",
      partialize: (state) => ({
        companies: state.companies,
        currentCompanyId: state.currentCompanyId,
        initialized: state.initialized,
        page: state.page,
        pageSize: state.pageSize,
        total: state.total,
      }),
    }
  )
);
