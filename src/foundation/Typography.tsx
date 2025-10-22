import classNames from "classnames";

const baseStyles: Record<string, string> = {
  H1: "text-[64px] leading-[1.2] font-bold",
  H2: "text-[40px] font-bold",
  H3: "text-[24px] font-bold",
  H4: "text-[16px] font-semibold",
  B1: "text-[16px] font-thin",
  B2: "text-[14px] font-thin",
  C1: "text-[12px]",
};

const Typography = (props: Foundation.TypographyProps) => {
  const { classes = "", variant, color = "primary", children } = props;

  return (
    <p
      className={classNames(
        baseStyles[variant],
        "tracking-wide transition-all duration-200 ease-in-out",
        {
          "text-primary-900": color === "primary",
          "text-secondary-400": color === "secondary",
        },
        classes
      )}
    >
      {children}
    </p>
  );
};

export default Typography;
