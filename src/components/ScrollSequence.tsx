'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinematicAudio } from '@/utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface ScrollSequenceProps {
  /** Total number of frames in public/sequence/ */
  frameCount: number;
  /** File extension of the frames (default: 'webp') */
  format?: 'webp' | 'jpg' | 'png';
  /** How many viewport heights the scroll animation spans (default: 4) */
  scrollSpan?: number;
}

/**
 * High-performance scroll-driven image sequence renderer.
 * Preloads all frames into memory, then draws them to a <canvas>
 * as the user scrolls, using GSAP ScrollTrigger for the mapping.
 *
 * HOW TO USE:
 * 1. Drop your sequentially-named frames into public/sequence/
 *    Named as: frame_001.webp, frame_002.webp, ... frame_030.webp
 * 2. Set frameCount to the total number of frames you have.
 * 3. That's it!
 */
export default function ScrollSequence({
  frameCount,
  format = 'webp',
  scrollSpan = 4,
  children,
}: ScrollSequenceProps & { children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate the src path for a given frame index (0-based)
  const getFrameSrc = useCallback(
    (index: number) => {
      const padded = String(index + 1).padStart(3, '0');
      return `/sequence/frame_${padded}.${format}`;
    },
    [format]
  );

  // Preload all frames into memory
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const onLoad = () => {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / frameCount) * 100));
      if (loadedCount === frameCount) {
        framesRef.current = images;
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = onLoad;
      img.onerror = onLoad; // count errors too so we don't hang
      images.push(img);
    }

    return () => {
      // Cleanup: release image references
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [frameCount, getFrameSrc]);

  // Draw a specific frame to the canvas (cover-fit)
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = framesRef.current[frameIndex];

    if (!canvas || !ctx || !img || !img.complete) return;

    // Calculate cover-fit dimensions
    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const scale = Math.max(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const drawX = (canvasW - drawW) / 2;
    const drawY = (canvasH - drawH) / 2;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Set up canvas sizing + GSAP ScrollTrigger
  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Size canvas to screen
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(0); // redraw current frame after resize
    };
    resize();
    window.addEventListener('resize', resize);

    // Draw the first frame immediately
    drawFrame(0);

    let ctx = gsap.context(() => {
      // Initial setup for the intro elements
      gsap.set('.intro-element', { opacity: 0, y: 40, filter: 'blur(12px)' });
      let introVisible = false;

      // GSAP scroll-driven animation for the canvas sequence
      const frameObj = { frame: 0 };
      gsap.to(frameObj, {
        frame: frameCount - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${scrollSpan * 100}vh`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
        onUpdate: () => {
          const currentFrame = Math.round(frameObj.frame);
          drawFrame(currentFrame);

          // --- ORGANIC AUDIO FILTER LOGIC ---
          // Start the background track ONLY when the user starts scrolling
          if (currentFrame > 0 && !cinematicAudio?.hasBgTrackStarted) {
            cinematicAudio?.playBackgroundTrack();
          }

          // Map the scroll progress (0.0 to 1.0) and send it to the audio engine
          // This dynamically opens the Lowpass filter on the MP3 track to make it sound
          // like the lotus is emerging from deep underwater into crystal clear air.
          const progress = Math.max(0, Math.min(1, currentFrame / frameCount));
          cinematicAudio?.setLotusProgress(progress);

          // Frame-triggered gorgeous GSAP Timeline
          if (currentFrame >= 190 && !introVisible) {
            introVisible = true;
            // Sound removed by user request
            gsap.to('.intro-element', {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.4,
              stagger: 0.2, // Cascades the text lines in one by one
              ease: 'expo.out',
              overwrite: 'auto',
            });
          } else if (currentFrame < 190 && introVisible) {
            introVisible = false;
            gsap.to('.intro-element', {
              opacity: 0,
              y: 40,
              filter: 'blur(12px)',
              duration: 0.8,
              stagger: 0.05,
              ease: 'power2.inOut',
              overwrite: 'auto',
            });
          }
        },
      });
    }, container);

    return () => {
      window.removeEventListener('resize', resize);
      ctx.revert();
    };
  }, [isLoaded, frameCount, scrollSpan, drawFrame]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black">
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="mt-4 text-[11px] font-mono tracking-widest text-white/40 uppercase">
            Loading {loadProgress}%
          </span>
        </div>
      )}

      {/* The canvas where frames are drawn */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Watermark Obfuscator - Hides the KlingAI logo seamlessly */}
      <div 
        className="absolute bottom-0 right-0 w-[450px] h-[180px] pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 80%)' }}
      />

      {/* Film grain overlay for premium feel */}
      <div
        className="absolute inset-0 w-full h-full opacity-[0.12] mix-blend-overlay pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Overlay Content (Pinned with the canvas) */}
      {children && (
        <div 
          ref={childrenRef} 
          className={`absolute inset-0 w-full h-full z-20 transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
