import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Search, Activity, Settings, Radio, ClipboardList } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Command Center', icon: Globe },
  { path: '/vendors', label: 'Vendor Search', icon: Search },
  { path: '/monitor', label: 'Logic Monitor', icon: Activity },
  { path: '/dispatches', label: 'Dispatches', icon: ClipboardList },
  { path: '/settings', label: 'API Settings', icon: Settings },
];

export default function AppNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface-overlay/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <Radio className="h-4 w-4 text-primary" />
            <div className="absolute inset-0 rounded-lg pulse-safe opacity-50" />
          </div>
          <span className="font-mono text-sm font-bold tracking-wider text-foreground">
            AURA<span className="text-primary">OPS</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className="relative flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-md bg-secondary"
                    transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2 ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-safe/10 px-2.5 py-1 border border-safe/20">
            <div className="h-1.5 w-1.5 rounded-full bg-safe pulse-safe" />
            <span className="font-mono text-[10px] text-safe">ONLINE</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
