declare namespace Contract {
  interface Category {
    id: string;
    company_id: string;
    name: string;
    created_at: string;
  }

  interface Contract {
    id: string;
    company_id: string;
    category_id: string | null;
    title: string;
    status: "active" | "terminated";
    manager_name?: string; // 성함
    manager_phone?: string; // 연락처
    manager_email?: string; // 이메일
    fax?: string; // 팩스
    contract_date?: string;
    end_date?: string;
    description?: string;
    created_at: string;
    updated_at: string;
  }

  interface CreateContractInput {
    category_id?: string | null;
    title: string;
    status: "active" | "terminated";
    manager_name?: string;
    manager_phone?: string;
    manager_email?: string;
    fax?: string;
    contract_date?: string;
    end_date?: string;
    description?: string;
  }
}
