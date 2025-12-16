'use client'

import { motion } from 'framer-motion'
import type { Connection } from '@/app/types/course'
import { fadeInUp } from '@/app/lib/utils/animations'

interface FloatingConnectionProps {
  connection: Connection
  fromPosition: { x: number; y: number }
  toPosition: { x: number; y: number }
  onConnectionClick?: (connection: Connection) => void
}

export default function FloatingConnection({
  connection,
  fromPosition,
  toPosition,
  onConnectionClick,
}: FloatingConnectionProps) {
  const dx = toPosition.x - fromPosition.x
  const dy = toPosition.y - fromPosition.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  const lineWidth = (connection.strength || 0.5) * 4

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="absolute pointer-events-none"
      style={{
        left: fromPosition.x,
        top: fromPosition.y,
        width: distance,
        transformOrigin: '0 0',
        transform: `rotate(${angle}deg)`,
      }}
    >
      {/* Connection line */}
      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 opacity-60"
        style={{
          width: distance,
          height: `${lineWidth}px`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Connection point */}
      <motion.div
        className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-blue-500 shadow-lg cursor-pointer pointer-events-auto"
        whileHover={{ scale: 1.5 }}
        onClick={() => onConnectionClick?.(connection)}
        title={connection.story}
      />

      {/* Connection label (on hover) */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs shadow-lg opacity-0 pointer-events-auto"
        whileHover={{ opacity: 1 }}
      >
        <span className="text-gray-700 dark:text-gray-300">
          {connection.type}
        </span>
      </motion.div>
    </motion.div>
  )
}


