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
        const offset = (page - 1) * pageSize;
        const limit = offset + pageSize - 1;

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          set({ companies: [], loading: false, fetching: false });
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, last_selected_company_id")
          .eq("id", user.id)
          .maybeSingle();

        let companies: Company[] = [];
        let total = 0;

        // ✅ super_admin은 전체 목록 + pagination
        if (profile?.role === "super_admin") {
          const { data, count } = await supabase
            .from("companies_with_stats")
            .select("*", { count: "exact" })
            .eq("deleted", false)
            .order("created_at", { ascending: false })
            .range(offset, limit);

          companies = data ?? [];
          total = count ?? 0;
        }

        // ✅ admin (여러 회사 소유)
        else if (profile?.role === "admin") {
          const { data } = await supabase
            .from("admin_companies")
            .select("companies(id, name)")
            .eq("admin_id", user.id);

          companies = (data ?? []).flatMap((r) =>
            Array.isArray(r.companies) ? r.companies : [r.companies]
          ) as Company[];
          companies.sort((a, b) => a.name.localeCompare(b.name, "ko"));
          total = companies.length;
        }

        // ✅ 일반사용자 (company_members 에서 가져온다)
        else {
          const { data } = await supabase
            .from("company_members")
            .select("companies(id, name)")
            .eq("user_id", user.id)
            .eq("deleted", false);

          // 일반사용자는 보통 하나
          companies = (data ?? []).flatMap((r) =>
            Array.isArray(r.companies) ? r.companies : [r.companies]
          ) as Company[];
          total = companies.length;
        }

        set({
          companies,
          total,
          currentCompanyId:
            profile?.last_selected_company_id || companies[0]?.id || null,
          loading: false,
          initialized: true,
          fetching: false,
        });
      },

      // ✅ 회사 선택 시 DB 업데이트
      selectCompany: async (companyId: string) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from("profiles")
          .update({ last_selected_company_id: companyId })
          .eq("id", user.id);

        if (!error) {
          set({ currentCompanyId: companyId });
        }
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
