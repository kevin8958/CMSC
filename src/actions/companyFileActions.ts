import { supabase } from "@/lib/supabase";

const MAX_FILES = 10;
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB

/* ------------------------------------------------------
 * ✅ 회사 자료 업로드 (멀티 파일)
 ------------------------------------------------------ */
export async function uploadCompanyFile({
  companyId,
  files,
}: {
  companyId: string;
  files: File[];
}) {
  if (!companyId) throw new Error("companyId is required");
  if (!files || files.length === 0) throw new Error("files are required");

  /* 1️⃣ 현재 회사 사용량 조회 */
  const { data: usage, error: usageError } = await supabase
    .from("company_file_usage")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle(); // 🔁 0건일 수 있으므로

  if (usageError) throw usageError;

  const currentCount = usage?.file_count ?? 0;
  const currentSize = usage?.total_size ?? 0;

  const incomingCount = files.length;
  const incomingSize = files.reduce((sum, f) => sum + f.size, 0);

  // 🔒 개수 제한
  if (currentCount + incomingCount > MAX_FILES) {
    throw new Error(
      `회사당 업로드 가능한 최대 파일 수(${MAX_FILES}개)를 초과했습니다.`
    );
  }

  // 🔒 용량 제한
  if (currentSize + incomingSize > MAX_TOTAL_SIZE) {
    throw new Error("회사 총 업로드 용량(100MB)을 초과했습니다.");
  }

  /* 2️⃣ 업로드 유저 조회 */
  const { data: auth } = await supabase.auth.getUser();
  const uploaderId = auth?.user?.id;

  if (!uploaderId) throw new Error("로그인이 필요합니다.");

  /* 3️⃣ 스토리지 업로드 (여러 개) */
  const uploaded = [] as { file: File; path: string }[];

  try {
    for (const file of files) {
      const storagePath = `${companyId}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("company-files")
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      uploaded.push({ file, path: storagePath });
    }
  } catch (err) {
    // 일부만 올라갔다가 실패했으면 이미 업로드된 것 정리
    if (uploaded.length > 0) {
      await supabase.storage
        .from("company-files")
        .remove(uploaded.map((u) => u.path));
    }
    throw err;
  }

  /* 4️⃣ DB 기록 (배치 insert) */
  const rows = uploaded.map(({ file, path }) => ({
    company_id: companyId,
    uploader_id: uploaderId,
    file_name: file.name,
    file_path: path,
    file_size: file.size,
    mime_type: file.type,
  }));

  const { error: insertError } = await supabase
    .from("company_files")
    .insert(rows);

  if (insertError) {
    // DB 실패 시 storage 롤백
    await supabase.storage
      .from("company-files")
      .remove(uploaded.map((u) => u.path));
    throw insertError;
  }

  return true;
}

/* ------------------------------------------------------
 * ✅ 파일 삭제
 ------------------------------------------------------ */
export async function deleteCompanyFile({
  fileId,
  filePath,
}: {
  fileId: string;
  filePath: string;
}) {
  if (!fileId) throw new Error("fileId missing");
  if (!filePath) throw new Error("filePath missing");

  // 1️⃣ Storage 삭제
  const { error: storageError } = await supabase.storage
    .from("company-files")
    .remove([filePath]);

  if (storageError) throw storageError;

  // 2️⃣ DB delete
  const { error: dbError } = await supabase
    .from("company_files")
    .delete()
    .eq("id", fileId);

  if (dbError) throw dbError;

  return true;
}

/* ------------------------------------------------------
 * ✅ 회사 파일 목록 조회
 ------------------------------------------------------ */
export async function fetchCompanyFiles(companyId: string) {
  const { data, error } = await supabase
    .from("company_files")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

/* ------------------------------------------------------
 * ✅ 다운로드 (signed URL)
 ------------------------------------------------------ */
export async function downloadCompanyFile(filePath: string) {
  const { data, error } = await supabase.storage
    .from("company-files")
    .createSignedUrl(filePath, 60); // 60초 유효

  if (error) throw error;

  return data.signedUrl;
}
