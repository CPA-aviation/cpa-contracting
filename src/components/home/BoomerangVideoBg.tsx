"use client";

import { useEffect, useRef } from "react";

/**
 * Hero video supplied by the client (CloudFront). Illustrative architectural
 * visualisation — not a company project.
 */
export const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4";

/**
 * Native looping background video.
 * Under prefers-reduced-motion, playback is paused to respect user accessibility preferences.
 */
export function BoomerangVideoBg({ src = HERO_VIDEO_URL }: { src?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      video.pause();
    } else {
      video.play().catch(() => undefined);
    }
  }, []);

  return (
    <div className="bvideo" aria-hidden="true">
      <div className="bvideo-scale">
        <video
          ref={videoRef}
          className="bvideo-media"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>
      <div className="bvideo-tint" />
    </div>
  );
}
