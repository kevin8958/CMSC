import { supabase } from "@/lib/supabase";

/**
 * 새 회사를 생성하고, 관리자와 연결합니다.
 */
export async function createCompany(name: string) {
  // 1. 로그인된 유저 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("로그인이 필요합니다.");

  // 2. 중복 회사명 확인
  const { data: existing, error: existingError } = await supabase
    .from("companies")
    .select("id")
    .ilike("name", name.trim()); // 대소문자 무시 비교 (필요 없으면 eq로 바꿔도 됨)
  if (existingError) throw existingError;
  if (existing && existing.length > 0) {
    throw new Error("이미 존재하는 회사명입니다.");
  }

  // 3. 새 회사 생성
  const { data: company, error: createError } = await supabase
    .from("companies")
    .insert({ name: name.trim() })
    .select()
    .single();
  if (createError) throw createError;

  // 4. 유저의 프로필 확인
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profileError) throw profileError;

  // 5. 역할에 따라 관계 테이블 업데이트
  if (profile?.role === "admin") {
    const { error: linkError } = await supabase.from("admin_companies").insert({
      admin_id: user.id,
      company_id: company.id,
    });
    if (linkError) throw linkError;
  }

  return company;
}
