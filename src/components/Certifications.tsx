'use client';

import { motion } from 'framer-motion';
import { certifications } from '@/content/portfolio-data';
import { cinematicAudio } from '@/utils/audio';

export default function Certifications() {
  const headerText = "Certifications";

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

  return (
    <section id="certifications" className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
      {/* FULL-WIDTH HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-16 gap-6">
        <motion.h2 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="font-syne text-[40px] md:text-[52px] lg:text-[64px] font-bold tracking-tight text-[#f0f0f0] uppercase flex flex-wrap overflow-hidden"
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {certifications.map((cert, idx) => {
          const { title, details, file } = cert as { title: string, details: string, file: string };

          return (
            <motion.a 
              key={idx} 
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              layout
              className="relative overflow-hidden flex flex-col items-start gap-6 bg-[#0a0a0a] rounded-3xl border border-[#222] p-8 md:p-10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] hover:border-[#555] transition-colors duration-500 group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => cinematicAudio?.playCertHover()}
              onMouseLeave={() => cinematicAudio?.playCertUnhover()}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <div className="flex items-start gap-6 relative z-10 w-full">
                {/* Glowing Checkmark */}
                <div className="mt-1 flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-accent blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-125 group-hover:scale-150"></div>
                  <svg className="relative text-accent transition-transform duration-500 group-hover:scale-110" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
                    <path d="M8 12.5L11 15.5L16 9.5" className="group-hover:stroke-[2px] transition-all duration-300" />
                  </svg>
                </div>
                
                <div className="flex flex-col w-full">
                  {/* Primary Title */}
                  <h3 className="font-syne text-[20px] md:text-[24px] font-bold text-[#e0e0e0] group-hover:text-white transition-colors duration-300 leading-tight">
                    {title}
                  </h3>
                  
                  {/* Hover Reveal Details (CSS Grid animation trick) */}
                  {details && (
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <div className="overflow-hidden">
                        <div className="pt-4 mt-4 border-t border-[#333] group-hover:border-[#555] transition-colors duration-500">
                          <p className="font-nunito text-[15px] md:text-[17px] text-[#a0a0a0] leading-relaxed transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                            {details}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
