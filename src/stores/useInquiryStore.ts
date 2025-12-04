import { create } from "zustand";
import {
  createInquiry,
  type CreateInquiryParams,
} from "@/actions/inquiryActions";

interface InquiryState {
  loading: boolean;
  error: string | null;
  lastInquiry: any | null;

  sendInquiry: (payload: CreateInquiryParams) => Promise<any>;
  reset: () => void;
}

export const useInquiryStore = create<InquiryState>((set) => ({
  loading: false,
  error: null,
  lastInquiry: null,

  reset: () => set({ loading: false, error: null, lastInquiry: null }),

  sendInquiry: async (payload) => {
    set({ loading: true, error: null });

    try {
      const inquiry = await createInquiry(payload);
      set({ loading: false, lastInquiry: inquiry });
      return inquiry;
    } catch (err: any) {
      console.error("❌ sendInquiry error:", err);
      set({
        loading: false,
        error: err?.message ?? "문의 전송에 실패했습니다.",
      });
      throw err;
    }
  },
}));
