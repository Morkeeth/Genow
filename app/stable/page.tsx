'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getStable, removeFromStable, addToStable, getTasteProfile } from '@/app/lib/storage'
import { getArchetypeForProfile } from '@/app/lib/tasteQuiz'
import type { StableItem, TasteProfile } from '@/app/lib/types'
import ScrollReveal from '@/app/components/ScrollReveal'

const categoryLabels: Record<string, string> = {
  art: '🎨 Art',
  wine: '🍷 Wine',
  design: '✧ Design',
  style: '🧵 Style',
  nature: '🌿 Nature',
  place: '📍 Place',
}

const categoryOptions = Object.entries(categoryLabels)

export default function StablePage() {
  const router = useRouter()
  const [items, setItems] = useState<StableItem[]>([])
  const [profile, setProfile] = useState<TasteProfile | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', subtitle: '', category: 'art' as StableItem['category'], note: '' })

  useEffect(() => {
    setMounted(true)
    setItems(getStable())
    setProfile(getTasteProfile())
  }, [])

  const handleAdd = () => {
    if (!newItem.title.trim()) return
    addToStable({
      category: newItem.category,
      title: newItem.title.trim(),
      subtitle: newItem.subtitle.trim() || undefined,
      note: newItem.note.trim() || undefined,
    })
    setItems(getStable())
    setNewItem({ title: '', subtitle: '', category: 'art', note: '' })
    setShowAdd(false)
  }

  const handleRemove = (id: string) => {
    removeFromStable(id)
    setItems(getStable())
  }

  if (!mounted) return <main className="min-h-screen bg-black" />

  const archetype = profile ? getArchetypeForProfile(profile) : null
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, StableItem[]>)

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => router.push('/')}
          className="text-white/30 hover:text-white/60 text-sm font-light transition-colors mb-12 block"
        >
          ← Home
        </motion.button>

        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-3">Your Stable</h1>
          <p className="text-white/40 font-light text-lg mb-4">
            The things you love. Your taste, curated.
          </p>
        </ScrollReveal>

        {/* Taste profile summary */}
        {archetype && (
          <ScrollReveal delay={0.1}>
            <div className="bg-white/5 rounded-xl p-5 mb-12 border border-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-2">Your taste profile</p>
              <p className="text-xl font-serif mb-1">{archetype.name}</p>
              <p className="text-sm text-white/40 font-light italic">{archetype.yourTaste}</p>
            </div>
          </ScrollReveal>
        )}

        {/* Add button */}
        <ScrollReveal delay={0.2}>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="mb-8 text-sm text-white/30 hover:text-white/60 font-light transition-colors border border-white/10 hover:border-white/20 rounded-full px-5 py-2"
          >
            {showAdd ? '✕ Cancel' : '+ Add to your stable'}
          </button>
        </ScrollReveal>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="bg-white/5 rounded-xl p-5 space-y-4 border border-white/5">
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setNewItem({ ...newItem, category: key as StableItem['category'] })}
                      className={`text-xs rounded-full px-3 py-1.5 transition-colors ${
                        newItem.category === key
                          ? 'bg-white/15 text-white'
                          : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <input
                  value={newItem.title}
                  onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="What do you love? (e.g. Double tulips)"
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-white placeholder:text-white/20 font-light focus:outline-none focus:border-white/30"
                />

                <input
                  value={newItem.subtitle}
                  onChange={e => setNewItem({ ...newItem, subtitle: e.target.value })}
                  placeholder="A detail (e.g. White, especially in spring)"
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-white/70 placeholder:text-white/15 text-sm font-light focus:outline-none focus:border-white/30"
                />

                <input
                  value={newItem.note}
                  onChange={e => setNewItem({ ...newItem, note: e.target.value })}
                  placeholder="Why it resonates (optional)"
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-white/50 placeholder:text-white/15 text-sm font-light italic focus:outline-none focus:border-white/30"
                />

                <button
                  onClick={handleAdd}
                  disabled={!newItem.title.trim()}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white px-6 py-2 rounded-full text-sm font-light transition-colors"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {items.length === 0 && !showAdd && (
          <div className="py-20 text-center">
            <p className="text-white/20 text-lg font-light mb-2">Your stable is empty</p>
            <p className="text-white/10 text-sm font-light">
              Everyone should know their favorites. Start adding yours.
            </p>
          </div>
        )}

        {/* Grouped items */}
        {Object.entries(grouped).map(([category, catItems]) => (
          <div key={category} className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-white/20 mb-4">
              {categoryLabels[category] || category}
            </p>

            <div className="space-y-3">
              {catItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-start gap-4 bg-white/[0.02] hover:bg-white/5 rounded-xl p-4 transition-colors"
                >
                  {/* Image or color block */}
                  {item.imageUrl ? (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="56px" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-white/5 flex-shrink-0 flex items-center justify-center text-white/10 text-xl">
                      {categoryLabels[item.category]?.charAt(0) || '✦'}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-serif">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-white/40 font-light">{item.subtitle}</p>
                    )}
                    {item.note && (
                      <p className="text-xs text-white/25 font-light italic mt-1">{item.note}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-white/10 hover:text-white/40 text-xs transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 mt-1"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
