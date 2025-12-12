import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

export async function fetchMonthlyAttendance(companyId: string, month: string) {
  const start = `${month}-01`;
  const end = dayjs(start).endOf("month").format("YYYY-MM-DD");

  const { data, error } = await supabase
    .from("attendance_records")
    .select(
      `
      id,
      start_date,
      end_date,
      days,
      reason,
      worker_id,
      worker:workers(
        id,
        name,
        position,
        duty
      )
    `
    )
    .eq("company_id", companyId)
    .gte("start_date", start)
    .lte("end_date", end)
    .order("start_date", { ascending: true });

  if (error) throw error;

  return (
    data?.map((r) => {
      const w = r.worker as unknown as {
        id: string;
        name: string;
        position: string | null;
        duty: string | null;
      } | null;

      return {
        id: r.id,
        user_name: w?.name || "-",
        user_position: w?.position || "",
        user_duty: w?.duty || "",
        start_date: r.start_date,
        end_date: r.end_date,
        days: r.days,
        reason: r.reason || "-",
        worker_id: r.worker_id,
      };
    }) || []
  );
}

/** ✅ 연차(근태) 기록 생성 */
export async function createAttendanceRecord(
  payload: Attendance.CreateAttendanceParams
) {
  const { error } = await supabase.from("attendance_records").insert([
    {
      company_id: payload.company_id,
      worker_id: payload.worker_id,
      start_date: payload.start_date,
      end_date: payload.end_date,
      days: payload.days,
      reason: payload.reason ?? null,
      note: payload.note ?? null,
    },
  ]);

  if (error) {
    console.error("❌ createAttendanceRecord error:", error);
    throw error;
  }

  return true;
}

/** ✅ 연차(근태) 기록 수정 */
export async function updateAttendanceRecord(
  payload: Attendance.UpdateAttendanceParams
) {
  const { id, start_date, end_date, reason, note } = payload;

  if (!id) throw new Error("Missing record id");

  // ✅ 자동 일수 계산
  const start = new Date(start_date);
  const end = new Date(end_date);
  const diffDays = Math.max(
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    1
  );

  const { error } = await supabase
    .from("attendance_records")
    .update({
      start_date,
      end_date,
      days: diffDays,
      reason: reason ?? null,
      note: note ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("❌ updateAttendanceRecord error:", error);
    throw error;
  }

  return true;
}

/** ✅ 연차(근태) 기록 삭제 */
export async function deleteAttendanceRecord(id: string) {
  if (!id) throw new Error("Missing record id");

  const { error } = await supabase
    .from("attendance_records")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("❌ deleteAttendanceRecord error:", error);
    throw error;
  }

  return true;
}
export async function fetchAllAttendance(workerId: string) {
  const { data, error } = await supabase
    .from("attendance_records")
    .select(
      `
      id,
      worker_id,
      start_date,
      end_date,
      days,
      reason,
      note,
      created_at
    `
    )
    .eq("worker_id", workerId)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data || [];
}
