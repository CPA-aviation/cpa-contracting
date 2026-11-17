"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero video supplied by the client (CloudFront). Illustrative architectural
 * visualisation — not a company project. Licence/source to be confirmed.
 */
export const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4";

const MAX_CAPTURE_WIDTH = 960;
const FPS = 30;
const MAX_FRAMES = 420; // memory guard (~14 s at 30 fps)

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

/**
 * Plays the video once while capturing each frame to offscreen canvases,
 * then plays those frames forward → backward → forward on a canvas at 30 fps.
 * Under prefers-reduced-motion the video is not played; its first frame stays still.
 */
export function BoomerangVideoBg({ src = HERO_VIDEO_URL }: { src?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [useCors, setUseCors] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current as VideoWithFrameCallback | null;
    const display = canvasRef.current;
    if (!video || !display) return;

    video.muted = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frames: HTMLCanvasElement[] = [];
    let lastTime = -1;
    let capturing = true;
    let cancelled = false;
    let vfcHandle = 0;
    let rafHandle = 0;
    let playHandle = 0;
    const hasVfc = typeof video.requestVideoFrameCallback === "function";

    const capture = () => {
      if (!capturing || frames.length >= MAX_FRAMES || video.readyState < 2) return;
      const t = video.currentTime;
      if (t === lastTime) return; // dedupe by currentTime
      lastTime = t;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;
      const w = Math.min(MAX_CAPTURE_WIDTH, vw);
      const h = Math.round(vh * (w / vw));
      const frame = document.createElement("canvas");
      frame.width = w;
      frame.height = h;
      frame.getContext("2d")?.drawImage(video, 0, 0, w, h);
      frames.push(frame);
    };

    const loopVfc = () => {
      capture();
      if (capturing && !cancelled && video.requestVideoFrameCallback) vfcHandle = video.requestVideoFrameCallback(loopVfc);
    };
    const loopRaf = () => {
      capture();
      if (capturing && !cancelled) rafHandle = requestAnimationFrame(loopRaf);
    };

    const startBoomerang = () => {
      if (frames.length < 2 || cancelled) return;
      display.width = frames[0].width;
      display.height = frames[0].height;
      const ctx = display.getContext("2d");
      if (!ctx) return;
      const interval = 1000 / FPS;
      let index = 0;
      let direction = 1;
      let last = 0;
      const tick = (now: number) => {
        if (cancelled) return;
        if (now - last >= interval) {
          last = now;
          ctx.drawImage(frames[index], 0, 0);
          if (index + direction >= frames.length || index + direction < 0) direction = -direction;
          index += direction;
        }
        playHandle = requestAnimationFrame(tick);
      };
      ctx.drawImage(frames[0], 0, 0);
      setReady(true);
      playHandle = requestAnimationFrame(tick);
    };

    const onPlay = () => {
      if (hasVfc && video.requestVideoFrameCallback) vfcHandle = video.requestVideoFrameCallback(loopVfc);
      else rafHandle = requestAnimationFrame(loopRaf);
    };
    const onEnded = () => {
      capturing = false;
      if (hasVfc && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(vfcHandle);
      cancelAnimationFrame(rafHandle);
      startBoomerang();
    };
    const onError = () => {
      // A host without CORS headers rejects crossOrigin="anonymous": retry without it.
      if (useCors) setUseCors(false);
      else setFailed(true);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    if (!reduce) video.play().catch(() => undefined);

    return () => {
      cancelled = true;
      capturing = false;
      video.removeEventListener("play", onPlay);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      if (hasVfc && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(vfcHandle);
      cancelAnimationFrame(rafHandle);
      cancelAnimationFrame(playHandle);
    };
  }, [useCors]);

  return (
    <div className="bvideo" aria-hidden="true">
      <div className="bvideo-scale">
        {!failed ? (
          <video
            key={useCors ? "cors" : "plain"}
            ref={videoRef}
            className="bvideo-media"
            src={src}
            muted
            playsInline
            preload="auto"
            crossOrigin={useCors ? "anonymous" : undefined}
            style={{ display: ready ? "none" : "block" }}
          />
        ) : null}
        <canvas ref={canvasRef} className="bvideo-media" style={{ display: ready ? "block" : "none" }} />
      </div>
      <div className="bvideo-tint" />
    </div>
  );
}
