interface ProjectSectionProps {
  title?: string;
  titleLines?: string[];
  bgColor?: string;
  textColor?: string;
  currentView: number;
  totalViews: number;
}

export function ProjectSection({ 
  title, 
  titleLines,
  bgColor = '#4b49ff',
  textColor = 'white',
  currentView, 
  totalViews 
}: ProjectSectionProps) {
  return (
    <div className="relative size-full" style={{ backgroundColor: bgColor }}>
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(${textColor} 1px, transparent 1px), linear-gradient(90deg, ${textColor} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} 
        />
      </div>

      {/* Main title */}
      {titleLines ? (
        <div 
          className="absolute font-['Geologica',sans-serif] font-medium leading-[0] left-[160px] not-italic text-[128px] top-[calc(50%-102.5px)] w-[1200px]" 
          style={{ 
            fontVariationSettings: "'CRSV' 0, 'SHRP' 0",
            color: textColor 
          }}
        >
          <p className="leading-[normal] mb-0">{titleLines[0]}</p>
          <p className="leading-[normal]">{titleLines[1]}</p>
        </div>
      ) : (
        <p 
          className="absolute font-['Geologica',sans-serif] font-medium leading-[normal] left-[160px] not-italic text-[128px] top-[calc(50%-102.5px)] w-[1200px]" 
          style={{ 
            fontVariationSettings: "'CRSV' 0, 'SHRP' 0",
            color: textColor 
          }}
        >
          {title}
        </p>
      )}

      {/* View indicator for horizontal slides */}
      {totalViews > 1 && (
        <div 
          className="absolute top-[160px] left-[160px] px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium"
          style={{ 
            backgroundColor: `${textColor === 'white' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            color: textColor 
          }}
        >
          View {currentView} of {totalViews}
        </div>
      )}

      {/* Placeholder content area - can be customized later */}
      <div className="absolute bottom-[160px] left-[160px] right-[160px]">
        <p 
          className="text-lg opacity-60 font-['Geologica',sans-serif]"
          style={{ color: textColor }}
        >
          Add your project content here...
        </p>
      </div>
    </div>
  );
}