import { createContext, useContext, useState } from "react";
import classNames from "classnames";

interface AccordionContextProps {
  openItem: string | null;
  setOpenItem: (id: string | null) => void;
}

const AccordionContext = createContext<AccordionContextProps | null>(null);

export default function Accordion({
  children,
  defaultOpenId = null,
  classes,
}: {
  children: React.ReactNode;
  defaultOpenId?: string | null;
  classes?: string;
}) {
  const [openItem, setOpenItem] = useState<string | null>(defaultOpenId);

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className={classNames("flex flex-col w-full", classes)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export const useAccordion = () => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion.* must be used within <Accordion>");
  return ctx;
};
