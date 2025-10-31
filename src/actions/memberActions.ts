import { supabase } from "@/lib/supabase";

export async function inviteMember(companyId: string, email: string) {
  // 1️⃣ 이메일로 Auth 유저 존재 여부 확인
  const { data: existingUser, error: userError } =
    await supabase.auth.admin.listUsers();
  if (userError) throw userError;

  const already = existingUser.users.find((u) => u.email === email);

  // 2️⃣ 없으면 초대 메일 전송
  let userId = already?.id;
  if (!userId) {
    const { data: invitedUser, error: inviteError } =
      await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

    if (inviteError) throw inviteError;
    userId = invitedUser.user.id;
  }

  // 3️⃣ profiles에 유저 등록 (없으면 생성)
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: userId,
      email,
      role: "user_b",
    });
  }

  // 4️⃣ company_members에 추가
  const { error: insertError } = await supabase.from("company_members").insert({
    company_id: companyId,
    user_id: userId,
    role: "user_b",
    joined_at: null,
  });

  if (insertError) throw insertError;

  return { email, invited: true, joined_at: null };
}
