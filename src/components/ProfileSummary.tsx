'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinematicAudio } from '@/utils/audio';
import { summary } from '@/content/portfolio-data';

gsap.registerPlugin(ScrollTrigger);

export default function ProfileSummary() {
  const sectionRef = useRef<HTMLElement>(null);

  // Safely extract "MCA graduate (CGPA 9.78/10)"
  const pullLine = summary.split(')')[0] + ')';
  
  // Capitalize the first letter of the remaining text
  let restOfSummary = summary.substring(pullLine.length).trim();
  if (restOfSummary.startsWith('with')) {
    restOfSummary = 'W' + restOfSummary.slice(1);
  }

  // Parse out the title and CGPA for stylized rendering
  const titleMatch = pullLine.match(/(.*)\s\((CGPA.*)\)/i);
  const title = titleMatch ? titleMatch[1].trim() : "MCA GRADUATE";
  const cgpa = titleMatch ? titleMatch[2].trim() : "CGPA 9.78/10";

  // Function to split text into words for GSAP scrubbing, while maintaining keyword highlights
  const renderText = (text: string) => {
    const keywords = [
      'Java', 'Python', 'SQL', 'MySQL', 
      'Object-Oriented Programming (OOP)', 
      'Database Management (RDBMS)', 
      'Software Development Life Cycle (SDLC)', 
      'CRUD-based', 'JDBC', 'PHP', 'HTML', 'CSS', 
      'JavaScript', 'Bootstrap', 'JSP', 'Servlets', 'React.js', 
      'Software Developer Internship'
    ];
    
    // Sort keywords by length descending so longer phrases match first
    keywords.sort((a, b) => b.length - a.length);
    
    const regex = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    
    // Split into chunks of normal text and keyword matches
    const chunks = text.split(regex);
    
    return chunks.map((chunk, i) => {
      const isKeyword = keywords.some(k => k.toLowerCase() === chunk.toLowerCase());
      
      // Split the chunk itself into words, preserving spaces
      const words = chunk.split(/(\s+)/); 
      
      return words.map((word, j) => {
        if (!word.trim()) return <span key={`space-${i}-${j}`}>{word}</span>;
        
        return (
          <span 
            key={`word-${i}-${j}`} 
            className={`scrub-word inline-block opacity-20 ${isKeyword ? 'text-foreground font-semibold' : 'text-[#606060]'}`}
            style={{ willChange: 'opacity' }}
          >
            {word}
          </span>
        );
      });
    });
  };

  const lastTickProgress = useRef(0);

  useGSAP(() => {
    gsap.to('.scrub-word', {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%', 
        end: '+=120%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          // Play a tactile digital crown tick every 1.5% of scroll progress for higher resolution haptics
          if (Math.abs(progress - lastTickProgress.current) > 0.015) {
              cinematicAudio?.playDigitalCrownTick();
              lastTickProgress.current = progress;
          }
        }
      }
    });
  }, { scope: sectionRef });

  return (
    <section id="summary" ref={sectionRef} className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24 overflow-hidden">
      <div className="w-full flex flex-col md:flex-row gap-12 lg:gap-20">
        
        {/* LEFT COLUMN: Typography */}
        <div className="md:w-5/12 lg:w-4/12 flex flex-col justify-start">
          <h2 className="font-syne text-[40px] leading-[1.1] md:text-[52px] lg:text-[64px] font-bold tracking-tight text-[#f0f0f0] uppercase">
            {title}
            <span className="text-accent">.</span>
          </h2>
        </div>

        {/* RIGHT COLUMN: Scrubbed Body Text */}
        <div className="md:w-7/12 lg:w-8/12 relative">
          {/* Subtle Accent Line separating columns on Desktop */}
          <div className="hidden md:block absolute left-[-24px] lg:left-[-40px] top-2 bottom-4 w-[1px] bg-gradient-to-b from-accent/50 to-transparent" />
          
          <p className="font-nunito text-[18px] md:text-[22px] lg:text-[26px] leading-[1.6] md:leading-[1.7] font-light">
            {renderText(restOfSummary)}
          </p>
        </div>

      </div>
    </section>
  );
}
