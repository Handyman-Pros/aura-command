import { useState } from 'react';
import { motion } from 'framer-motion';
import { getApiConfig, setApiConfig, clearApiConfig, api } from '@/lib/api';
import { Settings as SettingsIcon, Link2, Unlink, CheckCircle2, XCircle, Loader2, Shield, Server } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const existing = getApiConfig();
  const [baseUrl, setBaseUrl] = useState(existing?.baseUrl || '');
  const [apiKey, setApiKey] = useState(existing?.apiKey || '');
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = () => {
    if (!baseUrl.trim()) {
      toast.error('Please enter a Replit Deployment URL');
      return;
    }
    setApiConfig({ baseUrl: baseUrl.trim(), apiKey: apiKey.trim() });
    toast.success('API configuration saved');
  };

  const handleTest = async () => {
    setTesting(true);
    setConnectionStatus('idle');
    try {
      handleSave();
      await api.testConnection();
      setConnectionStatus('success');
      toast.success('Connection successful!');
    } catch (err) {
      setConnectionStatus('error');
      toast.error(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = () => {
    clearApiConfig();
    setBaseUrl('');
    setApiKey('');
    setConnectionStatus('idle');
    toast.info('API configuration cleared. Using demo data.');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-14">
      <div className="container max-w-2xl py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">API Integration</h1>
          <p className="font-mono text-xs text-muted-foreground mt-1">REPLIT BACKEND CONNECTION SETTINGS</p>
        </div>

        {/* Connection card */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Replit PostgreSQL Backend</h2>
              <p className="font-mono text-[10px] text-muted-foreground">Connect your Replit deployment to enable live data</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] text-muted-foreground tracking-wider mb-1.5">DEPLOYMENT URL</label>
              <input
                type="url"
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
                placeholder="https://your-app.replit.app"
                className="w-full rounded-md border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground tracking-wider mb-1.5">
                <Shield className="h-3 w-3" />
                API SECRET KEY
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full rounded-md border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Status indicator */}
          {connectionStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono ${
                connectionStatus === 'success'
                  ? 'bg-safe/10 border border-safe/20 text-safe'
                  : 'bg-critical/10 border border-critical/20 text-critical'
              }`}
            >
              {connectionStatus === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {connectionStatus === 'success' ? 'Connected to Replit backend' : 'Connection failed — check URL and credentials'}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTest}
              disabled={testing || !baseUrl.trim()}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              {testing ? 'Testing...' : 'Save & Test Connection'}
            </button>
            <button
              onClick={handleSave}
              className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Save Only
            </button>
            {existing && (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 rounded-md border border-destructive/20 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors ml-auto"
              >
                <Unlink className="h-4 w-4" />
                Disconnect
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Expected API Endpoints</h3>
          <p className="font-mono text-[10px] text-muted-foreground mb-3">Your Replit backend should expose these REST endpoints:</p>
          <div className="space-y-1.5">
            {[
              { method: 'GET', path: '/api/health', desc: 'Connection test' },
              { method: 'GET', path: '/api/properties', desc: 'All property locations & status' },
              { method: 'GET', path: '/api/regions/health', desc: 'Regional health summary' },
              { method: 'GET', path: '/api/vendors?state=&zip=&trade=&compliance=', desc: 'Vendor search with filters' },
              { method: 'GET', path: '/api/dispatches', desc: 'Autonomous dispatch logs' },
            ].map(ep => (
              <div key={ep.path} className="flex items-center gap-3 rounded-md bg-secondary/50 px-3 py-2">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">{ep.method}</span>
                <code className="font-mono text-xs text-foreground flex-1">{ep.path}</code>
                <span className="font-mono text-[10px] text-muted-foreground">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="font-mono text-[10px] text-muted-foreground text-center">
          Without a connected backend, AuraOps runs in demo mode with simulated data.
        </p>
      </div>
    </motion.div>
  );
}
