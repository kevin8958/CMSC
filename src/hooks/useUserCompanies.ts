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
      .select("role, company_id, last_selected_company_id")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      const { data } = await supabase
        .from("admin_companies")
        .select("companies(id, name)")
        .eq("admin_id", user.id);
      setCompanies(data?.map((r) => r.companies) ?? []);
    } else if (profile?.company_id) {
      const { data } = await supabase
        .from("companies")
        .select("id, name")
        .eq("id", profile.company_id)
        .single();
      setCompanies(data ? [data] : []);
    }

    setLastSelectedId(profile?.last_selected_company_id ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return { companies, loading, refetch: fetchCompanies, lastSelectedId };
}
