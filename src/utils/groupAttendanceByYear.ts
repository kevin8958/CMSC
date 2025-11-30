import dayjs from "dayjs";

export function groupAttendanceByYear(records: Attendance.AttendanceRecord[]) {
  const map: Record<number, { year: number; used: number; records: any[] }> =
    {};

  records.forEach((r) => {
    const year = dayjs(r.start_date).year();

    if (!map[year]) {
      map[year] = {
        year,
        used: 0,
        records: [],
      };
    }

    map[year].records.push(r);
    map[year].used += r.days;
  });

  return Object.values(map).sort((a, b) => b.year - a.year);
}
