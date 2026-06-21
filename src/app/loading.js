"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-white dark:bg-zinc-950 px-6 transition-colors duration-500 relative overflow-hidden">
      
      {/* Premium Cinematic Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[450px] h-[450px] bg-gradient-to-tr from-[#F5726B]/10 to-[#DFD0BD]/20 dark:from-[#F5726B]/5 dark:to-transparent rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[250px] h-[250px] bg-[#F5726B]/5 rounded-full blur-[40px] pointer-events-none animate-pulse" />

      {/* Main Spinner Wrapper */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        
        {/* Layer 1: Outer Pulse Web Wave */}
        <motion.div
          animate={{
            scale: [0.95, 1.15, 0.95],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full border border-[#F5726B]/20 dark:border-[#F5726B]/10 dashed"
        />

        {/* Layer 2: Fast Gradient Ring (Chasing Light Effect) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-2 rounded-full p-[3px] bg-gradient-to-r from-[#F5726B] via-[#DFD0BD]/40 to-transparent opacity-80"
        />

        {/* Layer 3: Counter-Rotating Slow Ring for Depth */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-4 rounded-full p-[1.5px] bg-gradient-to-l from-[#DFD0BD] via-transparent to-[#F5726B]/30"
        />
        
        {/* Center Card Container */}
        <div className="w-40 h-40 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md rounded-full flex flex-col items-center justify-center shadow-2xl border border-white dark:border-zinc-800/50 z-10 relative group">
          
          {/* Floating Floating Sparkle Particle */}
          <motion.div
            animate={{
              y: [-4, 4, -4],
              x: [-2, 2, -2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 text-[#DFD0BD]"
          >
            <Sparkles size={14} className="fill-current" />
          </motion.div>

          {/* Core Brand Icon with Infinite Smooth Jump & Spin */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-[#F5726B] drop-shadow-[0_4px_10px_rgba(245,114,107,0.2)]"
          >
            <UtensilsCrossed size={48} strokeWidth={1.5} />
          </motion.div>
          
          {/* Micro dots loader inside circle */}
          <div className="flex gap-1.5 absolute bottom-10">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-[#F5726B]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modern Typo Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-10 text-center space-y-2.5 relative z-20"
      >
        <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-wide font-sans">
          Cooking Up <span className="text-[#F5726B] bg-gradient-to-r from-[#F5726B] to-[#AE514B] bg-clip-text text-transparent">Something Special</span>
        </h3>
        
        <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
          <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium tracking-medium">
            Preparing your personalized feed
          </p>
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#F5726B] animate-ping" />
        </div>
      </motion.div>

    </div>
  );
}