'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experience } from '@/content/portfolio-data';
import { cinematicAudio } from '@/utils/audio';

interface JobExperience {
  role: string;
  company: string;
  date: string;
  bullets: string[];
}

function ExperienceRow({ job }: { job: JobExperience }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      layout
      onMouseEnter={() => { 
        setIsHovered(true); 
        cinematicAudio?.playAccordionExpand(); 
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        cinematicAudio?.playAccordionClose();
      }}
      className="interactive-sound group relative border-b border-hairline py-8 md:py-12 px-6 md:px-10 -mx-6 md:-mx-10 cursor-pointer overflow-hidden transition-colors duration-500 hover:bg-surface/30 hover:rounded-3xl hover:border-transparent"
    >
      <div className="flex flex-col w-full">
        {/* Title Container */}
        <motion.div layout className="w-full flex items-center justify-between">
          <motion.h3 
            layout
            className={`font-syne font-bold uppercase transition-all duration-500 ease-[0.16,1,0.3,1] ${
              isHovered 
                ? 'text-[28px] md:text-[32px] lg:text-[40px] text-accent' 
                : 'text-[32px] md:text-[48px] lg:text-[56px] text-foreground'
            }`}
          >
            {job.role}
          </motion.h3>
          
          {/* Premium Plus/Minus Indicator */}
          <motion.div 
            layout
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-[#333] group-hover:border-accent group-hover:bg-accent/10 transition-colors duration-500"
          >
            <motion.svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              animate={{ rotate: isHovered ? 135 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="text-[#888] group-hover:text-accent transition-colors duration-500"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Content container - Desktop Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block overflow-hidden"
            >
              <div className="pt-10 pb-4 grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Column 1: Date & Company */}
                <div className="col-span-1 md:col-span-4 flex flex-col gap-2">
                  <span className="label-caps text-accent">{job.date}</span>
                  <p className="body-lg text-foreground font-bold mt-1">{job.company}</p>
                </div>
                
                {/* Column 2: Bullets */}
                <div className="col-span-1 md:col-span-8">
                  <ul className="flex flex-col gap-5 list-none p-0 m-0">
                    {job.bullets.map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="font-nunito text-[16px] leading-[1.6] text-[#b0b0b0] border-l border-accent/30 pl-6 group-hover:border-accent transition-colors duration-500">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile View - Always expanded, hidden on desktop */}
        <div className="block md:hidden mt-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="label-caps text-accent">{job.date}</span>
              <p className="body-lg text-foreground font-bold">{job.company}</p>
            </div>
            
            <ul className="flex flex-col gap-4 list-none p-0 m-0">
              {job.bullets.map((bullet: string, bIdx: number) => (
                <li key={bIdx} className="font-nunito text-[16px] leading-[1.6] text-[#b0b0b0] border-l border-accent/50 pl-4">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const headerText = "Experience";
  
  // Animation variants for cascading letters
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };
  
  const letterVariants: any = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="experience" className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-16 gap-6">
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
      
      <div className="flex flex-col border-t border-hairline">
        {experience.map((job, idx) => (
          <ExperienceRow key={idx} job={job} />
        ))}
      </div>
    </section>
  );
}
