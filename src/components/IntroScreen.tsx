'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cinematicAudio } from '@/utils/audio';

export default function IntroScreen() {
  const [isEntered, setIsEntered] = useState(false);

  const handleEnter = () => {
    // 1. Initialize the Cinematic Audio Engine
    if (cinematicAudio) {
      cinematicAudio.init();
      cinematicAudio.playWaterDroplet(); // Premium, multi-layered organic droplet
    }
    
    // 2. Remove the overlay
    setIsEntered(true);
  };

  return (
    <AnimatePresence>
      {!isEntered && (
        <motion.div 
          className="fixed inset-0 z-[9999] bg-[#050505]/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          initial={{ opacity: 1, backdropFilter: "blur(24px)" }}
          exit={{ 
            opacity: 0, 
            backdropFilter: "blur(0px)",
            transition: { duration: 2.5, ease: [0.16, 1, 0.3, 1] } 
          }}
        >
          
          <motion.div
            initial="hidden"
            animate="visible"
            exit={{ 
              opacity: 0, 
              y: -30,
              scale: 0.95,
              filter: "blur(8px)",
              transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } 
            }}
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
              hidden: {}
            }}
            className="flex flex-col items-center gap-12"
          >
            <div className="text-center overflow-hidden">
              <motion.h1 
                className="font-syne text-[32px] md:text-[48px] font-bold text-white uppercase tracking-[0.2em] mb-4 flex justify-center"
              >
                {"Snehal Patil".split('').map((char, index) => (
                  <motion.span 
                    key={index} 
                    variants={{
                      hidden: { opacity: 0, y: 40, rotateX: -90 },
                      visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    className="inline-block origin-bottom"
                    style={{ whiteSpace: 'pre' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
              
              <motion.p 
                variants={{
                  hidden: { opacity: 0, filter: "blur(10px)" },
                  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 1.5, ease: "easeOut" } }
                }}
                className="font-nunito text-[#888] tracking-widest text-sm uppercase"
              >
                Cinematic Portfolio Experience
              </motion.p>
            </div>

            <motion.button
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
              }}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={handleEnter}
              className="relative px-12 py-5 rounded-full overflow-hidden border border-[#444]"
            >
              {/* Expanding Circular Fill */}
              <motion.div 
                className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-accent rounded-full pointer-events-none"
                variants={{
                  initial: { scale: 0, opacity: 0, x: "-50%", y: "-50%" },
                  hover: { scale: 1, opacity: 1, x: "-50%", y: "-50%", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                  tap: { scale: 0.95, x: "-50%", y: "-50%" }
                }}
              />
              
              <motion.span 
                className="relative z-10 font-syne font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center"
                variants={{
                  initial: { color: "#ffffff", letterSpacing: "0.2em" },
                  hover: { color: "#000000", letterSpacing: "0.25em", transition: { duration: 0.4, ease: "easeOut" } }
                }}
              >
                Enter Experience
              </motion.span>
            </motion.button>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 2, delay: 1 } }
              }}
              className="font-nunito text-[#555] text-xs max-w-xs text-center leading-relaxed"
            >
              For the best experience, please turn up your volume or use headphones.
            </motion.p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
