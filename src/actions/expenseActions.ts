import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

export async function insertExpense(payload: {
  user_id: string;
  company_id: string;
  category: "fixed" | "variable" | "other";
  date: Date;
  method: string;
  place: string;
  amount: number;
  memo?: string;
}) {
  const { data, error } = await supabase.from("expenses").insert({
    user_id: payload.user_id,
    company_id: payload.company_id,
    category: payload.category,
    date: dayjs(payload.date).format("YYYY-MM-DD"),
    method: payload.method,
    place: payload.place,
    amount: payload.amount,
    memo: payload.memo || null,
  });

  if (error) throw error;
  return data;
}

export async function fetchExpenses(params: {
  company_id: string;
  category: "fixed" | "variable" | "other";
  month: Date;
  page: number;
}) {
  const start = dayjs(params.month).startOf("month").format("YYYY-MM-DD");
  const end = dayjs(params.month).endOf("month").format("YYYY-MM-DD");

  const from = (params.page - 1) * 10;
  const to = from + 10 - 1;
  const { data, error } = await supabase
    .from("expenses")
    .select(`*`)
    .eq("company_id", params.company_id)
    .eq("category", params.category)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data;
}

export async function fetchExpenseSummary(params: {
  company_id: string;
  month: Date;
}) {
  const start = dayjs(params.month).startOf("month").format("YYYY-MM-DD");
  const end = dayjs(params.month).endOf("month").format("YYYY-MM-DD");

  const { data, error } = await supabase.rpc("get_expense_summary", {
    cid: params.company_id,
    from_date: start,
    to_date: end,
  });

  if (error) throw error;
  return data;
}

export async function updateExpense(
  id: number,
  payload: {
    date: string;
    method: string;
    place: string;
    amount: number;
    category?: "fixed" | "variable" | "other";
    memo?: string;
  }
) {
  const { data, error } = await supabase
    .from("expenses")
    .update({
      date: dayjs(payload.date).format("YYYY-MM-DD"),
      method: payload.method,
      place: payload.place,
      amount: payload.amount,
      category: payload.category,
      memo: payload.memo ?? null,
    })
    .eq("id", id);

  if (error) throw error;
  return data;
}

export async function deleteExpense(id: number) {
  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) throw error;
}
