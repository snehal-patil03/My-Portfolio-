'use client';

import { motion } from 'framer-motion';

export default function HairlineRule() {
  return (
    <div className="section-container flex justify-center py-2 md:py-4">
      <motion.div 
        className="w-full max-w-sm h-px bg-hairline"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
}
