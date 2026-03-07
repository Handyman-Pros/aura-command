import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegionHealth, Property } from '@/lib/types';
import StatusBadge from './StatusBadge';
import RegionDetail from './RegionDetail';
import { Shield, AlertTriangle, Activity } from 'lucide-react';

interface SystemHealthProps {
  regions: RegionHealth[];
  properties?: Property[];
}

export default function SystemHealth({ regions }: SystemHealthProps) {
  const totalAlerts = regions.reduce((s, r) => s + r.activeAlerts, 0);
  const avgUptime = regions.reduce((s, r) => s + r.uptime, 0) / regions.length;
  const totalProperties = regions.reduce((s, r) => s + r.propertiesCount, 0);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'UPTIME', value: `${avgUptime.toFixed(2)}%`, icon: Shield, status: avgUptime > 99 ? 'safe' : 'warning' },
          { label: 'ALERTS', value: String(totalAlerts), icon: AlertTriangle, status: totalAlerts === 0 ? 'safe' : totalAlerts > 3 ? 'critical' : 'warning' },
          { label: 'PROPERTIES', value: String(totalProperties), icon: Activity, status: 'safe' as const },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-lg border border-border bg-card p-3 ${
              item.status === 'critical' ? 'glow-critical' : item.status === 'warning' ? 'glow-warning' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{item.label}</span>
              <item.icon className={`h-3.5 w-3.5 ${
                item.status === 'safe' ? 'text-safe' : item.status === 'warning' ? 'text-warning' : 'text-critical'
              }`} />
            </div>
            <p className="font-mono text-xl font-bold text-foreground">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Region breakdown */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-2.5">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest">REGION STATUS</span>
        </div>
        <div className="divide-y divide-border">
          {regions.map((region, i) => (
            <motion.div
              key={region.region}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <StatusBadge status={region.status} pulse={region.status !== 'safe'} />
                <div>
                  <p className="text-sm font-medium text-foreground">{region.region}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{region.states.join(' · ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="font-mono text-xs text-foreground">{region.uptime}%</p>
                  <p className="font-mono text-[9px] text-muted-foreground">UPTIME</p>
                </div>
                <div>
                  <p className={`font-mono text-xs ${region.activeAlerts > 0 ? 'text-warning' : 'text-safe'}`}>{region.activeAlerts}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">ALERTS</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-foreground">{region.propertiesCount}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">SITES</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
