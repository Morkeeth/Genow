'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { epochs } from '@/app/lib/art/epochs'
import { generateEpochStory } from '@/app/lib/llm/courseGenerator'
import EpochTimeline from '@/app/components/epoch/EpochTimeline'
import EpochCard from '@/app/components/epoch/EpochCard'
import type { Epoch } from '@/app/types/epoch'
import { staggerContainer } from '@/app/lib/utils/animations'

export default function EpochsPage() {
  const [selectedEpoch, setSelectedEpoch] = useState<Epoch | null>(null)
  const [epochsWithStories, setEpochsWithStories] = useState<Epoch[]>(epochs)
  const [loadingStory, setLoadingStory] = useState<string | null>(null)

  const handleEpochSelect = async (epoch: Epoch) => {
    setSelectedEpoch(epoch)
    
    // Generate story if not already generated
    if (!epoch.story && !loadingStory) {
      setLoadingStory(epoch.id)
      try {
        const story = await generateEpochStory(
          epoch.name,
          epoch.culturalContext
        )
        setEpochsWithStories((prev) =>
          prev.map((e) =>
            e.id === epoch.id ? { ...e, story } : e
          )
        )
      } catch (error) {
        console.error('Error generating epoch story:', error)
      } finally {
        setLoadingStory(null)
      }
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-8">Art Epochs</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 poetic-text mb-8">
          Explore the great epochs of art history. Each period tells a story of
          human creativity, cultural change, and artistic evolution.
        </p>

        {/* Timeline */}
        <div className="mb-12">
          <EpochTimeline
            epochs={epochsWithStories}
            selectedEpoch={selectedEpoch?.id}
            onEpochSelect={handleEpochSelect}
          />
        </div>

        {/* Selected Epoch Detail */}
        {selectedEpoch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <EpochCard epoch={selectedEpoch} />
          </motion.div>
        )}

        {/* All Epochs Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {epochsWithStories.map((epoch) => (
            <EpochCard
              key={epoch.id}
              epoch={epoch}
              onSelect={handleEpochSelect}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}


