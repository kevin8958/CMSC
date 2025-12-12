import { supabaseAdmin } from "../_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { company_id, email, role = "user_b" } = req.body;

    // 1️⃣ 이메일로 기존 유저 존재 여부 확인
    const { data: users, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) throw listError;

    const existingUser = users.users.find((u) => u.email === email);
    let userId = existingUser?.id;

    // 2️⃣ 없으면 초대 메일
    if (!userId) {
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        }
      );

      if (error) throw error;
      userId = data.user.id;
    }

    // 3️⃣ profiles upsert
    await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email,
      role,
    });

    // 4️⃣ company_members 추가
    const { error: memberError } = await supabaseAdmin
      .from("company_members")
      .insert({
        company_id,
        user_id: userId,
        role,
        joined_at: null,
      });

    if (memberError) throw memberError;

    return res.json({
      user_id: userId,
      email,
      role,
      joined_at: null,
    });
  } catch (err) {
    console.error("❌ invite member error:", err);
    return res.status(500).json({
      error: err.message ?? "Invite failed",
    });
  }
}
