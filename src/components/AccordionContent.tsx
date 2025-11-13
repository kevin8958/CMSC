// AccordionContent.tsx
import { useAccordion } from "./Accordion";
import classNames from "classnames";

export function AccordionContent({
  id,
  children,
  classes,
}: {
  id: string;
  children: React.ReactNode;
  classes?: string;
}) {
  const { openItem } = useAccordion();
  const isOpen = openItem === id;

  return (
    <div
      className={classNames(
        "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        classes
      )}
    >
      <div className="p-4">{children}</div>
    </div>
  );
}
