import classNames from "classnames";

const Label = (props: Common.LabelProps) => {
  const { text, classes, required } = props;
  return (
    <p
      className={classNames("relative text-sm w-max", classes, {
        "after:absolute after:right-[-10px] after:top-0 after:rounded-full after:text-danger after:content-['*']":
          required,
      })}
    >
      {text}
    </p>
  );
};

export default Label;
