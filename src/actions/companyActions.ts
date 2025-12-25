import { supabase } from "@/lib/supabase";
export async function deleteCompany(companyId: string) {
  const res = await fetch("/api/company-delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "삭제 실패");
  return data;
}

export async function createCompany(name: string) {
  const res = await fetch("/api/company-create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "회사 생성 실패");
  return data;
}

export async function fetchCompanyDetail(companyId: string) {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single(); // 단일 행 조회 (결과가 없거나 여러 개면 에러 발생)

  if (error) {
    console.error("❌ fetchCompanyDetail error:", error);
    throw new Error(error.message || "회사 정보를 불러오는데 실패했습니다.");
  }

  return data; // { id, name, enabled_menus, ... }
}
export async function updateCompanyMenus(
  companyId: string,
  enabledMenus: string[]
) {
  const { data, error } = await supabase
    .from("companies")
    .update({ enabled_menus: enabledMenus }) // 갱신할 데이터
    .eq("id", companyId) // 대상 행 지정
    .select() // 업데이트된 데이터를 다시 반환받음
    .single();

  if (error) {
    console.error("❌ updateCompanyMenus error:", error);
    throw new Error(error.message || "메뉴 설정 저장 실패");
  }

  return data; // 업데이트된 회사 객체 반환
}
