import { supabase } from "@/lib/supabase";

export interface CreateInquiryParams {
  phone: string;
  name: string;
  position?: string;
  content: string;
  company_id?: string;
  privacy_policy_agreed: boolean; // 필수 동의
  marketing_agreed: boolean; // 선택 동의
}

export async function createInquiry(params: CreateInquiryParams) {
  const {
    phone,
    name,
    position,
    content,
    privacy_policy_agreed,
    marketing_agreed,
  } = params;

  if (!phone || !name || !content || !privacy_policy_agreed) {
    throw new Error("필수 값이 누락되었습니다.");
  }

  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      phone,
      name,
      position,
      content,
      privacy_policy_agreed,
      marketing_agreed,
    })
    .select()
    .single();

  if (error) {
    console.error("❌ createInquiry error:", error);
    throw new Error(error.message ?? "문의 저장에 실패했습니다.");
  }

  return data;
}
