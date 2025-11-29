import { supabase } from "@/lib/supabase";

/** 월별 statement 가져오기 (없으면 자동 생성) */
export async function getOrCreateStatement(
  companyId: string,
  yearMonth: string
) {
  const { data: existing } = await supabase
    .from("income_statements")
    .select("*")
    .eq("company_id", companyId)
    .eq("year_month", yearMonth)
    .single();

  if (existing) return existing;

  // 새로 생성
  const { data, error } = await supabase
    .from("income_statements")
    .insert([{ company_id: companyId, year_month: yearMonth }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** 매출 업데이트 */
export async function updateRevenue(
  companyId: string,
  yearMonth: string,
  revenue: number
) {
  const statement = await getOrCreateStatement(companyId, yearMonth);

  const { error } = await supabase
    .from("income_statements")
    .update({ revenue })
    .eq("id", statement.id);

  if (error) throw error;

  // 매출총이익 다시 계산
  await recalcGrossProfit(statement.id);
}

/** COGS 항목 생성 */
export async function createCogsItem(
  statementId: string,
  name: string,
  amount: number
) {
  const { error } = await supabase
    .from("income_items")
    .insert([{ statement_id: statementId, category: "cogs", name, amount }]);

  if (error) throw error;

  await recalcGrossProfit(statementId);
}

/** COGS 항목 업데이트 */
export async function updateCogsItem(
  id: string,
  data: { name?: string; amount?: number }
) {
  const { data: updated, error } = await supabase
    .from("income_items")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await recalcGrossProfit(updated.statement_id);
}

/** COGS 항목 삭제 */
export async function deleteCogsItem(id: string) {
  const { data: existing, error: selectErr } = await supabase
    .from("income_items")
    .select("statement_id")
    .eq("id", id)
    .single();
  if (selectErr) throw selectErr;

  const { error } = await supabase.from("income_items").delete().eq("id", id);
  if (error) throw error;

  await recalcGrossProfit(existing.statement_id);
}

/** 매출총이익 계산 */
export async function recalcGrossProfit(statementId: string) {
  // 1) statement 가져오기
  const { data: statement } = await supabase
    .from("income_statements")
    .select("*")
    .eq("id", statementId)
    .single();

  if (!statement) return;

  const revenue = Number(statement.revenue || 0);

  // 2) COGS 합계 구하기
  const { data: cogs } = await supabase
    .from("income_items")
    .select("*")
    .eq("statement_id", statementId)
    .eq("category", "cogs");

  const cogsTotal =
    cogs?.reduce((sum, item) => sum + Number(item.amount), 0) ?? 0;

  // 3) 계산
  const grossProfit = revenue - cogsTotal;
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  // 4) 저장
  const { error } = await supabase
    .from("income_statements")
    .update({
      gross_profit: grossProfit,
      gross_margin: grossMargin,
      updated_at: new Date().toISOString(),
    })
    .eq("id", statementId);

  if (error) throw error;
}
/** COGS 목록 가져오기 */
export async function fetchCogs(statementId: string) {
  const { data, error } = await supabase
    .from("income_items")
    .select("*")
    .eq("statement_id", statementId)
    .eq("category", "cogs")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}
/** 영업이익 계산 */
export async function recalcOperatingProfit(statementId: string) {
  // 1) statement 조회
  const { data: statement } = await supabase
    .from("income_statements")
    .select("gross_profit")
    .eq("id", statementId)
    .single();

  if (!statement) return;

  const grossProfit = Number(statement.gross_profit || 0);

  // 2) 판매관리비(SGA) 합계
  const { data: sgaItems } = await supabase
    .from("income_items")
    .select("amount")
    .eq("statement_id", statementId)
    .eq("category", "sga");

  const sgaTotal =
    sgaItems?.reduce((sum, item) => sum + Number(item.amount), 0) ?? 0;

  // 3) 계산
  const operatingProfit = grossProfit - sgaTotal;
  const operatingMargin =
    grossProfit > 0 ? (operatingProfit / grossProfit) * 100 : 0;

  // 4) 저장
  const { error } = await supabase
    .from("income_statements")
    .update({
      operating_profit: operatingProfit,
      operating_margin: operatingMargin,
      updated_at: new Date().toISOString(),
    })
    .eq("id", statementId);

  if (error) throw error;
}

// 판매관리비(SGA) 가져오기
export async function fetchSga(statementId: string) {
  const { data, error } = await supabase
    .from("income_items")
    .select("*")
    .eq("statement_id", statementId)
    .eq("category", "sga")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

// 판매관리비 추가
export async function addSga(
  statementId: string,
  name: string,
  amount: number
) {
  const { data, error } = await supabase
    .from("income_items")
    .insert([{ statement_id: statementId, category: "sga", name, amount }])
    .select()
    .single();

  if (error) throw error;

  await recalcOperatingProfit(statementId);
  return data;
}

// 판매관리비 삭제
export async function deleteSga(id: string) {
  const { data: existing, error: selectErr } = await supabase
    .from("income_items")
    .select("statement_id")
    .eq("id", id)
    .single();
  if (selectErr) throw selectErr;
  const { error } = await supabase.from("income_items").delete().eq("id", id);
  await recalcOperatingProfit(existing.statement_id);
  if (error) throw error;

  return true;
}

// 🔶 영업외수익 / 영업외비용 — 공통 함수
/** 세전이익 계산 */
export async function recalcPreTaxProfit(statementId: string) {
  // 1) statement 조회
  const { data: statement } = await supabase
    .from("income_statements")
    .select("operating_profit")
    .eq("id", statementId)
    .single();

  if (!statement) return;

  const operatingProfit = Number(statement.operating_profit || 0);

  // 2) 영업외수익 합계
  const { data: nonIncome } = await supabase
    .from("income_items")
    .select("amount")
    .eq("statement_id", statementId)
    .eq("category", "non_income");

  const nonIncomeTotal =
    nonIncome?.reduce((s, x) => s + Number(x.amount), 0) ?? 0;

  // 3) 영업외비용 합계
  const { data: nonExpense } = await supabase
    .from("income_items")
    .select("amount")
    .eq("statement_id", statementId)
    .eq("category", "non_expense");

  const nonExpenseTotal =
    nonExpense?.reduce((s, x) => s + Number(x.amount), 0) ?? 0;

  // 4) 계산
  const preTaxProfit = operatingProfit + nonIncomeTotal - nonExpenseTotal;

  const preTaxMargin =
    operatingProfit > 0 ? (preTaxProfit / operatingProfit) * 100 : 0;

  // 5) 저장
  const { error } = await supabase
    .from("income_statements")
    .update({
      pretax_profit: preTaxProfit,
      pretax_margin: preTaxMargin,
      updated_at: new Date().toISOString(),
    })
    .eq("id", statementId);

  if (error) throw error;
}

export async function fetchNonOp(
  statementId: string,
  type: "income" | "expense"
) {
  const category = type === "income" ? "non_op_income" : "non_op_expense";

  const { data, error } = await supabase
    .from("income_items")
    .select("*")
    .eq("statement_id", statementId)
    .eq("category", category)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addNonOp(
  statementId: string,
  type: "income" | "expense",
  name: string,
  amount: number
) {
  const category = type === "income" ? "non_op_income" : "non_op_expense";

  const { data, error } = await supabase
    .from("income_items")
    .insert([{ statement_id: statementId, category, name, amount }])
    .select()
    .single();

  if (error) throw error;
  await recalcPreTaxProfit(statementId);
  return data;
}

export async function deleteNonOp(id: string) {
  const { data: existing, error: selectErr } = await supabase
    .from("income_items")
    .select("statement_id")
    .eq("id", id)
    .single();
  if (selectErr) throw selectErr;
  const { error } = await supabase.from("income_items").delete().eq("id", id);
  await recalcPreTaxProfit(existing.statement_id);
  if (error) throw error;

  return true;
}
