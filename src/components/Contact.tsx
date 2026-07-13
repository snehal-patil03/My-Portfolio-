'use client';

import { motion } from 'framer-motion';
import { profile } from '@/content/portfolio-data';
import Magnetic from './Magnetic';
import { cinematicAudio } from '@/utils/audio';

export default function Contact() {


  return (
    <section id="contact" className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
      


      <div style={{ perspective: '1000px' }}>
        <motion.div 
          className="flex flex-col items-center text-center gap-10 bg-[#0a0a0a] rounded-3xl border border-[#222] p-12 md:p-24 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] group hover:border-[#333] transition-colors duration-500 origin-bottom"
          initial={{ opacity: 0, scale: 0.85, y: 150, rotateX: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "0px" }}
          onViewportEnter={() => cinematicAudio?.playContactReveal()}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
        <div className="flex flex-col gap-4">
          <h2 className="font-syne text-[36px] md:text-[48px] font-bold tracking-tight text-[#f0f0f0] uppercase">
            Get In Touch<span className="text-accent">.</span>
          </h2>
          <p className="font-nunito text-[18px] md:text-[22px] text-[#e0e0e0] max-w-2xl mx-auto leading-relaxed">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4 w-full">
          <Magnetic>
            <a 
              href={`mailto:${profile.email}`} 
              onClick={() => cinematicAudio?.playButtonClick()}
              className="flex-1 sm:flex-none rounded-full bg-[#f0f0f0] text-[#050505] px-12 py-5 font-syne font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors duration-300 text-center"
            >
              Say Hello
            </a>
          </Magnetic>
          <Magnetic>
            <a 
              href="/resume.pdf" 
              target="_blank"
              onClick={() => cinematicAudio?.playButtonClick()}
              className="flex-1 sm:flex-none rounded-full border border-[#444] px-12 py-5 font-syne font-bold uppercase tracking-widest hover:border-[#f0f0f0] hover:bg-[#111] transition-colors duration-300 text-center text-[#e0e0e0]"
            >
              Download Resume
            </a>
          </Magnetic>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-8 md:gap-12 mt-12 pt-12 border-t border-[#222] w-full group-hover:border-[#333] transition-colors duration-500">
          <Magnetic>
            <a 
              href={`tel:${profile.phone.replace(/\s+/g, '')}`}
              onClick={() => cinematicAudio?.playButtonClick()}
              className="font-syne font-bold uppercase tracking-widest text-sm text-[#888] hover:text-accent transition-colors"
            >
              {profile.phone}
            </a>
          </Magnetic>
          <Magnetic>
            <a 
              href={`mailto:${profile.email}`}
              onClick={() => cinematicAudio?.playButtonClick()}
              className="font-syne font-bold uppercase tracking-widest text-sm text-[#888] hover:text-accent transition-colors"
            >
              {profile.email}
            </a>
          </Magnetic>
          <Magnetic>
            <a 
              href={profile.links.linkedin === 'PLACEHOLDER_URL' ? '#' : profile.links.linkedin}
              target={profile.links.linkedin === 'PLACEHOLDER_URL' ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={() => cinematicAudio?.playButtonClick()}
              className="font-syne font-bold uppercase tracking-widest text-sm text-[#888] hover:text-accent transition-colors"
            >
              LINKEDIN
            </a>
          </Magnetic>
          <Magnetic>
            <a 
              href={profile.links.github === 'PLACEHOLDER_URL' ? '#' : profile.links.github}
              target={profile.links.github === 'PLACEHOLDER_URL' ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={() => cinematicAudio?.playButtonClick()}
              className="font-syne font-bold uppercase tracking-widest text-sm text-[#888] hover:text-accent transition-colors"
            >
              GITHUB
            </a>
          </Magnetic>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
