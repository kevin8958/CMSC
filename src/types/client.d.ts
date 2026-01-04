declare namespace Client {
  interface Client {
    id: string;
    company_id: string;
    name: string;
    status: "active" | "terminated";
    manager_name?: string; // 담당자명 (수기)
    manager_phone?: string; // 담당자 연락처
    manager_email?: string; // 담당자 이메일
    fax?: string; // 팩스
    contract_date?: string;
    description?: string;
    created_at: string;
    updated_at: string;
  }

  interface CreateClientInput {
    name: string;
    status: "active" | "terminated";
    manager_name?: string;
    manager_phone?: string;
    manager_email?: string;
    fax?: string;
    contract_date?: string;
    description?: string;
  }
}
