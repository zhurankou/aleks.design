import { useState, useEffect } from 'react';

export function ContactPage() {
  return (
    <div className="bg-[#0f0f0f] relative size-full">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} 
        />
      </div>

      <div
        className="absolute font-['Geologica',sans-serif] font-medium leading-[0] not-italic text-white"
        style={{ fontSize: 'clamp(40px, min(8.33vw, 14vh), 128px)', left: 'clamp(20px, 8vw, 160px)', top: 'calc(50% - clamp(40px, 8vh, 102px))', width: 'min(1200px, 90vw)', fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
      >
        <p className="leading-[normal] mb-0">Let's</p>
        <p className="leading-[normal]">Get in Touch!</p>
      </div>
    </div>
  );
}