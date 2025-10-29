/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-autofocus */
import Typography from "@/foundation/Typography";
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
    onChange,
    onKeyUp,
  } = props;

  // 🔹 숫자 입력 시 콤마 자동 추가
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      // 숫자만 남기기
      const numericValue = e.target.value.replace(/[^0-9.-]/g, "");
      // 3자리 콤마 추가
      const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // input에 표시되는 값은 콤마 포함
      e.target.value = formatted;

      // 부모로 넘길 때는 콤마 제거한 순수 숫자값
      if (onChange) {
        const cleanValue = numericValue;
        onChange({
          ...e,
          target: { ...e.target, value: cleanValue },
        });
      }
    } else {
      onChange?.(e);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex flex-col items-start">
        <input className="hidden" aria-hidden="true" />
        {label && (
          <label
            htmlFor={id}
            className={classNames(
              "text-primary-800 relative mb-1 !text-sm font-normal",
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
          // 👇 실제로는 text input으로 렌더링 (콤마 허용)
          type={type === "number" ? "text" : type}
          autoFocus={autoFocus}
          className={classNames(
            "form-control box-border w-full overflow-hidden border border-gray-300 bg-white p-2 !text-base text-ellipsis outline-0 transition-all duration-200 ease-in-out placeholder:text-[#AFAFAF] placeholder:text-sm focus:!border-2 focus:border-info",
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
          // 👇 콤마 처리 로직 연결
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
          // 👇 표시될 때도 콤마 적용
          value={
            type === "number" && inputProps?.value
              ? Number(inputProps.value).toLocaleString("ko-KR")
              : inputProps?.value
          }
        />
        {suffix && <div className="absolute right-3 bottom-3">{suffix}</div>}
        <Typography
          variant="C1"
          classes="!text-danger absolute bottom-[-20px] left-0"
        >
          {errorMsg}
        </Typography>
      </div>
    </div>
  );
};

export default TextInput;
