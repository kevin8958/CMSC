import classNames from "classnames";

const gapMap = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
} as const;

const FlexWrapper = (props: Layout.FlexWrapperProps) => {
  const {
    direction = "row",
    justify,
    items,
    gap = 4,
    classes = "",
    children = null,
  } = props;

  return (
    <div
      className={classNames("flex", classes, gapMap[gap] ?? "", {
        "flex-row": direction === "row",
        "flex-col": direction === "col",
        "justify-start": justify === "start",
        "justify-end": justify === "end",
        "justify-center": justify === "center",
        "justify-between": justify === "between",
        "justify-around": justify === "around",
        "items-start": items === "start",
        "items-end": items === "end",
        "items-center": items === "center",
        "items-baseline": items === "baseline",
        "items-stretch": items === "stretch",
        [`gap-${gap}`]: gap,
      })}
    >
      {children}
    </div>
  );
};

export default FlexWrapper;
