import { motion, AnimatePresence } from 'framer-motion';
import { Property, SystemStatus } from '@/lib/types';
import StatusBadge from './StatusBadge';
import { X, Thermometer, Flame, Zap, ShieldCheck, Droplets, Lock, Wifi, Wind } from 'lucide-react';

interface PropertyDrawerProps {
  property: Property | null;
  onClose: () => void;
}

interface SystemBreakdown {
  name: string;
  icon: React.ElementType;
  status: SystemStatus;
  detail: string;
  load: number;
}

function generateSystems(prop: Property): SystemBreakdown[] {
  const systems: SystemBreakdown[] = [
    { name: 'HVAC', icon: Thermometer, status: 'safe', detail: '72°F avg · All zones nominal', load: 62 },
    { name: 'Fire Safety', icon: Flame, status: 'safe', detail: 'All panels reporting · Last test 2h ago', load: 8 },
    { name: 'Electrical', icon: Zap, status: 'safe', detail: 'Load balanced · Peak 44kW', load: 44 },
    { name: 'Security', icon: ShieldCheck, status: 'safe', detail: 'All cameras online · No breaches', load: 31 },
    { name: 'Plumbing', icon: Droplets, status: 'safe', detail: 'Pressure nominal · No leaks', load: 18 },
    { name: 'Access Control', icon: Lock, status: 'safe', detail: '142 locks synced · Firmware current', load: 12 },
    { name: 'Network', icon: Wifi, status: 'safe', detail: '1.2Gbps throughput · 0.1% packet loss', load: 55 },
    { name: 'Ventilation', icon: Wind, status: 'safe', detail: 'Air quality index: 42 (Good)', load: 38 },
  ];

  // Simulate issues based on property status
  if (prop.status === 'warning') {
    systems[0].status = 'warning';
    systems[0].detail = '78°F Zone 3 — +4.2°F deviation';
    systems[0].load = 89;
  }
  if (prop.status === 'critical') {
    systems[1].status = 'critical';
    systems[1].detail = 'Pressure drop Wing B — Dispatch active';
    systems[1].load = 95;
    systems[2].status = 'warning';
    systems[2].detail = 'Panel thermal warning — 187°F';
    systems[2].load = 92;
  }

  return systems;
}

export default function PropertyDrawer({ property, onClose }: PropertyDrawerProps) {
  return (
    <AnimatePresence>
      {property && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-card shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur px-5 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <StatusBadge status={property.status} pulse={property.status !== 'safe'} />
                  <div>
                    <h2 className="text-base font-bold text-foreground leading-tight">{property.name}</h2>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                      {property.city}, {property.state} · {property.lastCheckin}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-2 gap-3 px-5 pt-5">
              {[
                { label: 'ACTIVE SYSTEMS', value: `${property.activeSystems}/${property.totalSystems}`, color: property.activeSystems === property.totalSystems ? 'text-safe' : 'text-warning' },
                { label: 'STATUS', value: property.status.toUpperCase(), color: property.status === 'safe' ? 'text-safe' : property.status === 'warning' ? 'text-warning' : 'text-critical' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{s.label}</span>
                  <p className={`font-mono text-lg font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                </motion.div>
              ))}
            </div>

            {/* System Breakdown */}
            <div className="px-5 pt-5 pb-6 space-y-3">
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">SYSTEM BREAKDOWN</span>

              <div className="space-y-2">
                {generateSystems(property).map((sys, i) => (
                  <motion.div
                    key={sys.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className="rounded-lg border border-border bg-secondary/20 p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <sys.icon className={`h-3.5 w-3.5 ${
                          sys.status === 'safe' ? 'text-safe' : sys.status === 'warning' ? 'text-warning' : 'text-critical'
                        }`} />
                        <span className="text-sm font-medium text-foreground">{sys.name}</span>
                      </div>
                      <StatusBadge status={sys.status} />
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground mb-2">{sys.detail}</p>
                    {/* Load bar */}
                    <div className="h-1.5 w-full rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sys.load}%` }}
                        transition={{ delay: 0.3 + i * 0.04, duration: 0.6, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          sys.status === 'safe' ? 'bg-safe' : sys.status === 'warning' ? 'bg-warning' : 'bg-critical'
                        }`}
                      />
                    </div>
                    <p className="font-mono text-[9px] text-muted-foreground mt-1 text-right">{sys.load}% LOAD</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
