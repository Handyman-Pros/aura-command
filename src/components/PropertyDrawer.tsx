import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Property, SystemStatus, Vendor } from '@/lib/types';
import StatusBadge from './StatusBadge';
import { X, Thermometer, Flame, Zap, ShieldCheck, Droplets, Lock, Wifi, Wind, Send, CheckCircle, Star, Phone } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { mockVendors } from '@/lib/mock-data';

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
  sparkline: { value: number }[];
}

function generateSparkline(baseLoad: number, status: SystemStatus): { value: number }[] {
  const points = 20;
  const variance = status === 'critical' ? 25 : status === 'warning' ? 15 : 8;
  return Array.from({ length: points }, (_, i) => {
    const trend = status === 'critical' ? i * 1.2 : status === 'warning' ? i * 0.4 : 0;
    const noise = (Math.sin(i * 1.7) * variance * 0.6) + (Math.cos(i * 2.3) * variance * 0.4);
    return { value: Math.max(0, Math.min(100, baseLoad + noise + trend - (points * trend) / (points * 2))) };
  });
}

function generateSystems(prop: Property): SystemBreakdown[] {
  const systems: SystemBreakdown[] = [
    { name: 'HVAC', icon: Thermometer, status: 'safe', detail: '72°F avg · All zones nominal', load: 62, sparkline: [] },
    { name: 'Fire Safety', icon: Flame, status: 'safe', detail: 'All panels reporting · Last test 2h ago', load: 8, sparkline: [] },
    { name: 'Electrical', icon: Zap, status: 'safe', detail: 'Load balanced · Peak 44kW', load: 44, sparkline: [] },
    { name: 'Security', icon: ShieldCheck, status: 'safe', detail: 'All cameras online · No breaches', load: 31, sparkline: [] },
    { name: 'Plumbing', icon: Droplets, status: 'safe', detail: 'Pressure nominal · No leaks', load: 18, sparkline: [] },
    { name: 'Access Control', icon: Lock, status: 'safe', detail: '142 locks synced · Firmware current', load: 12, sparkline: [] },
    { name: 'Network', icon: Wifi, status: 'safe', detail: '1.2Gbps throughput · 0.1% packet loss', load: 55, sparkline: [] },
    { name: 'Ventilation', icon: Wind, status: 'safe', detail: 'Air quality index: 42 (Good)', load: 38, sparkline: [] },
  ];

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

  return systems.map(s => ({ ...s, sparkline: generateSparkline(s.load, s.status) }));
}

const statusColor = (status: SystemStatus) =>
  status === 'safe' ? 'hsl(152, 80%, 48%)' : status === 'warning' ? 'hsl(36, 95%, 55%)' : 'hsl(0, 85%, 55%)';

function getMatchingVendors(systemName: string, propertyState: string): Vendor[] {
  const tradeMap: Record<string, string> = {
    'HVAC': 'HVAC', 'Fire Safety': 'Fire Safety', 'Electrical': 'Electrical',
    'Security': 'Security Systems', 'Plumbing': 'Plumbing', 'Access Control': 'Security Systems',
    'Network': 'Electrical', 'Ventilation': 'HVAC',
  };
  const trade = tradeMap[systemName] || systemName;
  const vendors = mockVendors.filter(v => v.trade === trade && v.complianceStatus === 'compliant');
  // Prefer same-state vendors, then others
  return [...vendors.filter(v => v.state === propertyState), ...vendors.filter(v => v.state !== propertyState)].slice(0, 3);
}

export default function PropertyDrawer({ property, onClose }: PropertyDrawerProps) {
  const systems = useMemo(() => (property ? generateSystems(property) : []), [property]);
  const [dispatchingSystem, setDispatchingSystem] = useState<string | null>(null);
  const [dispatchedSystems, setDispatchedSystems] = useState<Record<string, string>>({});

  const handleDispatch = (systemName: string, vendor: Vendor) => {
    setDispatchedSystems(prev => ({ ...prev, [systemName]: vendor.name }));
    setDispatchingSystem(null);
  };

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
                {systems.map((sys, i) => {
                  const isDispatched = !!dispatchedSystems[sys.name];
                  const isDispatchOpen = dispatchingSystem === sys.name;
                  const canDispatch = sys.status !== 'safe' && !isDispatched;
                  const matchingVendors = isDispatchOpen ? getMatchingVendors(sys.name, property.state) : [];

                  return (
                    <motion.div
                      key={sys.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.04 }}
                      className="rounded-lg border border-border bg-secondary/20 p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <sys.icon className={`h-3.5 w-3.5 ${
                            sys.status === 'safe' ? 'text-safe' : sys.status === 'warning' ? 'text-warning' : 'text-critical'
                          }`} />
                          <span className="text-sm font-medium text-foreground">{sys.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={sys.status} />
                          {isDispatched && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-1 rounded-full bg-safe/15 px-2 py-0.5"
                            >
                              <CheckCircle className="h-3 w-3 text-safe" />
                              <span className="font-mono text-[9px] text-safe">DISPATCHED</span>
                            </motion.div>
                          )}
                          {canDispatch && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setDispatchingSystem(isDispatchOpen ? null : sys.name)}
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 border transition-colors ${
                                isDispatchOpen
                                  ? 'bg-primary/15 border-primary text-primary'
                                  : 'border-border hover:border-warning text-muted-foreground hover:text-warning'
                              }`}
                            >
                              <Send className="h-3 w-3" />
                              <span className="font-mono text-[9px]">DISPATCH</span>
                            </motion.button>
                          )}
                        </div>
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground mb-1.5">
                        {isDispatched ? `Vendor dispatched: ${dispatchedSystems[sys.name]}` : sys.detail}
                      </p>

                      {/* Vendor dispatch panel */}
                      <AnimatePresence>
                        {isDispatchOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 rounded-lg border border-border bg-card/80 p-3 space-y-2">
                              <span className="font-mono text-[9px] text-muted-foreground tracking-widest">SELECT VENDOR</span>
                              {matchingVendors.length === 0 ? (
                                <p className="font-mono text-[10px] text-muted-foreground">No compliant vendors available</p>
                              ) : (
                                matchingVendors.map(v => (
                                  <motion.button
                                    key={v.id}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => handleDispatch(sys.name, v)}
                                    className="w-full flex items-center justify-between rounded-md border border-border hover:border-primary/50 bg-secondary/30 px-3 py-2 transition-colors text-left"
                                  >
                                    <div>
                                      <p className="text-xs font-semibold text-foreground">{v.name}</p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="font-mono text-[9px] text-muted-foreground">{v.trade}</span>
                                        <span className="font-mono text-[9px] text-muted-foreground">·</span>
                                        <span className="font-mono text-[9px] text-muted-foreground">{v.state}</span>
                                        <div className="flex items-center gap-0.5">
                                          <Star className="h-2.5 w-2.5 text-warning fill-warning" />
                                          <span className="font-mono text-[9px] text-muted-foreground">{v.rating}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Phone className="h-3 w-3 text-muted-foreground" />
                                      <Send className="h-3 w-3 text-primary" />
                                    </div>
                                  </motion.button>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Sparkline */}
                      <div className="h-10 w-full mb-1.5">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={sys.sparkline} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                            <defs>
                              <linearGradient id={`grad-${sys.name}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={statusColor(sys.status)} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={statusColor(sys.status)} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <YAxis domain={[0, 100]} hide />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={statusColor(sys.status)}
                              strokeWidth={1.5}
                              fill={`url(#grad-${sys.name})`}
                              isAnimationActive
                              animationDuration={800}
                              animationEasing="ease-out"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

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
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
