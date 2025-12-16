'use client'

import { motion } from 'framer-motion'
import type { Epoch } from '@/app/types/epoch'
import { fadeInUp } from '@/app/lib/utils/animations'

interface EpochTimelineProps {
  epochs: Epoch[]
  selectedEpoch?: string
  onEpochSelect?: (epoch: Epoch) => void
}

export default function EpochTimeline({
  epochs,
  selectedEpoch,
  onEpochSelect,
}: EpochTimelineProps) {
  const sortedEpochs = [...epochs].sort((a, b) => a.startYear - b.startYear)
  const minYear = Math.min(...sortedEpochs.map((e) => e.startYear))
  const maxYear = Math.max(...sortedEpochs.map((e) => e.endYear))
  const totalYears = maxYear - minYear

  return (
    <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
      <div className="relative min-w-full h-full">
        {/* Timeline line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600 transform -translate-y-1/2" />

        {/* Epoch markers */}
        {sortedEpochs.map((epoch) => {
          const startPosition = ((epoch.startYear - minYear) / totalYears) * 100
          const width = ((epoch.endYear - epoch.startYear) / totalYears) * 100

          return (
            <motion.div
              key={epoch.id}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${startPosition}%`,
                width: `${width}%`,
              }}
              onClick={() => onEpochSelect?.(epoch)}
            >
              {/* Epoch bar */}
              <div
                className="h-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  backgroundColor: epoch.color || '#666',
                  opacity: selectedEpoch === epoch.id ? 1 : 0.7,
                }}
              >
                <div className="h-full flex items-center justify-center px-2">
                  <span className="text-white text-xs font-semibold whitespace-nowrap">
                    {epoch.name}
                  </span>
                </div>
              </div>

              {/* Year labels */}
              <div className="absolute top-full left-0 mt-2 text-xs text-gray-600 dark:text-gray-400">
                {epoch.startYear}
              </div>
              <div className="absolute top-full right-0 mt-2 text-xs text-gray-600 dark:text-gray-400">
                {epoch.endYear}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}


