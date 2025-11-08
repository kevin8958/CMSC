import classNames from "classnames";
import Label from "@/components/Label";

const Textarea = (props: Common.TextareaProps) => {
  const {
    label,
    placeholder,
    error,
    errorMsg,
    textareaProps,
    disabled,
    value,
    onChange,
  } = props;
  return (
    <>
      {label && <Label text={label} />}
      <textarea
        id="description"
        className={classNames(
          "size-full resize-none text-sm rounded-lg border p-2 outline-none pr-10 scrollbar-hide focus:!border-2 transition-all duration-200 ease-in-out box-border h-[120px] max-h-[120px] placeholder:!text-gray-300 placeholder:!text-sm",
          {
            "!border-danger !border-2 focus:!border-danger": error,
            "border-gray-300 focus:!border-info ": !error,
            "!bg-newPrimary-50 !text-[#8C9097]": disabled,
          }
        )}
        tabIndex={0}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        {...textareaProps}
      />
      {error && (
        <p className="absolute bottom-[-20px] left-0 text-danger">{errorMsg}</p>
      )}
    </>
  );
};

export default Textarea;
