import React, { useState } from 'react';
import { Sprout } from 'lucide-react';

export function Header() {
  const [imageError, setImageError] = useState(false);

  return (
    <header className="w-full p-4 flex justify-center items-center">
      <div className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300 w-full max-w-[400px]">
        {/* Logo Container */}
        <div className="bg-white/90 backdrop-blur-sm border-4 border-farm-dark-green rounded-3xl p-4 shadow-[0_8px_0_rgba(45,106,54,1)] flex items-center justify-center w-full min-h-[80px] md:min-h-[100px]">
           {!imageError ? (
             <img 
               src="/logo.png" 
               alt="Garden Horizon" 
               className="max-h-12 sm:max-h-16 md:max-h-24 object-contain"
               onError={() => setImageError(true)}
             />
           ) : (
             <div className="flex items-center gap-3 md:gap-4">
               <div className="bg-farm-green p-2 md:p-3 rounded-2xl text-white">
                 <Sprout className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" strokeWidth={3} />
               </div>
               <div className="flex flex-col">
                 <h1 className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-farm-dark-green tracking-wide uppercase drop-shadow-sm">
                   Garden Horizon
                 </h1>
                 <span className="text-farm-brown font-bold text-xs sm:text-sm md:text-lg tracking-wider uppercase">
                   Value Calculator
                 </span>
               </div>
             </div>
           )}
        </div>
      </div>
    </header>
  );
}
