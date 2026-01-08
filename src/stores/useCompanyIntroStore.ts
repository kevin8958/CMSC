import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface CompanyIntroRequest {
  clinic_name: string;
  position: string;
  name: string;
  phone: string;
  email: string;
}

interface CompanyIntroState {
  sendRequest: (data: CompanyIntroRequest) => Promise<void>;
}

export const useCompanyIntroStore = create<CompanyIntroState>(() => ({
  sendRequest: async (data) => {
    const { error } = await supabase
      .from("company_intro_requests")
      .insert([data]);
    if (error) throw error;
  },
}));
