'use client';

import { useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { profile, credentialStats } from '@/content/portfolio-data';
import ScrollSequence from './ScrollSequence';

export default function Hero() {
  const leftContentRef = useRef<HTMLDivElement>(null);
  const credentialStripRef = useRef<HTMLDivElement>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="hero" className="relative z-0">
      
      {/* ============================================
          SCROLL-DRIVEN IMAGE SEQUENCE
          ============================================
          HOW TO USE:
          1. Drop your frames into: public/sequence/
          2. Name them: frame_001.webp, frame_002.webp, ... frame_030.webp
          3. Update frameCount below to match your total frame count.
          4. That's it! Scroll to see the magic.
          ============================================ */}
      <ScrollSequence
        frameCount={285}      /* ← 116 from Batch-1 + 169 from Batch-2 */
        format="png"          /* ← Your frames are PNG */
        scrollSpan={4}        /* ← How many screen-heights the animation takes to play (4 = 400vh) */
      >
        {/* Intro Text Overlay Container (Locked to Grid) */}
        <div className="absolute inset-0 w-full h-full max-w-7xl mx-auto pointer-events-none z-30">
          <div className="absolute top-[15%] md:top-[20%] left-6 sm:left-8 lg:left-12 max-w-[650px]">
            <h1 className="intro-element opacity-0 font-syne text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tighter text-[#f0f0f0] mb-5 leading-none">
              Hey there, <span className="text-accent">I'm Snehal.</span>
            </h1>
            <div className="intro-element opacity-0 w-12 h-[2px] bg-accent mb-6" />
            <p className="intro-element opacity-0 text-lg md:text-xl lg:text-[22px] text-[#b0b0b0] leading-relaxed font-light mb-12">
              I write <span className="text-accent font-medium">Java</span>, untangle messy problems, and build<br className="hidden md:block" />
              <span className="text-accent font-medium">clean, scalable backend</span> systems from the ground up.
            </p>

            {/* Credential Strip (Sleek & Minimal) */}
            <div className="flex flex-wrap gap-8 md:gap-12 pointer-events-auto">
              {credentialStats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="intro-element opacity-0 flex flex-col justify-center border-l-2 border-accent/40 pl-4"
                >
                  <span className="font-syne text-2xl md:text-[32px] font-bold text-accent mb-1 leading-none tracking-tight">{stat.value}</span>
                  <span className="text-[10px] md:text-[11px] font-mono tracking-[0.15em] text-[#a0a0a0] uppercase">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollSequence>

      {/* Bottom HUD bar — pinned on top of the canvas */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none hero-hud" style={{ opacity: 0 }}>
        <div className="section-container w-full flex flex-col md:flex-row justify-between items-end pb-8 gap-8">
          
          {/* Left Content (Roles & Info) */}
          <motion.div 
            ref={leftContentRef}
            className="flex flex-col gap-4 max-w-xl pointer-events-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="overflow-hidden">
              <motion.div variants={itemVariants} className="flex flex-col gap-4">
                <h2 className="text-[12px] md:text-[14px] font-mono tracking-[0.2em] text-foreground uppercase opacity-80 leading-loose">
                  <span className="text-accent font-bold">SOFTWARE ENGINEER</span> / SOFTWARE DEVELOPER / JAVA DEVELOPER / ASSOCIATE SOFTWARE ENGINEER
                </h2>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[10px] md:text-[11px] font-mono tracking-widest px-3 py-1 border border-hairline bg-background/20 backdrop-blur-md rounded-full uppercase">
                    📍 {profile.location}
                  </span>
                  <span className="text-[10px] md:text-[11px] font-mono tracking-widest text-accent uppercase">
                    🟢 {profile.availability}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
