namespace Task {
  type Task = {
    id: string;
    company_id: string;
    title: string;
    description?: string;
    status: string;
    priority?: string;
    due_date?: string;
    assignee?: string;
    sort_index?: number;
    created_at: string;
    updated_at: string;
    task_comments?: TaskComment[];
  };

  type TaskComment = {
    id: string;
    task_id: string;
    author_id: string | null;
    content: string;
    created_at: string;
    updated_at: string;
    count?: number;
  };

  interface TaskDrawerProps {
    open: boolean;
    disabled: boolean;
    mode: "create" | "edit";
    task?: Task | null;
    workers: Worker.Worker[];
    onClose: () => void;
    onSubmit: (data: Partial<Task>) => Promise<void>;
    onDelete?: () => Promise<void>;
  }
}
