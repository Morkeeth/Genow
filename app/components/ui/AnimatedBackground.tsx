'use client'

import { motion } from 'framer-motion'
import { parallaxVariants } from '@/app/lib/utils/animations'

export default function AnimatedBackground() {
  const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          variants={parallaxVariants}
          initial="initial"
          animate="animate"
          className="absolute rounded-full opacity-10 blur-3xl"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            left: `${20 + i * 15}%`,
            top: `${10 + i * 20}%`,
            backgroundColor: colors[i],
          }}
        />
      ))}
    </div>
  )
}

