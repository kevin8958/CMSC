// components/NavLink.tsx

"use client";

import clsx from "clsx";

const GnbButton = ({ href, classes, children }: Layout.GnbButtonProps) => {
  return (
    <a
      href={href}
      className={clsx(
        "relative px-2 py-1 transition-all duration-200 hover:bg-primary-100 rounded-lg font-normal ",
        classes
      )}
    >
      {children}
    </a>
  );
};

export default GnbButton;
