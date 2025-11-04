/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-autofocus */
import Typography from "@/foundation/Typography";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { LuCircleHelp, LuEye, LuEyeOff } from "react-icons/lu";
import { useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";

const TextInput = (props: Common.TextInputProps) => {
  const {
    label = "",
    tooltip = "",
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 숫자 입력 시 콤마 자동 추가
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const numericValue = e.target.value.replace(/[^0-9.-]/g, "");
      const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      e.target.value = formatted;
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

  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <div className="relative flex flex-col items-start">
        <input className="hidden" aria-hidden="true" />

        {/* Label + Tooltip */}
        <FlexWrapper gap={1} items="center" classes="relative mb-1">
          {label && (
            <label
              htmlFor={id}
              className={classNames("text-primary-800 !text-sm font-normal", {
                "after:absolute after:top-0 after:-right-[7px] after:rounded-full after:text-[#FF3535] after:content-['*']":
                  required,
              })}
            >
              {label}
            </label>
          )}
          {tooltip && (
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <LuCircleHelp
                className="text-primary-400 cursor-pointer hover:text-primary-600"
                size={16}
              />
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-6 top-[-5px] z-50 w-max max-w-[220px] rounded-md bg-gray-800 px-3 py-2 text-xs text-white shadow-lg"
                  >
                    {tooltip}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </FlexWrapper>

        {/* Input */}
        <div className="relative w-full">
          <input
            {...inputProps}
            id={id}
            maxLength={max}
            // 👇 패스워드일 경우 toggle 반영
            type={
              isPassword
                ? showPassword
                  ? "text"
                  : "password"
                : type === "number"
                  ? "text"
                  : type
            }
            autoFocus={autoFocus}
            className={classNames(
              "form-control box-border w-full overflow-hidden border border-gray-300 bg-white p-2 !text-base outline-0 transition-all duration-200 ease-in-out placeholder:text-[#AFAFAF] placeholder:text-sm focus:!border-2 focus:border-info",
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
                "!pr-10": suffix || isPassword,
              }
            )}
            tabIndex={0}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            value={
              type === "number" && inputProps?.value
                ? Number(inputProps.value).toLocaleString("ko-KR")
                : inputProps?.value
            }
          />

          {/* 오른쪽 아이콘 */}
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 bottom-1/2 translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <LuEye className="text-lg" />
              ) : (
                <LuEyeOff className="text-lg" />
              )}
            </button>
          ) : (
            suffix && <div className="absolute right-3 bottom-3">{suffix}</div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Typography
            variant="C1"
            classes="!text-danger absolute bottom-[-20px] left-0"
          >
            {errorMsg}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default TextInput;
