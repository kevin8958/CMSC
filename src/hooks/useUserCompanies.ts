import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useUserCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, company_id")
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

      setLoading(false);
    }

    fetchCompanies();
  }, []);

  return { companies, loading };
}
