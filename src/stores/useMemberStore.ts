// /stores/useMemberStore.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useCompanyStore } from "@/stores/useCompanyStore";

interface Member {
  user_id: string;
  display_name: string;
  email: string;
  joined_at: string;
  created_at: string;
  role: string;
}

interface MemberStore {
  members: Member[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  setMembers: (ms: Member[]) => void;
  setTotal: (n: number) => void;
  setPage: (n: number) => void;
  fetchMembers: (page?: number, size?: number) => Promise<void>;
  addExistingAdmin: (companyId: string, userId: string) => Promise<void>;
}

export const useMemberStore = create<MemberStore>()((set, get) => ({
  members: [],
  total: 0,
  loading: false,
  page: 1,
  pageSize: 10,

  setMembers: (ms) => set({ members: ms }),
  setTotal: (n) => set({ total: n }),
  setPage: (n) => set({ page: n }),

  fetchMembers: async (page = get().page, size = get().pageSize) => {
    const currentCompanyId = useCompanyStore.getState().currentCompanyId;

    if (!currentCompanyId) return;

    set({ loading: true, page, pageSize: size });

    const res = await fetch(
      `/api/company-member-list?companyId=${currentCompanyId}&page=${page}&size=${size}`
    );
    const { data, count } = await res.json();

    const members = data.map((m: any) => ({
      user_id: m.user_id,
      display_name: m.profiles?.display_name ?? "-",
      email: m.profiles?.email ?? "-",
      joined_at: m.joined_at,
      created_at: m.created_at,
      role: m.role,
    }));

    members.sort((a: any, b: any) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      return 0;
    });

    set({
      members,
      total: count || 0,
      loading: false,
    });
  },
  addExistingAdmin: async (companyId: string, userId: string) => {
    // 1) company_members 에 추가 or revive
    const { data: exists } = await supabase
      .from("company_members")
      .select("id, deleted, role, joined_at")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .maybeSingle();

    if (exists) {
      await supabase
        .from("company_members")
        .update({
          deleted: false,
          role: "admin",
          joined_at: exists.joined_at ?? new Date().toISOString(), // ✅ revive 시 joined_at 보정
        })
        .eq("id", exists.id);
    } else {
      await supabase.from("company_members").insert({
        company_id: companyId,
        user_id: userId,
        role: "admin",
        joined_at: new Date().toISOString(), // ✅ create 시 joined_at
        deleted: false,
      });
    }

    // 2) admin_companies 에도 추가 보장
    const { data: adminExists } = await supabase
      .from("admin_companies")
      .select("id")
      .eq("company_id", companyId)
      .eq("admin_id", userId)
      .maybeSingle();

    if (!adminExists) {
      await supabase.from("admin_companies").insert({
        company_id: companyId,
        admin_id: userId,
      });
    }
  },
}));
