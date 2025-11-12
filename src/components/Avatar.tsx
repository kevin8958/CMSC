/* eslint-disable @next/next/no-img-element */

import classNames from "classnames";

const sizeMap = {
  sm: 40,
  md: 55,
  lg: 65,
} as const;

const textSizeMap = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-4xl",
} as const;

const Avatar = (props: Common.AvatarProps) => {
  const {
    size = "md",
    type = "image",
    state = "none",
    disabled = false,
    profileImageUrl,
    name,
  } = props;
  const firstLetter = name?.charAt(0).toUpperCase() || "?";
  const dimension = sizeMap[size] ?? 55;
  const textSize = textSizeMap[size] ?? "text-3xl";

  const content = (() => {
    if (type === "image") {
      if (profileImageUrl) {
        return (
          <img
            src={profileImageUrl}
            alt="profile"
            className="size-full object-cover"
          />
        );
      }
      return <p className={classNames(textSize, "font-tossface")}>👦</p>;
    }
    return (
      <p className={classNames(textSize, "text-primary-800 font-bold")}>
        {firstLetter}
      </p>
    );
  })();

  return (
    <div
      title={name}
      style={{ width: dimension, height: dimension }}
      className="relative"
    >
      <div className="bg-green-100 flex size-full items-center justify-center overflow-hidden rounded-full">
        {content}
      </div>
      {state !== "none" && (
        <span
          className={classNames(
            "absolute right-0 bottom-0 h-3 w-3 rounded-full ring-2 ring-white",
            {
              "bg-success": state === "active",
              "bg-warning": state === "semiActive",
              "bg-danger": state === "inactive",
              "!bg-gray-300": disabled,
            }
          )}
        />
      )}
      {disabled && (
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gray-300 opacity-70" />
      )}
    </div>
  );
};

export default Avatar;
