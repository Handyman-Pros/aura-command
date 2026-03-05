import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVendors } from '@/lib/hooks';
import { VendorFilters } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import { Search, Filter, Star, Phone, Mail } from 'lucide-react';

const states = ['', 'AZ', 'CA', 'CO', 'FL', 'HI', 'IL', 'NY', 'TX'];
const trades = ['', 'HVAC', 'Electrical', 'Plumbing', 'Fire Safety', 'Elevator', 'Security Systems', 'Landscaping', 'Pool Maintenance'];
const complianceOptions = ['', 'compliant', 'pending', 'expired', 'non-compliant'];

export default function VendorSearch() {
  const [filters, setFilters] = useState<VendorFilters>({});
  const { data: vendors, isLoading } = useVendors(filters);

  const updateFilter = (key: keyof VendorFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-14">
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Vendor Database</h1>
          <p className="font-mono text-xs text-muted-foreground mt-1">NATIONWIDE VENDOR SEARCH · {vendors?.length || 0} RESULTS</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="font-mono text-[10px] tracking-wider">FILTERS</span>
          </div>
          
          {[
            { key: 'state' as const, label: 'State', options: states },
            { key: 'trade' as const, label: 'Trade', options: trades },
            { key: 'complianceStatus' as const, label: 'Compliance', options: complianceOptions },
          ].map(({ key, label, options }) => (
            <select
              key={key}
              value={filters[key] || ''}
              onChange={e => updateFilter(key, e.target.value)}
              className="rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">{label}: All</option>
              {options.filter(Boolean).map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ))}

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by zip code..."
              value={filters.zipCode || ''}
              onChange={e => updateFilter('zipCode', e.target.value)}
              className="w-full rounded-md border border-border bg-secondary pl-9 pr-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  {['Vendor', 'Trade', 'Location', 'Compliance', 'Rating', 'Contact', 'Last Dispatch'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-mono text-[10px] font-medium text-muted-foreground tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center font-mono text-xs text-muted-foreground">Loading vendors...</td></tr>
                ) : vendors?.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center font-mono text-xs text-muted-foreground">No vendors found</td></tr>
                ) : (
                  vendors?.map((v, i) => (
                    <motion.tr
                      key={v.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{v.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.trade}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.state} · {v.zipCode}</td>
                      <td className="px-4 py-3"><StatusBadge status={v.complianceStatus} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-warning fill-warning" />
                          <span className="font-mono text-xs text-foreground">{v.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <Mail className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{v.lastDispatch}</td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
