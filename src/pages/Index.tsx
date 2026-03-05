import { motion } from 'framer-motion';
import { useProperties, useRegionHealth } from '@/lib/hooks';
import MapView from '@/components/MapView';
import SystemHealth from '@/components/SystemHealth';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { data: properties, isLoading: loadingProps } = useProperties();
  const { data: regions, isLoading: loadingRegions } = useRegionHealth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-14"
    >
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Command Center</h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">NATIONWIDE AUTONOMOUS INFRASTRUCTURE · REAL-TIME</p>
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">
            {new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
          </div>
        </div>

        {loadingProps || loadingRegions ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Map */}
            <MapView properties={properties || []} />

            {/* System Health */}
            <SystemHealth regions={regions || []} />
          </>
        )}
      </div>
    </motion.div>
  );
}
