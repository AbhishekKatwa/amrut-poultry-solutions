import { useEffect, useRef, useState } from 'react';
import { useCoarsePointer, usePrefersReducedMotion } from '@/lib/motion';

type Scene = import('@/three/HeroScene').HeroScene;

function hasWebGL(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Mounts the three.js diorama only when it can pay for itself: WebGL present,
 * the element on screen, the tab visible. Otherwise the CSS layer shows through.
 */
export default function HeroCanvas({ progress, pointer }: { progress: number; pointer: { x: number; y: number } }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const [state, setState] = useState<'idle' | 'live' | 'fallback'>('idle');
  const visible = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasWebGL()) {
      setState('fallback');
      return;
    }
    let cancelled = false;
    let observer: IntersectionObserver | undefined;

    (async () => {
      const { HeroScene } = await import('@/three/HeroScene');
      if (cancelled || !canvasRef.current) return;
      const quality = coarse || window.innerWidth < 760 ? 'low' : 'high';
      const scene: Scene = new HeroScene(canvasRef.current, { quality, reducedMotion: reduced });
      sceneRef.current = scene;
      scene.setProgress(progress);
      scene.setPointer(pointer.x, pointer.y);
      scene.start();
      setState('live');

      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(
          ([entry]) => {
            visible.current = entry.isIntersecting;
            if (entry.isIntersecting) scene.start();
            else scene.stop();
          },
          { threshold: 0.02 },
        );
        observer.observe(canvasRef.current);
      }
    })();

    const onVisibility = () => {
      const scene = sceneRef.current;
      if (!scene) return;
      if (document.hidden) scene.stop();
      else if (visible.current) scene.start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      observer?.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
    // One mount for the lifetime of the hero; live values are pushed below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, coarse]);

  useEffect(() => {
    sceneRef.current?.setProgress(progress);
  }, [progress]);

  useEffect(() => {
    sceneRef.current?.setPointer(pointer.x, pointer.y);
  }, [pointer]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={
        state === 'live'
          ? 'h-full w-full opacity-100 transition-opacity duration-1000'
          : 'h-full w-full opacity-0 transition-opacity duration-1000'
      }
    />
  );
}
