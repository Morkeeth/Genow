'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Artwork } from '@/app/types/course'
import { floatingVariants, fadeInUp } from '@/app/lib/utils/animations'

interface FloatingArtworkProps {
  artwork: Artwork
  onClick?: () => void
  delay?: number
}

export default function FloatingArtwork({
  artwork,
  onClick,
  delay = 0,
}: FloatingArtworkProps) {
  return (
    <motion.div
      variants={floatingVariants}
      initial="initial"
      animate="animate"
      custom={delay}
      className="relative cursor-pointer group"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        variants={fadeInUp}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-sm"
      >
        <div className="relative w-full h-64">
          {artwork.imageUrl ? (
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">{artwork.title}</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg font-semibold mb-1">
            {artwork.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {artwork.artist}, {artwork.year}
          </p>
        </div>
      </motion.div>
      
      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center"
      >
        <span className="text-white font-medium">View Details</span>
      </motion.div>
    </motion.div>
  )
}


