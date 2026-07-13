'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinematicAudio } from '@/utils/audio';
import { projects } from '@/content/portfolio-data';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerText = "Projects";

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
        isReducedMotion: '(prefers-reduced-motion: reduce)'
      },
      (context) => {
        const { isDesktop, isReducedMotion } = context.conditions as {
          isDesktop: boolean;
          isReducedMotion: boolean;
        };

        if (isDesktop && !isReducedMotion && sectionRef.current) {
          const cards = gsap.utils.toArray('.project-card') as HTMLElement[];
          
          cards.forEach((card, index) => {
            // We don't animate the last card scaling down
            if (index === cards.length - 1) return;

            let lastProgress = 0;
            // Animate the current card fading/shrinking ONLY when the NEXT card starts sliding up
            gsap.to(card, {
              scale: 0.92,
              opacity: 0.4,
              filter: 'blur(10px)', // Adds a cinematic depth-of-field effect
              ease: "none",
              scrollTrigger: {
                trigger: cards[index + 1], // Trigger based on the NEXT card
                start: "top bottom", // Starts exactly when the next card enters the bottom of the screen
                end: "top 120px", // Ends exactly when the next card reaches the sticky position
                scrub: true,
                onUpdate: (self) => {
                  const currentProgress = self.progress;
                  // Play a tick sound every 3% of scroll progress
                  if (Math.abs(currentProgress - lastProgress) >= 0.03) {
                    cinematicAudio?.playDigitalCrownTick();
                    lastProgress = currentProgress;
                  }
                }
              }
            });
          });

          // Cinematic Audio Triggers for sticky locking
          cards.forEach((card) => {
            ScrollTrigger.create({
              trigger: card,
              start: "top 120px",
              onEnter: () => cinematicAudio?.playCardLock(),
            });
          });
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
      
      {/* FULL-WIDTH HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
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
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
          <motion.span variants={letterVariants} className="text-accent inline-block" aria-hidden="true">.</motion.span>
        </motion.h2>
      </div>

      {/* STACKING CARDS */}
      <div className="flex flex-col relative w-full gap-8 md:gap-0 pb-[15vh]">
        {projects.map((project, idx) => (
          <div 
            key={idx} 
            className={`project-card sticky top-[120px] w-full min-h-[60vh] md:min-h-[70vh] rounded-3xl bg-[#0a0a0a] border border-[#222] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-8 md:p-12 flex flex-col justify-between overflow-hidden group mb-8 ${idx === projects.length - 1 ? 'md:mb-0' : 'md:mb-[50vh]'}`}
            style={{ zIndex: idx }}
          >
            {/* Top Section: Title and Tech */}
            <div className="flex flex-col gap-6">
              <h3 className="font-syne text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] font-bold text-foreground group-hover:text-accent transition-colors duration-500 uppercase max-w-4xl">
                {project.title}
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {project.stack.map((tech, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="font-nunito text-[14px] md:text-[16px] tracking-wide text-[#b0b0b0] border border-[#333] px-4 py-2 rounded-full uppercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Section: Bullets and Link */}
            <div className="flex flex-col gap-8 mt-12 md:mt-24">
              <ul className="flex flex-col gap-6 max-w-3xl">
                {project.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="font-nunito text-[18px] md:text-[22px] font-light text-[#b0b0b0] relative pl-6">
                    <span className="absolute left-0 top-3 w-2 h-2 bg-accent rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    {bullet}
                  </li>
                ))}
              </ul>
              
              {project.link && (
                <div className="pt-8 border-t border-[#222]">
                  <a 
                    href={project.link === 'PLACEHOLDER_URL' ? '#' : project.link}
                    className="inline-flex items-center gap-4 font-syne text-[18px] md:text-[20px] text-foreground hover:text-accent transition-colors duration-300 font-bold uppercase tracking-wider"
                  >
                    View Project
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
