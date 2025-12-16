'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { scaleIn, fadeInUp } from '@/app/lib/utils/animations'

interface FloatingInsightProps {
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click'
}

export default function FloatingInsight({
  title,
  content,
  position = 'top',
  trigger = 'hover',
}: FloatingInsightProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const handleInteraction = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible)
    }
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => trigger === 'hover' && setIsVisible(true)}
      onMouseLeave={() => trigger === 'hover' && setIsVisible(false)}
      onClick={handleInteraction}
    >
      {/* Trigger element */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-4 h-4 rounded-full bg-blue-500 cursor-pointer shadow-lg"
      />

      {/* Insight bubble */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="initial"
            className={`absolute z-50 w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl ${positionClasses[position]}`}
          >
            <h4 className="font-serif font-semibold mb-2 text-gray-900 dark:text-white">
              {title}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 poetic-text">
              {content}
            </p>
            
            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 ${
                position === 'top'
                  ? 'top-full left-1/2 -translate-x-1/2 border-t-8 border-t-white dark:border-t-gray-800 border-x-8 border-x-transparent'
                  : position === 'bottom'
                  ? 'bottom-full left-1/2 -translate-x-1/2 border-b-8 border-b-white dark:border-b-gray-800 border-x-8 border-x-transparent'
                  : position === 'left'
                  ? 'left-full top-1/2 -translate-y-1/2 border-l-8 border-l-white dark:border-l-gray-800 border-y-8 border-y-transparent'
                  : 'right-full top-1/2 -translate-y-1/2 border-r-8 border-r-white dark:border-r-gray-800 border-y-8 border-y-transparent'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


