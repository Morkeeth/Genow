'use client'

import { motion } from 'framer-motion'
import type { Domain } from '@/app/lib/types'

interface DomainTabsProps {
  active: Domain | 'all'
  onChange: (domain: Domain | 'all') => void
}

const tabs: { key: Domain | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'art', label: '🎨 Art' },
  { key: 'wine', label: '🍷 Wine' },
  { key: 'culture', label: '🏛️ Culture' },
]

export default function DomainTabs({ active, onChange }: DomainTabsProps) {
  return (
    <div className="flex gap-1 bg-white/5 backdrop-blur-md rounded-full p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className="relative px-4 py-2 text-sm font-light tracking-wide transition-colors rounded-full"
        >
          {active === tab.key && (
            <motion.div
              layoutId="domain-tab"
              className="absolute inset-0 bg-white/15 rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${active === tab.key ? 'text-white' : 'text-white/50'}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}
