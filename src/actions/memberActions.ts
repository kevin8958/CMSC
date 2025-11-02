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

export async function deleteMember(companyId: string, userId: string) {
  const res = await fetch("/api/member/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId, userId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "삭제 실패");
  return data;
}
