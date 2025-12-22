import { supabase } from "@/lib/supabase";

export async function inviteMember(body: {
  company_id: string;
  email: string;
}) {
  // 로그인 유저 확인 (권한 체크용)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  const res = await fetch("/api/member/invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "초대 실패");
  }

  return res.json();
}

export async function removeMemberFromCompany(
  companyId: string,
  userId: string
) {
  const res = await fetch("/api/member-remove-from-company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId, userId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "삭제 실패");
  return data;
}
export async function deleteMemberCompletely(userId: string) {
  const res = await fetch("/api/member-delete-user-completely", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "삭제 실패");
  return data;
}
export async function updateMemberRole(
  companyId: string,
  userId: string,
  role: string
) {
  // 1. 서버 API를 통한 역할(Role) 변경 호출
  const res = await fetch("/api/member-update-role", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId, userId, role }),
  });

  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || "역할 변경 실패");

  try {
    // 2. 해당 멤버의 프로필에서 '마지막 선택 회사'를 현재 회사 ID로 업데이트
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ last_selected_company_id: companyId })
      .eq("id", userId);

    if (profileError) {
      console.error("❌ Profile 업데이트 실패:", profileError.message);
      // 프로필 업데이트 실패가 전체 로직의 중단 사유가 아니면 throw하지 않음
    }

    // 3. admin_companies 테이블에 해당 유저와 회사의 관계가 있는지 확인
    const { data: adminExists, error: checkError } = await supabase
      .from("admin_companies")
      .select("id")
      .eq("company_id", companyId)
      .eq("admin_id", userId)
      .maybeSingle();

    if (checkError) throw checkError;

    // 4. 존재하지 않는다면 신규 인서트
    if (!adminExists) {
      const { error: insertError } = await supabase
        .from("admin_companies")
        .insert({
          company_id: companyId,
          admin_id: userId,
        });

      if (insertError) throw insertError;
    }

    return resData;
  } catch (err: any) {
    console.error("❌ 권한 변경 후 부가 로직 처리 중 오류:", err.message);
    // 필요에 따라 에러를 다시 던지거나 무시할 수 있습니다.
    throw new Error(
      `역할은 변경되었으나, 부가 정보 업데이트에 실패했습니다: ${err.message}`
    );
  }
}
