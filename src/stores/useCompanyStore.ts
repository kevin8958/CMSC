import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import {
  fetchCompanyDetail,
  updateCompanyMenus as updateMenusAction,
} from "@/actions/companyActions"; // 액션 임포트

export interface Company {
  id: string;
  name: string;
  created_at?: string;
  member_count?: number;
  admins?: string[];
  enabled_menus?: string[]; // ✅ 새 컬럼 추가
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
  currentCompanyDetail: Company | null; // ✅ 현재 회사의 상세 정보 전용
  fetchCurrentCompanyDetail: () => Promise<void>; // ✅ 단일 조회 함수
  fetchCompanies: (page?: number, pageSize?: number) => Promise<void>;
  selectCompany: (companyId: string) => Promise<void>;
  createCompany: (name: string) => Promise<Company | null>;
  // ✅ 메뉴 업데이트 함수 정의 추가
  updateCompanyMenus: (companyId: string, menus: string[]) => Promise<void>;
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
      currentCompanyDetail: null,

      fetchCompanies: async (page = get().page, pageSize = get().pageSize) => {
        set({ fetching: true, loading: true, page, pageSize });
        const s = await supabase.auth.getSession();
        const token = s.data.session?.access_token;

        const res = await fetch(
          `/api/fetch-companies?page=${page}&pageSize=${pageSize}`,
          {
            headers: { Authorization: `Bearer ${token}` },
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

        // ✅ 기본 메뉴 설정 포함하여 생성 (선택 사항)
        const defaultMenus = [
          "dashboard",
          "communication",
          "worker",
          "salary",
          "attendance",
          "income",
          "expense",
          "document",
        ];

        const { data: company, error: createError } = await supabase
          .from("companies")
          .insert({ name, enabled_menus: defaultMenus })
          .select()
          .maybeSingle();
        if (createError) throw createError;

        await get().fetchCompanies();
        return company;
      },

      fetchCurrentCompanyDetail: async () => {
        const { currentCompanyId } = get();
        if (!currentCompanyId) return;

        set({ loading: true });
        try {
          const company = await fetchCompanyDetail(currentCompanyId);
          set({ currentCompanyDetail: company });
        } catch (error) {
          console.error(error);
        } finally {
          set({ loading: false });
        }
      },

      updateCompanyMenus: async (companyId, menus) => {
        await updateMenusAction(companyId, menus);
        set((state) => ({
          // 상세 정보 업데이트
          currentCompanyDetail:
            state.currentCompanyDetail?.id === companyId
              ? { ...state.currentCompanyDetail, enabled_menus: menus }
              : state.currentCompanyDetail,
          // 목록에서도 찾아 업데이트 (있을 경우만)
          companies: state.companies.map((c) =>
            c.id === companyId ? { ...c, enabled_menus: menus } : c
          ),
        }));
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
