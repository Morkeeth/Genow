'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimatedBackground from './components/ui/AnimatedBackground'
import { fadeInUp, staggerContainer } from './lib/utils/animations'

export default function Home() {
  return (
    <main className="min-h-screen p-8 relative">
      <AnimatedBackground />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 poetic-text text-gray-900 dark:text-white">
            Art Appreciation
          </h1>
          <p className="text-xl md:text-2xl mb-8 poetic-text text-gray-700 dark:text-gray-300 leading-relaxed">
            Find your resonance. Discover what truly moves you in art.
          </p>
          <p className="text-lg mb-12 poetic-text text-gray-600 dark:text-gray-400 italic">
            We go into the museum and expect to like everything—an overwhelming feeling.
            But truly understand in the gift shop when we buy a postcard what we truly like.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-wrap gap-4 mb-8"
        >
          <motion.div variants={fadeInUp}>
            <Link 
              href="/courses" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Courses
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Link 
              href="/epochs" 
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Epochs
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Link 
              href="/explore" 
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Link 
              href="/preferences" 
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              My Preferences
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-red-500"
        >
          <h2 className="text-2xl font-serif font-semibold mb-3">
            Featured Course: Matisse Red Studio → Rothko
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 poetic-text">
            Explore how Henri Matisse's revolutionary "The Red Studio" (1911) 
            inspired Mark Rothko's color field paintings. Discover the story of 
            influence, emotion, and artistic evolution.
          </p>
          <Link
            href="/courses/matisse-red-studio-and-its-influence"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105 shadow-lg"
          >
            Start Course
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

