import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: any | null;
  role: string | null;
  initialized: boolean;
  setUser: (user: any) => void;
  setRole: (role: string) => void;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  initialized: false,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),

  init: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      set({ initialized: true });
      return;
    }

    const user = session.user;
    set({ user });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role) set({ role: profile.role });

    set({ initialized: true });
  },
}));
