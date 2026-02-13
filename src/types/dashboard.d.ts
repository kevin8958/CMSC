declare namespace Dashboard {
  // 우선순위 타입
  type Priority = "high" | "medium" | "low";

  // 기본 공지사항/일정 인터페이스 (DB 구조와 일치)
  interface Notice {
    id: string;
    company_id: string;
    title: string;
    content: string | null; // DB는 null을 반환함
    start_date: string;
    end_date: string | null; // DB는 null을 반환함
    priority: Priority;
    created_at?: string;
  }

  interface NoticeDrawerProps {
    open: boolean;
    mode: "create" | "edit";
    notice: Notice | null;
    disabled?: boolean;
    onClose: () => void;
    onSubmit: (params: {
      title: string;
      priority: NoticePriority;
      start_date: string;
      end_date: string;
      content: string;
    }) => Promise<void> | void;
    onDelete?: () => Promise<void> | void;
  }

  // API 요청용 파라미터
  interface CreateNoticeParams {
    company_id: string;
    title: string;
    content?: string | null;
    start_date: string;
    end_date?: string | null;
    priority: Priority;
  }

  interface UpdateNoticeParams extends Partial<CreateNoticeParams> {}
}
