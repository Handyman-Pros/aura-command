import { useState } from 'react';
import { motion } from 'framer-motion';
import { RegionHealth, Property } from '@/lib/types';
import StatusBadge from './StatusBadge';
import PropertyDrawer from './PropertyDrawer';
import { ArrowLeft, Shield, AlertTriangle, Building2, Activity, ChevronRight } from 'lucide-react';

interface RegionDetailProps {
  region: RegionHealth;
  properties: Property[];
  onBack: () => void;
}

export default function RegionDetail({ region, properties, onBack }: RegionDetailProps) {
  const regionProperties = properties.filter(p => region.states.includes(p.state));

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </motion.button>
        <div className="flex items-center gap-2">
          <StatusBadge status={region.status} pulse={region.status !== 'safe'} />
          <h2 className="text-lg font-bold tracking-tight text-foreground">{region.region}</h2>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider ml-auto">
          {region.states.join(' · ')}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'UPTIME', value: `${region.uptime}%`, icon: Shield, color: region.uptime > 99 ? 'text-safe' : 'text-warning' },
          { label: 'ALERTS', value: String(region.activeAlerts), icon: AlertTriangle, color: region.activeAlerts === 0 ? 'text-safe' : 'text-critical' },
          { label: 'PROPERTIES', value: String(region.propertiesCount), icon: Building2, color: 'text-primary' },
          { label: 'SYSTEMS', value: String(regionProperties.reduce((s, p) => s + p.totalSystems, 0)), icon: Activity, color: 'text-primary' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-lg border border-border bg-card p-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{stat.label}</span>
              <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
            </div>
            <p className="font-mono text-xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Properties list */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-2.5">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest">PROPERTY STATUS</span>
        </div>
        <div className="divide-y divide-border">
          {regionProperties.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-xs text-muted-foreground">No properties in this region</p>
            </div>
          ) : (
            regionProperties.map((prop, i) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={prop.status} pulse={prop.status !== 'safe'} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{prop.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{prop.city}, {prop.state} · Last check-in: {prop.lastCheckin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className={`font-mono text-xs ${prop.status === 'safe' ? 'text-safe' : prop.status === 'warning' ? 'text-warning' : 'text-critical'}`}>
                      {prop.activeSystems}/{prop.totalSystems}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground">SYSTEMS</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-foreground">{prop.lastCheckin}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">CHECKIN</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
