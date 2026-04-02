import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  canGoUp: boolean;
  canGoDown: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

export function NavigationButtons({
  canGoUp,
  canGoDown,
  canGoPrev,
  canGoNext,
  onNavigateUp,
  onNavigateDown,
  onNavigatePrev,
  onNavigateNext,
}: NavigationButtonsProps) {
  return (
    <>
      {/* Vertical navigation - Right side */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        <button
          onClick={onNavigateUp}
          disabled={!canGoUp}
          className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
            canGoUp
              ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer hover:scale-110'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
          aria-label="Navigate up"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <button
          onClick={onNavigateDown}
          disabled={!canGoDown}
          className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
            canGoDown
              ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer hover:scale-110'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
          aria-label="Navigate down"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>

      {/* Horizontal navigation - Bottom */}
      <div className="fixed bottom-8 right-8 z-50 flex gap-4">
        <button
          onClick={onNavigatePrev}
          disabled={!canGoPrev}
          className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
            canGoPrev
              ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer hover:scale-110'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
          aria-label="Previous view"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNavigateNext}
          disabled={!canGoNext}
          className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
            canGoNext
              ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer hover:scale-110'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
          aria-label="Next view"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="fixed top-8 right-8 z-50 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-white/80 text-sm hidden md:block">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↑</kbd>
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↓</kbd>
            <span>Navigate sections</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">←</kbd>
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">→</kbd>
            <span>Navigate views</span>
          </div>
        </div>
      </div>
    </>
  );
}
