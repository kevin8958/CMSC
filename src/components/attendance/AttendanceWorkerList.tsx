import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import { useWorkerStore } from "@/stores/useWorkerStore";
import { TbMoodEmpty } from "react-icons/tb";

export default function AttendanceWorkerList({
  workers,
  onSelectWorker,
}: {
  workers: Worker.Worker[];
  onSelectWorker: (m: any) => void;
}) {
  const { allListLoading } = useWorkerStore();

  const skeletons = Array.from({ length: 8 }).map((_, i) => (
    <div
      key={i}
      className="p-3 flex justify-between items-center animate-pulse"
    >
      <FlexWrapper gap={2} items="center">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <FlexWrapper direction="col" gap={1}>
          <div className="w-24 h-3 rounded bg-gray-200" />
          <div className="w-32 h-3 rounded bg-gray-100" />
        </FlexWrapper>
      </FlexWrapper>
      <div className="w-12 h-3 rounded bg-gray-200" />
    </div>
  ));

  return (
    <FlexWrapper
      direction="col"
      gap={2}
      classes="h-[300px] sm:h-[calc(100vh-160px)] bg-white border rounded-xl"
    >
      <FlexWrapper gap={2} items="center" classes="p-4 pb-2">
        <Typography variant="H4">멤버목록</Typography>
        <Badge color="green" size="md">
          {workers?.length || 0}
        </Badge>
      </FlexWrapper>
      <div className="w-full sm:w-[360px] h-full overflow-y-auto scroll-thin px-4 flex flex-col gap-1">
        {allListLoading ? (
          skeletons
        ) : workers.length > 0 ? (
          workers.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelectWorker(m)}
              className="cursor-pointer p-3 hover:bg-gray-50 border rounded-xl flex justify-between items-center transition-all duration-150"
            >
              <FlexWrapper direction="col" gap={0}>
                <FlexWrapper gap={2} items="center">
                  <Avatar size="sm" type="text" name={m.name} />
                  <FlexWrapper gap={1} items="start" direction="col">
                    <FlexWrapper gap={1} items="center">
                      <Typography variant="B2" classes="font-semibold">
                        {m.name}
                      </Typography>
                      <Typography variant="C1" classes="!text-gray-500">
                        {m.position}
                      </Typography>
                      <Typography variant="C1" classes="!text-gray-500">
                        {m.department}
                      </Typography>
                    </FlexWrapper>
                    <FlexWrapper gap={1} items="center">
                      <Badge
                        color="primary"
                        size="sm"
                        classes="!w-[80px] !justify-center"
                      >
                        총 연차 {m.total_leave}
                      </Badge>
                      <Badge
                        color="danger"
                        size="sm"
                        classes="!w-[80px] !justify-center"
                      >
                        사용 연차 {m.used_leave}
                      </Badge>
                      <Badge
                        color="green"
                        size="sm"
                        classes="!w-[80px] !justify-center"
                      >
                        잔여 연차 {m.total_leave - m.used_leave}
                      </Badge>
                    </FlexWrapper>
                  </FlexWrapper>
                </FlexWrapper>
              </FlexWrapper>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2 p-4">
            <TbMoodEmpty className="text-4xl text-gray-300" />
            <p className="text-gray-400 text-sm">등록된 멤버가 없습니다</p>
          </div>
        )}
      </div>
    </FlexWrapper>
  );
}
