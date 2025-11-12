namespace Task {
  type Task = {
    id: string;
    title: string;
    status: string;
    description?: string;
    priority?: string;
    assignee?: string;
    due_date?: string;
    sort_index: number;
  };

  interface TaskDrawerProps {
    open: boolean;
    mode: "create" | "edit";
    task?: Task | null;
    members: any[];
    onClose: () => void;
    onSubmit: (data: Partial<Task>) => Promise<void>;
    onDelete?: () => Promise<void>;
  }
}
