import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useEffect } from "react";
import { useCompanyStore } from "@/stores/useCompanyStore";

export default function AttendanceMemberList({
  onSelectMember,
}: {
  onSelectMember: (m: any) => void;
}) {
  const { members, memberLoading, fetchMembers } = useAttendanceStore();
  const { currentCompanyId } = useCompanyStore();

  useEffect(() => {
    if (currentCompanyId) fetchMembers(currentCompanyId);
  }, [currentCompanyId]);

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
    <FlexWrapper direction="col" gap={2} classes="h-[calc(100vh-160px)]">
      <FlexWrapper gap={2} items="center" classes="px-4">
        <Typography variant="H4">멤버목록</Typography>
        <Badge color="green" size="md">
          {members?.length || 0}
        </Badge>
      </FlexWrapper>
      <div className="w-[360px] overflow-y-auto scroll-thin pr-4 flex flex-col">
        {memberLoading
          ? skeletons
          : members.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMember(m)}
                className="cursor-pointer p-3 hover:bg-gray-50 flex justify-between items-center transition-all duration-150"
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
                          사원
                        </Typography>
                      </FlexWrapper>
                      <FlexWrapper gap={1} items="center">
                        <Badge
                          color="primary"
                          size="sm"
                          classes="!w-[80px] !justify-center"
                        >
                          총 연차 {m.total_days}
                        </Badge>
                        <Badge
                          color="danger"
                          size="sm"
                          classes="!w-[80px] !justify-center"
                        >
                          사용 연차 {m.used_days}
                        </Badge>
                        <Badge
                          color="green"
                          size="sm"
                          classes="!w-[80px] !justify-center"
                        >
                          잔여 연차 {m.total_days - m.used_days}
                        </Badge>
                      </FlexWrapper>
                    </FlexWrapper>
                  </FlexWrapper>
                </FlexWrapper>
              </div>
            ))}
      </div>
    </FlexWrapper>
  );
}
