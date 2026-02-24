import React from 'react';
import { motion } from 'motion/react';
import { Sprout } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f0fdf4] bg-[radial-gradient(#46a055_1px,transparent_1px)] [background-size:20px_20px]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="bg-white p-8 rounded-full border-8 border-farm-green shadow-[0_10px_0_#2d6a36]">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sprout className="w-24 h-24 text-farm-green" strokeWidth={2.5} />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-col items-center gap-4"
      >
        <h1 className="text-2xl md:text-4xl font-display font-black text-farm-dark-green tracking-wider uppercase drop-shadow-sm text-center px-4">
          Garden Horizon
        </h1>
        
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 rounded-full bg-kahoot-blue"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
