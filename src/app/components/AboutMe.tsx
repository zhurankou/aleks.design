import { motion } from 'motion/react';
import { X } from 'lucide-react';
import imgShutterstock150664154V22109X14061 from "figma:asset/b226069e98c9e23c617a947f327f0adae7dd6335.png";

interface AboutMeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutMe({ isOpen, onClose }: AboutMeProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-white z-50 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="Belarus cityscape" className="absolute min-w-full min-h-full object-cover" style={{ top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 'max(100%, 150vh)', height: 'auto' }} src={imgShutterstock150664154V22109X14061} />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute p-4 hover:bg-white/10 rounded-full transition-colors z-20"
        style={{ right: 'clamp(20px, 5vw, 80px)', top: 'clamp(20px, 5vw, 80px)' }}
        aria-label="Close"
      >
        <X size={32} className="text-white" />
      </button>

      {/* Text Content */}
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col font-['Geologica',sans-serif] font-medium items-start leading-[normal] not-italic text-white z-10"
        style={{ left: 'clamp(20px, 8vw, 160px)', top: 'calc(50% + clamp(120px, 28vh, 378px))', width: 'min(800px, 85vw)' }}>
        <p className="min-w-full relative shrink-0 w-[min-content]" style={{ fontSize: 'clamp(40px, 9vw, 96px)', fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Belarus
        </p>
        <p className="relative shrink-0 whitespace-nowrap" style={{ fontSize: 'clamp(24px, 6vw, 64px)', fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Born and raised
        </p>
      </div>
    </motion.div>
  );
}