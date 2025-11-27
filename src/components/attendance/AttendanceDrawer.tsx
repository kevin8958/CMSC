import Drawer from "@/components/Drawer";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Label from "@/components/Label";
import Badge from "@/components/Badge";
import AccordionItem from "@/components/AccordionItem";
import { AccordionTrigger } from "@/components/AccordionTrigger";
import { AccordionContent } from "@/components/AccordionContent";
import Accordion from "@/components/Accordion";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { motion } from "framer-motion";

export default function AttendanceDrawer({
  open,
  worker,
  onClose,
}: {
  open: boolean;
  worker: Worker.Worker;
  onClose: () => void;
}) {
  const { records, recordLoading, fetchMemberRecords, clearRecords } =
    useAttendanceStore();

  const currentYear = dayjs().year();

  useEffect(() => {
    if (open && worker?.id) fetchMemberRecords(worker.id);
    else clearRecords();
  }, [open, worker]);

  if (!worker) return null;

  return (
    <Drawer
      open={open}
      title={`${worker.name}님의 연차 정보`}
      showFooter={false}
      onClose={onClose}
    >
      <FlexWrapper direction="col" gap={4} classes="p-4">
        {/* ───────── 기본정보 ───────── */}
        <FlexWrapper
          items="start"
          direction="col"
          gap={0}
          classes="border rounded-lg"
        >
          <FlexWrapper
            items="center"
            justify="between"
            gap={2}
            classes="py-2 px-4 bg-gray-50 w-full border-b rounded-t-lg"
          >
            <Typography variant="H4">기본정보</Typography>
          </FlexWrapper>
          <div className="grid grid-cols-12 p-4 gap-4  w-full">
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <Label text="이름" />
              <Typography variant="B2">{worker.name}</Typography>
            </FlexWrapper>
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <Label text="입사일" />
              <Typography variant="B2">{worker.joined_at || "-"}</Typography>
            </FlexWrapper>
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <Label text="직급" />
              <Typography variant="B2">{worker.position || "-"}</Typography>
            </FlexWrapper>
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <Label text="직책" />
              <Typography variant="B2">{worker.duty || "-"}</Typography>
            </FlexWrapper>
          </div>
        </FlexWrapper>

        {/* ───────── 연차정보 ───────── */}
        <FlexWrapper
          items="start"
          direction="col"
          gap={0}
          classes="border rounded-lg"
        >
          <FlexWrapper
            items="center"
            justify="between"
            gap={2}
            classes="py-2 px-4 bg-gray-50 w-full border-b rounded-t-lg"
          >
            <Typography variant="H4">연차정보</Typography>
            <FlexWrapper gap={1} items="center">
              <Badge
                color="primary"
                size="sm"
                classes="!w-[80px] !justify-center"
              >
                총 연차 {worker.total_leave}
              </Badge>
              <Badge
                color="danger"
                size="sm"
                classes="!w-[80px] !justify-center"
              >
                사용 연차 {worker.used_leave}
              </Badge>
              <Badge
                color="green"
                size="sm"
                classes="!w-[80px] !justify-center"
              >
                잔여 연차 {worker.total_leave - worker.used_leave}
              </Badge>
            </FlexWrapper>
          </FlexWrapper>

          {/* 로딩 중 */}
          {recordLoading ? (
            <div className="p-4 flex flex-col gap-3 w-full">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-[36px] w-full bg-gray-100 rounded-md"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          ) : records.length === 0 ? (
            // 데이터 없을 때 → 올해 아코디언만
            <Accordion>
              <AccordionItem
                key={currentYear}
                classes="!border-none !rounded-none"
              >
                <AccordionTrigger id={currentYear.toString()}>
                  {currentYear}년
                </AccordionTrigger>
                <AccordionContent id={currentYear.toString()}>
                  <div className="p-4 text-gray-400 text-sm">
                    등록된 연차 내역이 없습니다.
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            // 데이터 있을 때
            <Accordion>
              {records.map((year) => (
                <AccordionItem key={year.year}>
                  <AccordionTrigger id={year.year.toString()}>
                    {year.year}년 - 총 {year.used}일
                  </AccordionTrigger>
                  <AccordionContent id={year.year.toString()}>
                    {year.records.map((r) => (
                      <FlexWrapper key={r.id} justify="between" classes="py-2">
                        <Typography variant="B2">
                          {dayjs(r.start_date).format("MM/DD")} ~{" "}
                          {dayjs(r.end_date).format("MM/DD")}
                        </Typography>
                        <FlexWrapper gap={2}>
                          <Typography variant="C1">{r.days}일</Typography>
                          <Typography variant="C1" classes="text-gray-500">
                            {r.reason}
                          </Typography>
                        </FlexWrapper>
                      </FlexWrapper>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </FlexWrapper>
      </FlexWrapper>
    </Drawer>
  );
}
