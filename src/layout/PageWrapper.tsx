'use client';

import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const PageWrapper = ({ children }: Layout.PageWrapperProps) => {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinel = useRef<HTMLDivElement>(null);
  const bottomSentinel = useRef<HTMLDivElement>(null);

  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !topSentinel.current || !bottomSentinel.current) return () => {};

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === topSentinel.current) {
            setShowTopShadow(!entry.isIntersecting);
          }
          if (entry.target === bottomSentinel.current) {
            setShowBottomShadow(!entry.isIntersecting);
          }
        });
      },
      {
        root,
        threshold: 0.1, // 살짝만 보여도 감지되도록
      },
    );

    io.observe(topSentinel.current);
    io.observe(bottomSentinel.current);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={scrollRef} className="relative flex w-full flex-col overflow-y-auto">
      <div ref={topSentinel} className="h-px w-full" />

      {/* 콘텐츠가 너무 짧으면 스크롤 감지가 안 되므로 최소 높이 확보 */}
      <div className="w-full">{children}</div>

      <div ref={bottomSentinel} className="h-4 w-full" />

      {/* ⇡ 위 그림자 */}
      <div
        className={classNames(
          'pointer-events-none fixed top-0 left-0 z-40 h-[120px] w-full',
          'from-primary-990 bg-gradient-to-b to-transparent',
          'transition-opacity duration-700',
          showTopShadow ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* ⇣ 아래 그림자 */}
      <div
        className={classNames(
          'pointer-events-none fixed bottom-0 left-0 z-40 h-[100px] w-full',
          'to-primary-990 bg-gradient-to-b from-transparent',
          'transition-opacity duration-300',
          showBottomShadow ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
};

export default PageWrapper;
