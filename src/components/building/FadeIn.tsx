"use client";

import { useEffect, useState, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 1000,
  className = "",
}: FadeInProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`vex-fade-in ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
