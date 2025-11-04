import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useUserCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setCompanies([]);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, last_selected_company_id")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      const { data } = await supabase
        .from("admin_companies")
        .select("companies(id, name)")
        .eq("admin_id", user.id);

      setCompanies(data?.map((r) => r.companies) ?? []);
    } else {
      const { data } = await supabase
        .from("company_members")
        .select("companies(id, name)")
        .eq("user_id", user.id)
        .eq("deleted", false);

      // 일반 유저는 1 회사 제한이라면
      setCompanies(data?.map((r) => r.companies) ?? []);
    }

    setLastSelectedId(profile?.last_selected_company_id ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return { companies, loading, refetch: fetchCompanies, lastSelectedId };
}
