import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export interface Company {
  id: string;
  name: string;
}

interface CompanyStore {
  companies: Company[];
  currentCompanyId: string | null;
  loading: boolean;
  initialized: boolean;
  fetching: boolean;
  fetchCompanies: () => Promise<void>;
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

      // ✅ 회사 목록 불러오기
      fetchCompanies: async () => {
        set({ fetching: true, loading: true });
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          set({ companies: [], loading: false, fetching: false });
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, company_id, last_selected_company_id")
          .eq("id", user.id)
          .single();

        let companies: Company[] = [];

        if (profile?.role === "admin") {
          const { data } = await supabase
            .from("admin_companies")
            .select("companies(id, name)")
            .eq("admin_id", user.id);

          companies = (data ?? []).flatMap((r) =>
            Array.isArray(r.companies) ? r.companies : [r.companies]
          ) as Company[];
        } else if (profile?.company_id) {
          const { data } = await supabase
            .from("companies")
            .select("id, name")
            .eq("id", profile.company_id)
            .single();
          if (data) companies = [data];
        }

        companies.sort((a, b) => a.name.localeCompare(b.name, "ko"));

        set({
          companies,
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

        // 중복 확인
        const { data: existing } = await supabase
          .from("companies")
          .select("id")
          .ilike("name", name.trim());
        if (existing && existing.length > 0)
          throw new Error("이미 존재하는 회사명입니다.");

        // 회사 생성
        const { data: company, error: createError } = await supabase
          .from("companies")
          .insert({ name })
          .select()
          .single();
        if (createError) throw createError;

        // 관리자라면 admin_companies에 연결
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile?.role === "admin") {
          await supabase
            .from("admin_companies")
            .insert({ admin_id: user.id, company_id: company.id });
        } else {
          await supabase
            .from("profiles")
            .update({ company_id: company.id })
            .eq("id", user.id);
        }

        // 새 목록 갱신
        await get().fetchCompanies();

        return company;
      },
    }),
    {
      name: "company-store", // 🧩 localStorage key
      partialize: (state) => ({
        companies: state.companies,
        currentCompanyId: state.currentCompanyId,
        initialized: state.initialized,
      }),
    }
  )
);
