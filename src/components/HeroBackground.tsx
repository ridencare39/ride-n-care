import { useEffect, useRef } from "react";
import heroJpg from "@/assets/hero-3d-mechanic.jpg";
import heroWebp from "@/assets/hero-3d-mechanic.webp";
import heroAvif from "@/assets/hero-3d-mechanic.avif";

/** 3D mechanic hero background with subtle scroll parallax + floating layers. */
export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const y = Math.min(window.scrollY, 900);
        el.style.transform = `translate3d(0, ${y * 0.12}px, 0) scale(1.08)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform">
      <picture>
        <source srcSet={heroAvif} type="image/avif" />
        <source srcSet={heroWebp} type="image/webp" />
        <img
          src={heroJpg}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1088}
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-right"
        />
      </picture>
    </div>
  );
}

export function HeroCardImage() {
  return (
    <picture>
      <source srcSet={heroAvif} type="image/avif" />
      <source srcSet={heroWebp} type="image/webp" />
      <img
        src={heroJpg}
        alt="3D illustration of a mechanic repairing a two-wheeler at the customer's doorstep"
        width={1920}
        height={1088}
        loading="lazy"
        decoding="async"
        className="w-full h-[520px] object-cover"
      />
    </picture>
  );
}
