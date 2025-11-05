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
