import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  // vercel serverless는 method 체크 필수
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    // 1) supabase 유저 삭제
    await supabaseAdmin.auth.admin.deleteUser(userId);

    // 2) profiles 삭제
    await supabaseAdmin.from("profiles").delete().eq("id", userId);

    // 3) company_members 삭제
    await supabaseAdmin.from("company_members").delete().eq("user_id", userId);

    // 4) admin_companies 삭제
    await supabaseAdmin.from("admin_companies").delete().eq("admin_id", userId);

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
