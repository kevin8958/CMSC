// AccordionTrigger.tsx
import { useAccordion } from "./Accordion";
import FlexWrapper from "@/layout/FlexWrapper";
import { IoChevronDown } from "react-icons/io5";
import classNames from "classnames";

export function AccordionTrigger({
  id,
  children,
  classes,
}: {
  id: string;
  children: React.ReactNode;
  classes?: string;
}) {
  const { openItem, setOpenItem } = useAccordion();
  const isOpen = openItem === id;

  return (
    <button
      type="button"
      className={classNames(
        "w-full flex justify-between items-center px-4 py-3 text-left border-b font-medium transition-all duration-200",
        "hover:bg-gray-100",
        {
          "bg-gray-50": isOpen,
        },
        classes
      )}
      onClick={() => setOpenItem(isOpen ? null : id)}
    >
      <FlexWrapper justify="between" items="center" classes="w-full">
        <span>{children}</span>
        <IoChevronDown
          className={classNames(
            "transition-transform duration-300 text-gray-600",
            { "rotate-180": isOpen }
          )}
        />
      </FlexWrapper>
    </button>
  );
}
