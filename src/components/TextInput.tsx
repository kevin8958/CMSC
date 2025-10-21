/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-autofocus */
import classNames from "classnames";

const TextInput = (props: Common.TextInputProps) => {
  const {
    label = "",
    placeholder = "",
    id,
    classes,
    type,
    max,
    size = "md",
    required = false,
    disabled = false,
    error = false,
    errorMsg = "",
    inputProps,
    rounded = "lg",
    suffix = "",
    autoFocus = false,
    onFocus,
    onBlur,
  } = props;

  return (
    <div className="relative w-full">
      <div className="relative flex flex-col items-start">
        <input className="hidden" aria-hidden="true" />
        {label && (
          <label
            htmlFor={id}
            className={classNames(
              "text-primary-800 relative mb-2 !text-sm font-normal",
              {
                "after:absolute after:top-0 after:-right-[7px] after:rounded-full after:text-[#FF3535] after:content-['*']":
                  required,
              }
            )}
          >
            {label}
          </label>
        )}
        <input
          {...inputProps}
          id={id}
          maxLength={max}
          type={type}
          autoFocus={autoFocus}
          className={classNames(
            "form-control box-border w-full overflow-hidden border border-gray-300 bg-white p-2 !text-base text-ellipsis outline-0 transition-all duration-200 ease-in-out placeholder:text-[#AFAFAF] focus:!border-2 focus:!border-info",
            classes,
            {
              "h-[32px] max-h-[32px]": size === "sm",
              "h-[46px] max-h-[46px]": size === "md",
              "h-[56px] max-h-[56px]": size === "lg",
              "!bg-newPrimary-50 !text-[#8C9097]": disabled,
              "!border-danger focus:!border-danger !border-2": error,
              "focus:!border-newPrimary-600": !error,
              "!rounded-sm": rounded === "sm",
              "!rounded-md": rounded === "md",
              "!rounded-lg": rounded === "lg",
              "!rounded-[16px]": rounded === "2xl",
              "!pr-10": suffix,
            }
          )}
          tabIndex={0}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {suffix && <div className="absolute right-3 bottom-3">{suffix}</div>}
        <p className="text-danger absolute bottom-[-20px] left-0">{errorMsg}</p>
      </div>
    </div>
  );
};

export default TextInput;
