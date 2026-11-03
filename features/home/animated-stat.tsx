"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedStat({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let frameId = 0;
    let hasStarted = false;
    const duration = 1400;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function startCount() {
      if (hasStarted) return;
      hasStarted = true;

      if (reducedMotion) {
        setCount(value);
        return;
      }

      const startTime = performance.now();
      function updateCount(now: number) {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 4;
        setCount(Math.round(value * easedProgress));

        if (progress < 1) {
          frameId = window.requestAnimationFrame(updateCount);
        }
      }

      frameId = window.requestAnimationFrame(updateCount);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCount();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <span
      aria-label={`${value}${suffix}`}
      className="tabular-nums"
      ref={elementRef}
    >
      {count.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
