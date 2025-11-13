import classNames from "classnames";

export default function AccordionItem({
  children,
  classes,
}: {
  children: React.ReactNode;
  classes?: string;
}) {
  return (
    <div
      className={classNames(
        "border rounded-lg overflow-hidden transition-all duration-300",
        classes
      )}
    >
      {children}
    </div>
  );
}
