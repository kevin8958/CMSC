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
    const origin = process.env.APP_ORIGIN;
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users.find((u) => u.email === email);

    let userId = existing?.id;

    if (!userId) {
      const { data: invitedUser, error: inviteError } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${origin}/signup/invite`,
        });
      if (inviteError) throw inviteError;
      userId = invitedUser.user.id;
    }

    await supabaseAdmin.from("profiles").upsert({
      id: userId,
      user_id: userId,
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
// ---------------------- update role ----------------------
app.post("/api/member/update-role", async (req, res) => {
  const { companyId, userId, role } = req.body;

  try {
    // 유효성
    if (!companyId || !userId || !role) {
      return res.status(400).json({ error: "필수 파라미터 누락" });
    }

    const { error } = await supabaseAdmin
      .from("company_members")
      .update({ role })
      .eq("company_id", companyId)
      .eq("user_id", userId);

    if (error) throw error;

    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------- member join 처리 ----------------------
app.post("/api/member/join", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "no userId" });

  const { data, error } = await supabaseAdmin
    .from("company_members")
    .update({ joined_at: new Date().toISOString() })
    .eq("user_id", userId);

  console.log("update result", data, error);

  res.json({ ok: true });
});
// ---------------------- delete company ----------------------
app.post("/api/company/delete", async (req, res) => {
  const { companyId } = req.body;

  try {
    // 회사 존재 확인
    const { data: company } = await supabaseAdmin
      .from("companies")
      .select("id")
      .eq("id", companyId)
      .single();

    if (!company) {
      throw new Error("회사를 찾을 수 없습니다");
    }

    // 1) 회사 삭제(soft delete)
    await supabaseAdmin
      .from("companies")
      .update({ deleted: true })
      .eq("id", companyId);

    // 2) 회사 멤버들 전부 삭제 플래그
    await supabaseAdmin
      .from("company_members")
      .update({ deleted: true })
      .eq("company_id", companyId);

    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------- server on 하나만 ----------------------
app.listen(4000, () =>
  console.log("🟢 API Server running at http://localhost:4000")
);
