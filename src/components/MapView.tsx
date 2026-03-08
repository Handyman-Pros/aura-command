import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/lib/types';
import StatusBadge from './StatusBadge';
import { Search, X } from 'lucide-react';

// Custom marker icons by status
function createIcon(status: string) {
  const color = status === 'safe' ? 'hsl(152,80%,48%)' : status === 'warning' ? 'hsl(30,95%,55%)' : 'hsl(0,72%,51%)';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z" fill="${color}" fill-opacity="0.9"/>
    <circle cx="14" cy="14" r="6" fill="white" fill-opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
}

function FlyToProperty({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 10, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

interface MapViewProps {
  properties: Property[];
  onSelectProperty?: (p: Property) => void;
}

export default function MapView({ properties, onSelectProperty }: MapViewProps) {
  const [query, setQuery] = useState('');
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return properties.filter(p =>
      p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.state.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query, properties]);

  const handleSelect = (prop: Property) => {
    setFlyTo({ lat: prop.lat, lng: prop.lng });
    setQuery('');
    onSelectProperty?.(prop);
  };

  const safeIcon = useMemo(() => createIcon('safe'), []);
  const warningIcon = useMemo(() => createIcon('warning'), []);
  const criticalIcon = useMemo(() => createIcon('critical'), []);

  const getIcon = (status: string) => {
    if (status === 'safe') return safeIcon;
    if (status === 'warning') return warningIcon;
    return criticalIcon;
  };

  return (
    <div className="relative w-full rounded-xl border border-border bg-card overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {/* Search bar */}
      <div className="absolute top-3 right-3 z-[1000] w-56">
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

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-3 rounded-lg bg-card/90 backdrop-blur px-3 py-1.5 border border-border">
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-safe" /><span className="font-mono text-[9px] text-muted-foreground">NOMINAL</span></div>
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-warning" /><span className="font-mono text-[9px] text-muted-foreground">DISPATCH</span></div>
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-critical" /><span className="font-mono text-[9px] text-muted-foreground">CRITICAL</span></div>
      </div>

      {/* Title overlay */}
      <div className="absolute top-3 left-3 z-[1000]">
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest">GLOBAL MAP VIEW</span>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[39.5, -98.35]}
        zoom={4}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
        style={{ background: 'hsl(220, 16%, 7%)' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {flyTo && <FlyToProperty lat={flyTo.lat} lng={flyTo.lng} />}
        {properties.map(prop => (
          <Marker
            key={prop.id}
            position={[prop.lat, prop.lng]}
            icon={getIcon(prop.status)}
            eventHandlers={{
              click: () => onSelectProperty?.(prop),
            }}
          >
            <Popup className="leaflet-dark-popup">
              <div className="font-mono text-[10px] text-muted-foreground">{prop.state} · {prop.city}</div>
              <div className="text-xs font-semibold">{prop.name}</div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <StatusBadge status={prop.status} pulse />
                <span className="font-mono text-[10px] text-muted-foreground">{prop.activeSystems}/{prop.totalSystems}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
