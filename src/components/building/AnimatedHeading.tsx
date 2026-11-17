"use client";

import { useEffect, useState, type CSSProperties } from "react";

interface AnimatedHeadingProps {
  text: string;
  initialDelay?: number;
  charDelay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

export function AnimatedHeading({
  text,
  initialDelay = 200,
  charDelay = 30,
  duration = 500,
  className = "",
  style,
}: AnimatedHeadingProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, initialDelay);

    return () => window.clearTimeout(timer);
  }, [initialDelay]);

  const lines = text.split("\n");

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => {
        const chars = Array.from(line);
        const lineLength = chars.length;

        return (
          <span key={`${lineIndex}-${line}`} className="vex-heading-line">
            {chars.map((char, charIndex) => {
              const delayMs = lineIndex * lineLength * charDelay + charIndex * charDelay;

              return (
                <span
                  key={`${lineIndex}-${charIndex}`}
                  className={`vex-heading-char ${visible ? "is-visible" : ""}`}
                  style={{
                    transitionDuration: `${duration}ms`,
                    transitionDelay: `${delayMs}ms`,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
