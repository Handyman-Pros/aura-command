import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Property } from '@/lib/types';
import StatusBadge from './StatusBadge';
import { MapPin, Search, X } from 'lucide-react';

// Simplified US map using viewport coordinates
const statePositions: Record<string, { x: number; y: number }> = {
  NY: { x: 82, y: 28 }, CA: { x: 10, y: 45 }, FL: { x: 78, y: 75 },
  CO: { x: 35, y: 40 }, AZ: { x: 22, y: 58 }, IL: { x: 62, y: 35 },
  HI: { x: 25, y: 85 }, TX: { x: 45, y: 68 }, WA: { x: 12, y: 12 },
  OR: { x: 10, y: 22 }, NV: { x: 15, y: 40 }, UT: { x: 25, y: 40 },
  MT: { x: 30, y: 15 }, GA: { x: 75, y: 60 }, MA: { x: 88, y: 25 },
};

interface MapViewProps {
  properties: Property[];
  onSelectProperty?: (p: Property) => void;
}

export default function MapView({ properties, onSelectProperty }: MapViewProps) {
  const [query, setQuery] = useState('');
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return properties.filter(p =>
      p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.state.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query, properties]);

  const handleSelect = (prop: Property) => {
    setFocusedId(prop.id);
    setQuery('');
    onSelectProperty?.(prop);
    setTimeout(() => setFocusedId(null), 3000);
  };

  return (
    <div className="relative w-full rounded-xl border border-border bg-card overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {/* Grid background */}
      <div className="absolute inset-0 surface-grid opacity-30" />
      
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan-line" />
      </div>

      {/* US outline approximation */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-10">
        <path
          d="M 8,15 L 15,10 25,8 35,10 45,8 55,10 65,12 75,15 85,20 90,25 88,35 85,45 82,55 80,65 78,72 75,78 70,75 65,70 58,72 50,70 45,68 40,65 35,58 30,55 25,50 20,48 15,42 10,35 8,25 Z"
          fill="none"
          stroke="hsl(152 80% 48%)"
          strokeWidth="0.3"
        />
      </svg>

      {/* Search bar */}
      <div className="absolute top-3 right-3 z-20 w-56">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search properties..."
            className="w-full h-8 pl-8 pr-8 rounded-lg bg-card/90 backdrop-blur border border-border text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1 rounded-lg bg-popover border border-border shadow-xl overflow-hidden"
            >
              {results.map(prop => (
                <button
                  key={prop.id}
                  onClick={() => handleSelect(prop)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground truncate">{prop.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{prop.city}, {prop.state}</p>
                  </div>
                  <StatusBadge status={prop.status} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Property pins */}
      {properties.map((prop, i) => {
        const pos = statePositions[prop.state] || { x: 50, y: 50 };
        const color = prop.status === 'safe' ? 'text-safe' : prop.status === 'warning' ? 'text-warning' : 'text-critical';
        const pulseClass = prop.status === 'safe' ? 'pulse-safe' : prop.status === 'warning' ? 'pulse-warning' : 'pulse-critical';
        const isFocused = focusedId === prop.id;

        return (
          <motion.button
            key={prop.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isFocused ? 1.8 : 1,
              opacity: 1,
            }}
            transition={isFocused ? { type: 'spring', bounce: 0.5 } : { delay: i * 0.08, type: 'spring', bounce: 0.4 }}
            onClick={() => onSelectProperty?.(prop)}
            className={`absolute group ${isFocused ? 'z-10' : ''}`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className={`relative flex h-4 w-4 items-center justify-center rounded-full ${pulseClass}`}>
              <MapPin className={`h-4 w-4 ${color} drop-shadow-lg`} />
              {isFocused && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`absolute inset-0 rounded-full border-2 ${prop.status === 'safe' ? 'border-safe' : prop.status === 'warning' ? 'border-warning' : 'border-critical'}`}
                />
              )}
            </div>
            {/* Tooltip */}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 ${isFocused ? 'block' : 'hidden group-hover:block'}`}>
              <div className="rounded-lg bg-popover border border-border px-3 py-2 shadow-xl min-w-[180px]">
                <p className="font-mono text-[10px] text-muted-foreground mb-0.5">{prop.state} · {prop.city}</p>
                <p className="text-xs font-semibold text-foreground">{prop.name}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <StatusBadge status={prop.status} pulse />
                  <span className="font-mono text-[10px] text-muted-foreground">{prop.activeSystems}/{prop.totalSystems}</span>
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-card/90 backdrop-blur px-3 py-1.5 border border-border">
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-safe" /><span className="font-mono text-[9px] text-muted-foreground">NOMINAL</span></div>
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-warning" /><span className="font-mono text-[9px] text-muted-foreground">DISPATCH</span></div>
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-critical" /><span className="font-mono text-[9px] text-muted-foreground">CRITICAL</span></div>
      </div>

      {/* Title overlay */}
      <div className="absolute top-3 left-3">
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest">GLOBAL MAP VIEW</span>
      </div>
    </div>
  );
}