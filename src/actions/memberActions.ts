export async function inviteMember(companyId: string, email: string) {
  const res = await fetch("/api/invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, companyId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "초대 실패");

  return data;
}
export async function removeMemberFromCompany(
  companyId: string,
  userId: string
) {
  const res = await fetch("/api/member/removeFromCompany", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId, userId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "삭제 실패");
  return data;
}
export async function deleteMemberCompletely(userId: string) {
  const res = await fetch("/api/member/deleteUserCompletely", {
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
  const res = await fetch("/api/member/update-role", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId, userId, role }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "역할 변경 실패");
  return data;
}
