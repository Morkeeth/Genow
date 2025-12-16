'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Artwork } from '@/app/types/course'
import { fadeInUp } from '@/app/lib/utils/animations'
import PreferenceButton from './PreferenceButton'

interface ArtworkCardProps {
  artwork: Artwork
  onClick?: () => void
  showPreference?: boolean
}

export default function ArtworkCard({
  artwork,
  onClick,
  showPreference = true,
}: ArtworkCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer group"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
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
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {artwork.artist}, {artwork.year}
        </p>
        {artwork.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
            {artwork.description}
          </p>
        )}
        {showPreference && (
          <PreferenceButton
            artworkId={artwork.id}
            artworkTitle={artwork.title}
            artist={artwork.artist}
          />
        )}
      </div>
    </motion.div>
  )
}


