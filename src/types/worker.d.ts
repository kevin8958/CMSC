namespace Worker {
  interface Worker {
    id: string;
    company_id: string;
    name: string;
    email: string | null;
    position: string | null;
    duty: string | null;
    joined_at: string | null;
    total_leave: number;
    used_leave: number;
    created_at: string;
  }
  interface CreateWorkerParams {
    company_id: string;
    name: string;
    email?: string | null;
    position?: string | null;
    duty?: string | null;
    joined_at?: string | null;
    total_leave?: number;
    used_leave?: number;
  }
  interface UpdateWorkerParams {
    name?: string;
    email?: string | null;
    position?: string | null;
    duty?: string | null;
    joined_at?: string | null;
    total_leave?: number;
    used_leave?: number;
  }
  type WorkerFormData = {
    name: string;
    email: string | null;
    position: string | null;
    duty: string | null;
    joined_at: string | null;
    total_leave: number;
    used_leave: number;
  };
}
