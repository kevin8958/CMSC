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
  const res = await fetch("/api/member-update-role", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId, userId, role }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "역할 변경 실패");
  return data;
}
