'use client';

import { useRef, useState } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import { componentsImages } from '@/constants/common';
import Image from 'next/image';
import Link from 'next/link';
import '@splidejs/react-splide/css';

const CarouselWithProgress = () => {
  const splideRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);

  const handleMove = () => {
    const splide = splideRef.current?.splide;
    if (splide) {
      const end = splide.Components.Controller.getEnd() || 1;
      const rate = (splide.index + 1) / (end + 1);
      setProgress(rate * 100);
    }
  };

  return (
    <div className="mx-auto block w-full md:hidden">
      <Splide
        ref={splideRef}
        hasTrack={false}
        options={{
          type: 'loop',
          perPage: 1,
          autoplay: true,
          interval: 3000,
          pagination: false,
          arrows: false,
        }}
        onMounted={handleMove}
        onMove={handleMove}
      >
        <SplideTrack>
          {componentsImages.map((item) => (
            <SplideSlide key={item.id}>
              <Link
                href={item.href}
                className="bg-primary-990 flex aspect-[3/2] w-full items-center justify-center rounded-lg text-white"
              >
                <div className="relative h-full w-[90%]">
                  <Image
                    src={item.src}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={item.alt}
                    className="rounded-lg object-contain"
                  />
                </div>
              </Link>
            </SplideSlide>
          ))}
        </SplideTrack>

        {/* Progress bar */}
        <div className="mt-2 h-1 w-full rounded bg-gray-200">
          <div
            className="h-full rounded bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Splide>
    </div>
  );
};

export default CarouselWithProgress;
