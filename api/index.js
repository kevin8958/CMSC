import { supabaseAdmin } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, companyId } = req.body;
  try {
    const origin = process.env.APP_ORIGIN;

    const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = allUsers?.users.find((u) => u.email === email);
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
      deleted: false,
    });

    return res.json({ success: true, email, invited: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
