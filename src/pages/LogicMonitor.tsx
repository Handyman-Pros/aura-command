import { motion, AnimatePresence } from 'framer-motion';
import { useDispatchLogs } from '@/lib/hooks';
import StatusBadge from '@/components/StatusBadge';
import { Activity, Zap, Clock, ArrowRight } from 'lucide-react';

export default function LogicMonitor() {
  const { data: logs, isLoading } = useDispatchLogs();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-14">
      <div className="container py-6 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Aura Logic Monitor</h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">AUTONOMOUS DISPATCH LOG · LIVE FEED</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 border border-warning/20">
            <Activity className="h-3 w-3 text-warning" />
            <span className="font-mono text-[10px] text-warning">{logs?.filter(l => l.status === 'processing').length || 0} PROCESSING</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'PROCESSING', count: logs?.filter(l => l.status === 'processing').length || 0, color: 'text-warning', glow: 'glow-warning' },
            { label: 'DISPATCHED', count: logs?.filter(l => l.status === 'dispatched').length || 0, color: 'text-primary', glow: '' },
            { label: 'RESOLVED', count: logs?.filter(l => l.status === 'resolved').length || 0, color: 'text-safe', glow: '' },
            { label: 'ESCALATED', count: logs?.filter(l => l.status === 'escalated').length || 0, color: 'text-critical', glow: 'glow-critical' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-lg border border-border bg-card p-3 ${stat.glow}`}
            >
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{stat.label}</span>
              <p className={`font-mono text-2xl font-bold mt-1 ${stat.color}`}>{stat.count}</p>
            </motion.div>
          ))}
        </div>

        {/* Log entries */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-4 py-2.5 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest">DISPATCH TIMELINE</span>
          </div>
          <div className="divide-y divide-border">
            <AnimatePresence>
              {isLoading ? (
                <div className="px-4 py-10 text-center font-mono text-xs text-muted-foreground">Loading dispatch logs...</div>
              ) : (
                logs?.map((log, i) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="px-4 py-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Pulse indicator */}
                        <div className="mt-1.5">
                          <div className={`h-2.5 w-2.5 rounded-full ${
                            log.status === 'processing' ? 'bg-warning pulse-warning' :
                            log.status === 'dispatched' ? 'bg-primary pulse-safe' :
                            log.status === 'escalated' ? 'bg-critical pulse-critical' :
                            'bg-safe'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">{log.propertyName}</span>
                            <StatusBadge status={log.alertType} pulse={log.status === 'processing'} />
                          </div>
                          <p className="font-mono text-xs text-muted-foreground leading-relaxed">{log.message}</p>
                          {log.vendorAssigned && (
                            <div className="flex items-center gap-1.5 mt-2 text-primary">
                              <ArrowRight className="h-3 w-3" />
                              <span className="font-mono text-[11px]">{log.vendorAssigned}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <StatusBadge status={log.status} size="sm" />
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="font-mono text-[10px]">
                            {new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
