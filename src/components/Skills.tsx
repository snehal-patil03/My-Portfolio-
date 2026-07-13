'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinematicAudio } from '@/utils/audio';
import { skillCategories } from '@/content/portfolio-data';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const headerText = "Skills";

  // Animation variants for cascading letters
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isReducedMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, isReducedMotion } = context.conditions as {
          isDesktop: boolean;
          isReducedMotion: boolean;
        };

        if (isDesktop && !isReducedMotion && sectionRef.current && trackRef.current) {
          const cards = gsap.utils.toArray(trackRef.current.children) as HTMLElement[];
          
          if (cards.length > 0) {
            const getViewportWidth = () => trackRef.current?.parentElement?.offsetWidth || document.documentElement.clientWidth;
            const getMaxScroll = () => Math.max(0, trackRef.current!.scrollWidth - getViewportWidth() + 100); // 100px buffer
            const getScrollAmount = () => -getMaxScroll();
            
            let lastProgress = 0;
            gsap.to(trackRef.current, {
              x: getScrollAmount,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1, // Smooth scrub
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  const currentProgress = self.progress;
                  // Play a tick sound every 1.5% of scroll progress
                  if (Math.abs(currentProgress - lastProgress) >= 0.015) {
                    cinematicAudio?.playDigitalCrownTick();
                    lastProgress = currentProgress;
                  }
                }
              },
            });
          }
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="w-full h-[250vh] relative bg-background z-20">
      
      {/* STICKY FULL-SCREEN CONTAINER */}
      <div className="w-full h-screen sticky top-0 flex flex-col overflow-hidden py-16 md:py-24">
        
        {/* FULL-WIDTH HEADER */}
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6 flex-shrink-0">
          <motion.h2 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="font-syne text-[40px] md:text-[52px] lg:text-[64px] font-bold tracking-tight text-[#f0f0f0] uppercase flex overflow-hidden"
            aria-label={headerText}
          >
            {headerText.split('').map((char, index) => (
              <motion.span key={index} variants={letterVariants} className="inline-block" aria-hidden="true">
                {char}
              </motion.span>
            ))}
            <motion.span variants={letterVariants} className="text-accent inline-block" aria-hidden="true">.</motion.span>
          </motion.h2>
        </div>

        {/* HORIZONTAL SCROLL TRACK - Centered in remaining space */}
        <div className="w-full overflow-hidden flex items-center relative flex-1 min-h-0">
          <div 
            ref={trackRef} 
            className="flex w-max gap-8 px-6 sm:px-8 md:px-[15vw] items-center h-full"
          >
            {skillCategories.map((category, idx) => (
              <motion.div 
                key={idx} 
                className="w-[85vw] sm:w-[400px] md:w-[450px] lg:w-[500px] flex-shrink-0 rounded-3xl bg-[#0a0a0a] border border-[#222] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-8 md:p-12 flex flex-col h-[50vh] max-h-[500px] min-h-[350px] group transition-colors duration-500 hover:border-[#444]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "1000px" }}
                onViewportEnter={() => cinematicAudio?.playSoftSwipe()}
                transition={{ duration: 0.6, delay: 0.2 + (Math.min(idx * 0.1, 0.3)) }}
              >
                <h3 className="font-syne text-[28px] md:text-[36px] leading-[1.1] font-bold text-foreground group-hover:text-accent transition-colors duration-500 mb-8 border-b border-[#222] pb-6">
                  {category.label}
                </h3>
                
                <div className="flex flex-wrap gap-3 overflow-y-auto pr-2">
                  {category.items.map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="font-nunito text-[14px] md:text-[16px] tracking-wide text-[#b0b0b0] border border-[#333] px-4 py-2 rounded-full uppercase transition-colors group-hover:border-[#555] group-hover:text-[#fff]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
