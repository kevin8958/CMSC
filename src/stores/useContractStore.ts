import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface ContractState {
  contracts: Contract.Contract[];
  fetching: boolean;
  fetchContracts: (companyId: string) => Promise<void>;
  createContract: (
    companyId: string,
    input: Contract.CreateContractInput
  ) => Promise<void>;
  updateContract: (
    contractId: string,
    input: Partial<Contract.Contract>
  ) => Promise<void>;
  deleteContract: (contractId: string) => Promise<void>;
  setContracts: (contracts: Contract.Contract[]) => void; // DnD용 즉시 반영
}

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: [],
  fetching: false,

  fetchContracts: async (companyId) => {
    set({ fetching: true });
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (!error) set({ contracts: data || [] });
    set({ fetching: false });
  },

  createContract: async (companyId, input) => {
    const { data, error } = await supabase
      .from("contracts")
      .insert([{ ...input, company_id: companyId }])
      .select();

    if (!error && data) {
      set({ contracts: [data[0], ...get().contracts] });
    }
  },

  updateContract: async (contractId, input) => {
    const { error } = await supabase
      .from("contracts")
      .update(input)
      .eq("id", contractId);

    if (!error) {
      set({
        contracts: get().contracts.map((c) =>
          c.id === contractId
            ? { ...c, ...input, updated_at: new Date().toISOString() }
            : c
        ),
      });
    }
  },

  deleteContract: async (contractId) => {
    const { error } = await supabase
      .from("contracts")
      .delete()
      .eq("id", contractId);

    if (!error) {
      set({ contracts: get().contracts.filter((c) => c.id !== contractId) });
    }
  },

  setContracts: (contracts) => set({ contracts }),
}));
