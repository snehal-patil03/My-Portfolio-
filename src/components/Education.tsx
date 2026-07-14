'use client';

import { useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { education } from '@/content/portfolio-data';
import { cinematicAudio } from '@/utils/audio';

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headerText = "Education";

  // Animation variants for cascading letters
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };
  
  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isReducedMotion: "(prefers-reduced-motion: reduce)"
      },
      (context) => {
        const { isDesktop, isReducedMotion } = context.conditions as {
          isDesktop: boolean;
          isReducedMotion: boolean;
        };

        if (isDesktop && !isReducedMotion && trackRef.current && lineRef.current) {
          
          // 1. Draw the vertical glowing timeline line
          let lastProgress = 0;
          gsap.fromTo(lineRef.current, 
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: trackRef.current,
                start: "top 50%", // Start drawing exactly when track top hits center viewport
                end: "bottom 50%", // Finish when track bottom hits center
                scrub: true,
                onUpdate: (self) => {
                  const currentProgress = self.progress;
                  // Play a tick sound every 2% of scroll progress
                  if (Math.abs(currentProgress - lastProgress) >= 0.02) {
                    cinematicAudio?.playDigitalCrownTick();
                    lastProgress = currentProgress;
                  }
                }
              }
            }
          );

          // 2. Illuminate the dots and scrub opacity of rows
          const rows = gsap.utils.toArray('.education-row') as HTMLElement[];
          rows.forEach((row) => {
            const dot = row.querySelector('.timeline-dot');
            const content = row.querySelector('.row-content');
            
            // Scrub the opacity/blur of the content for a focused reading experience
            if (content) {
              gsap.fromTo(content,
                { opacity: 0.1, filter: 'blur(6px)' },
                {
                  opacity: 1,
                  filter: 'blur(0px)',
                  scrollTrigger: {
                    trigger: row,
                    start: "top 85%", // Fade in slower
                    end: "top 55%",   
                    scrub: true,
                  }
                }
              );
              
              // Fade back out as it scrolls past center
              gsap.fromTo(content,
                { opacity: 1, filter: 'blur(0px)' },
                {
                  opacity: 0.1,
                  filter: 'blur(6px)',
                  scrollTrigger: {
                    trigger: row,
                    start: "bottom 45%", 
                    end: "bottom 15%",    
                    scrub: true,
                  }
                }
              );
            }

            // Light up the dot perfectly in sync with the line hitting it at 50%
            if (dot) {
              gsap.fromTo(dot,
                { backgroundColor: '#1A1A1A', borderColor: '#404040', scale: 1 },
                {
                  backgroundColor: '#EB5939', 
                  borderColor: '#EB5939',
                  scale: 1.5,
                  boxShadow: "0 0 20px rgba(235, 89, 57, 0.5)",
                  scrollTrigger: {
                    trigger: row,
                    start: "center 50%", // Perfectly syncs with the line reaching the dot
                    toggleActions: "play reverse play reverse", 
                    onEnter: () => cinematicAudio?.playTimelineGlow(),
                    onEnterBack: () => cinematicAudio?.playTimelineGlow(),
                  }
                }
              );
            }
          });
        }
      }
    );

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section id="education" ref={sectionRef} className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
      {/* FULL-WIDTH HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-16 gap-6">
        <motion.h2 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
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

      {/* TIMELINE & DEGREES LIST */}
      <div className="flex flex-col relative w-full border-t border-hairline">
        
        {/* Center Timeline Track (Desktop only) */}
        <div ref={trackRef} className="absolute left-0 md:left-[30%] lg:left-[25%] top-0 bottom-0 w-[2px] bg-hairline hidden md:block" style={{ transform: 'translateX(-50%)' }}>
          <div 
            ref={lineRef} 
            className="w-full h-full bg-accent origin-top"
            style={{ transform: 'scaleY(0)', boxShadow: "0 0 15px rgba(235, 89, 57, 0.4)" }}
          />
        </div>

        {education.map((edu, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-200px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
            className="education-row relative flex flex-col md:flex-row md:items-center w-full min-h-[240px] md:min-h-[400px] py-20 md:py-32 border-b border-hairline group"
          >
            {/* Timeline Dot (Desktop only) */}
            <div 
              className="timeline-dot absolute left-0 md:left-[30%] lg:left-[25%] top-[50%] w-[16px] h-[16px] rounded-full bg-[#1A1A1A] border-[3px] border-[#404040] z-20 hidden md:block transition-all duration-300"
              style={{ transform: 'translate(-50%, -50%)' }}
            />

            <div className="row-content flex flex-col md:flex-row md:items-center w-full">
              {/* Left Column: Date & CGPA */}
              <div className="md:w-[30%] lg:w-[25%] flex flex-col justify-center md:items-end text-left md:text-right pr-0 md:pr-12 lg:pr-16 z-10 mb-6 md:mb-0">
                <span className="label-caps text-accent">{edu.years}</span>
                <span className="label-caps text-foreground opacity-50 group-hover:opacity-100 transition-opacity mt-2">CGPA {edu.cgpa}</span>
              </div>
              
              {/* Right Column: Degree & Institute */}
              <div className="md:w-[70%] lg:w-[75%] flex flex-col justify-center pl-0 md:pl-12 lg:pl-16 z-10">
                <h3 className="font-syne text-[24px] md:text-[32px] lg:text-[40px] leading-[1.1] font-bold text-foreground group-hover:text-accent transition-colors duration-500 uppercase">
                  {edu.degree}
                </h3>
                <p className="font-nunito text-[18px] md:text-[22px] font-light text-[#b0b0b0] mt-4 max-w-2xl">
                  {edu.institute}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
