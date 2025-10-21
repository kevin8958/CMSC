'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PlanetBackground = () => {
  const planetsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // planetsRef.current가 빈 배열이면 종료
    if (!planetsRef.current.length) return;

    planetsRef.current.forEach((planet) => {
      if (!planet) return;

      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(planet, {
        x: () => gsap.utils.random(-300, 300),
        y: () => gsap.utils.random(-300, 300),
        scale: () => gsap.utils.random(0.2, 2),
        duration: gsap.utils.random(4, 10),
        ease: 'sine.inOut',
      });
    });
  }, []);

  // 안전하게 ref 설정
  const setPlanetRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) planetsRef.current[index] = el;
  };

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={setPlanetRef(0)}
        className="absolute bottom-0 left-[20%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,_rgba(180,100,255,0.2),_transparent_80%)] blur-3xl"
      />
      <div
        ref={setPlanetRef(1)}
        className="absolute top-[10%] right-[5%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,_rgba(180,100,255,0.3),_transparent_70%)] blur-2xl"
      />
      <div
        ref={setPlanetRef(2)}
        className="absolute top-[5%] left-[5%] h-[250px] w-[250px] rounded-full bg-[radial-gradient(circle,_rgba(80,180,255,0.15),_transparent_80%)] blur-2xl"
      />
      <div
        ref={setPlanetRef(3)}
        className="absolute right-[30%] bottom-[15%] h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,_rgba(255,150,200,0.15),_transparent_75%)] blur-2xl"
      />
    </div>
  );
};

export default PlanetBackground;
