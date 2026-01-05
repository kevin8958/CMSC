import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface CategoryState {
  categories: Contract.Category[];
  fetching: boolean;
  fetchCategories: (companyId: string) => Promise<void>;
  createCategory: (companyId: string, name: string) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}
const COLORS = [
  "#47D0A2",
  "#E56F8C",
  "#5A8DEE",
  "#FEB139",
  "#9A7AF3",
  "#4DB6AC",
  "#FF8A65",
  "#64B5F6",
  "#BA68C8",
  "#81C784",
  "#FFD54F",
  "#4FC3F7",
  "#FFB74D",
  "#D4E157",
  "#7986CB",
  "#F06292",
  "#4DD0E1",
  "#AED581",
  "#9575CD",
  "#A1887F",
];
export const useContractCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  fetching: false,

  fetchCategories: async (companyId) => {
    set({ fetching: true });
    const { data, error } = await supabase
      .from("contract_categories")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: true });

    if (!error) set({ categories: data || [] });
    set({ fetching: false });
  },
  createCategory: async (companyId: string, name: string) => {
    const currentCount = get().categories.length;
    // 순차적으로 컬러 배정 (20개가 넘으면 다시 처음부터)
    const assignedColor = COLORS[currentCount % COLORS.length];

    const { data, error } = await supabase
      .from("contract_categories")
      .insert([{ company_id: companyId, name, color: assignedColor }])
      .select();

    if (!error && data) {
      set({ categories: [...get().categories, data[0]] });
    }
  },

  deleteCategory: async (categoryId) => {
    const { error } = await supabase
      .from("contract_categories")
      .delete()
      .eq("id", categoryId);

    if (!error) {
      set({ categories: get().categories.filter((c) => c.id !== categoryId) });
    }
  },
}));
