'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Artwork } from '@/app/types/course'
import PreferenceButton from './PreferenceButton'
import PoeticText from '../ui/PoeticText'

interface ArtworkDetailProps {
  artwork: Artwork
  onClose: () => void
}

export default function ArtworkDetail({ artwork, onClose }: ArtworkDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-96 md:h-[500px]">
          {artwork.imageUrl ? (
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-xl">{artwork.title}</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">
                {artwork.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {artwork.artist}, {artwork.year}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {artwork.description && (
            <div className="mb-6">
              <PoeticText text={artwork.description} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            {artwork.medium && (
              <div>
                <span className="font-semibold">Medium:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {artwork.medium}
                </span>
              </div>
            )}
            {artwork.dimensions && (
              <div>
                <span className="font-semibold">Dimensions:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {artwork.dimensions}
                </span>
              </div>
            )}
            {artwork.location && (
              <div>
                <span className="font-semibold">Location:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {artwork.location}
                </span>
              </div>
            )}
            {artwork.epoch && (
              <div>
                <span className="font-semibold">Epoch:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {artwork.epoch}
                </span>
              </div>
            )}
          </div>

          <PreferenceButton
            artworkId={artwork.id}
            artworkTitle={artwork.title}
            artist={artwork.artist}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}


