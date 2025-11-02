import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------- invite ----------------------
app.post("/api/invite", async (req, res) => {
  const { email, companyId } = req.body;
  try {
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users.find((u) => u.email === email);

    let userId = existing?.id;

    if (!userId) {
      const { data: invitedUser, error: inviteError } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          redirectTo: "http://localhost:5173/auth/callback",
        });
      if (inviteError) throw inviteError;
      userId = invitedUser.user.id;
    }

    await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email,
      role: "user_b",
    });

    await supabaseAdmin.from("company_members").insert({
      company_id: companyId,
      user_id: userId,
      role: "user_b",
      joined_at: null,
    });

    res.json({ success: true, email, invited: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------- delete ----------------------
app.post("/api/member/delete", async (req, res) => {
  const { companyId, userId } = req.body;
  try {
    const { data: member } = await supabaseAdmin
      .from("company_members")
      .select("joined_at")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .single();

    if (!member) throw new Error("멤버를 찾을 수 없습니다");

    if (member.joined_at == null) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      await supabaseAdmin
        .from("company_members")
        .delete()
        .eq("company_id", companyId)
        .eq("user_id", userId);

      await supabaseAdmin.from("profiles").delete().eq("id", userId);
    } else {
      await supabaseAdmin
        .from("company_members")
        .update({ deleted: true })
        .eq("company_id", companyId)
        .eq("user_id", userId);
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------- server on 하나만 ----------------------
app.listen(4000, () =>
  console.log("🟢 API Server running at http://localhost:4000")
);
