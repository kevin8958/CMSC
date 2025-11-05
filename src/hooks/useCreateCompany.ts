import { useState } from "react";
import { createCompany } from "@/actions/companyActions";

export function useCreateCompany() {
  const [error, setError] = useState<string | null>(null);

  const handleCreateCompany = async (name: string) => {
    try {
      setError(null);
      const company = await createCompany(name);
      return company;
    } catch (err: any) {
      setError(err.message || err.toString());
      return null;
    }
  };

  return { handleCreateCompany, error };
}
