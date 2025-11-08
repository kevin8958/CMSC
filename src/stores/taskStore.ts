import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export type Task = {
  id: string;
  title: string;
  status: string;
  description?: string;
  priority?: string;
  assignee?: string;
  due_date?: string;
  sort_index: number;
};

type TaskStore = {
  tasks: Task[];
  fetching: boolean;
  setTasks: (tasks: Task[]) => void;
  fetchTasks: (companyId: string) => Promise<void>;
  createTask: (
    companyId: string,
    status: string,
    title: string,
    description?: string,
    priority?: string,
    due_date?: string,
    assignee?: string
  ) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, fields: Partial<Task>) => Promise<void>;
  updateOrder: (
    companyId: string,
    updates: Array<Pick<Task, "id" | "status" | "sort_index">>
  ) => Promise<void>;
  fetchAllMembers: (currentCompanyId: string) => Promise<any[]>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  fetching: false,

  setTasks: (tasks) => set({ tasks }),

  fetchTasks: async (companyId) => {
    set({ fetching: true });

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await fetch(`/api/tasks/list?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { tasks } = await res.json();

    set({ tasks, fetching: false });
  },
  createTask: async (
    companyId,
    status,
    title,
    description,
    priority,
    due_date,
    assignee
  ) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await fetch(`/api/tasks/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company_id: companyId,
        status,
        title,
        description,
        priority,
        due_date,
        assignee,
      }),
    });

    const { task } = await res.json();
    if (task) {
      set({ tasks: [...get().tasks, task] });
    }
  },
  deleteTask: async (taskId) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await fetch(`/api/tasks/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task_id: taskId }),
    });

    if (res.ok) {
      set({ tasks: get().tasks.filter((task) => task.id !== taskId) });
    }
  },
  updateTask: async (taskId: string, fields: Partial<Task>) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await fetch(`/api/tasks/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task_id: taskId, fields }),
    });

    if (res.ok) {
      // local state update
      set({
        tasks: get().tasks.map((t) =>
          t.id === taskId ? { ...t, ...fields } : t
        ),
      });
    }
  },

  updateOrder: async (companyId, updates) => {
    // optimistic 은 호출하는 쪽(컴포넌트)에서 setTasks로 이미 반영했다고 가정
    const prev = get().tasks;
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await fetch(`/api/tasks/update-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ company_id: companyId, updates }),
    });

    if (!res.ok) {
      // 실패 시 롤백
      set({ tasks: prev });
      const { error } = await res
        .json()
        .catch(() => ({ error: "Server error" }));
      console.error("update-order failed:", error);
    }
  },
  fetchAllMembers: async (currentCompanyId: string) => {
    const res = await fetch(
      `/api/tasks/company-member-list?companyId=${currentCompanyId}`
    );
    const { data } = await res.json();

    const members = data.map((m: any) => ({
      user_id: m.user_id,
      nickname: m.profiles?.nickname ?? "-",
      email: m.profiles?.email ?? "-",
      joined_at: m.joined_at,
      created_at: m.created_at,
      role: m.role,
    }));

    // admin 먼저 나오게 정렬은 유지
    members.sort((a: any, b: any) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      return 0;
    });

    return members; // ← 여기 set 하지마. 이건 그냥 리턴!
  },
}));
