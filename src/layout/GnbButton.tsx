// components/NavLink.tsx

'use client';

import clsx from 'clsx';

const GnbButton = ({ href, isActive, children }: Layout.GnbButtonProps) => {
  const smoothScrollTo = (target: HTMLElement, duration = 800) => {
    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + window.scrollY;
    const distance = end - start;
    let startTime: number | null = null;

    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const loop = (time: number) => {
      if (startTime === null) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = easeInOutQuad(progress);

      window.scrollTo(0, start + distance * eased);

      if (progress < 1) requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        smoothScrollTo(target, 1200);
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={clsx(
        'group relative px-2 py-1 font-semibold text-white transition-colors',
        isActive ? '!font-bold !text-[#50b4ff]' : 'opacity-80 hover:opacity-100',
      )}
    >
      <span className="relative z-10 text-xs">{children}</span>
      <span
        className={clsx(
          'absolute bottom-0 left-1/2 h-[2px] w-0 origin-center rounded-xs bg-white transition-all duration-300 ease-in-out',
          'group-hover:w-[calc(100%-16px)]',
          isActive && 'w-[calc(100%-16px)] -translate-x-1/2 !bg-[#50b4ff]',
          !isActive && 'group-hover:-translate-x-1/2',
        )}
      ></span>
    </a>
  );
};

export default GnbButton;
