declare namespace Client {
  interface Client {
    id: string;
    company_id: string;
    name: string;
    status: "active" | "terminated";
    contact?: string;
    manager_id?: string; // 담당 직원 ID
    contract_date?: string;
    description?: string;
    created_at: string;
    updated_at: string;
  }

  interface CreateClientInput {
    name: string;
    status: "active" | "terminated";
    contact?: string;
    manager_id?: string;
    contract_date?: string;
    description?: string;
  }
}
