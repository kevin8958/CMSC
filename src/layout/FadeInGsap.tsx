import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FadeInGsap({
  children,
  classes,
}: {
  children: React.ReactNode;
  classes?: string;
}) {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!el.current) return;

    gsap.fromTo(
      el.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el.current,
          start: 'top 90%', // 화면의 80% 지점에서 시작
          toggleActions: 'play none none reverse',
        },
      },
    );
  }, []);

  return (
    <div ref={el} className={classes}>
      {children}
    </div>
  );
}
