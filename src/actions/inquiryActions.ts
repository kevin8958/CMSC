import { supabase } from "@/lib/supabase";

export interface CreateInquiryParams {
  phone: string;
  name: string;
  position?: string;
  content: string;
  company_id?: string;
}

export async function createInquiry(params: CreateInquiryParams) {
  const { phone, name, position, content } = params;

  if (!phone || !name || !content) {
    throw new Error("필수 값이 누락되었습니다.");
  }

  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      phone,
      name,
      position,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error("❌ createInquiry error:", error);
    throw new Error(error.message ?? "문의 저장에 실패했습니다.");
  }

  return data;
}
