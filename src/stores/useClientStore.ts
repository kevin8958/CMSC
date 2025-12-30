import { create } from "zustand";
import { supabase } from "@/lib/supabase"; // 설정된 supabase client

interface ClientState {
  clients: Client.Client[];
  fetching: boolean;
  fetchClients: (companyId: string) => Promise<void>;
  createClient: (
    companyId: string,
    input: Client.CreateClientInput
  ) => Promise<void>;
  updateClient: (
    clientId: string,
    input: Partial<Client.CreateClientInput>
  ) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  setClients: (clients: Client.Client[]) => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  fetching: false,

  fetchClients: async (companyId) => {
    set({ fetching: true });
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (!error) set({ clients: data || [] });
    set({ fetching: false });
  },

  createClient: async (companyId, input) => {
    const { data, error } = await supabase
      .from("clients")
      .insert([{ ...input, company_id: companyId }])
      .select();

    if (!error && data) {
      set({ clients: [data[0], ...get().clients] });
    }
  },

  updateClient: async (clientId, input) => {
    const { error } = await supabase
      .from("clients")
      .update(input)
      .eq("id", clientId);

    if (!error) {
      set({
        clients: get().clients.map((c) =>
          c.id === clientId ? { ...c, ...input } : c
        ),
      });
    }
  },

  deleteClient: async (clientId) => {
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId);

    if (!error) {
      set({
        clients: get().clients.filter((c) => c.id !== clientId),
      });
    }
  },

  setClients: (clients) => set({ clients }),
}));
