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
