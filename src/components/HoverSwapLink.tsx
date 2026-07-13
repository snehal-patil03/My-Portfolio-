'use client';

import { motion } from 'framer-motion';

interface HoverSwapLinkProps {
  href: string;
  defaultText: string;
  hoverText?: string;
  className?: string;
}

export default function HoverSwapLink({ href, defaultText, hoverText, className = '' }: HoverSwapLinkProps) {
  const alternateText = hoverText || defaultText;

  return (
    <a
      href={href}
      className={`relative inline-block overflow-hidden group cursor-pointer ${className}`}
    >
      {/* 200% height container that shifts up by 50% on hover */}
      <div className="flex flex-col h-[200%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2">
        <span className="block h-1/2 flex items-center justify-center leading-none">{defaultText}</span>
        <span className="block h-1/2 flex items-center justify-center leading-none text-accent">{alternateText}</span>
      </div>
    </a>
  );
}
