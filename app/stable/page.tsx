'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getStable, removeFromStable, addToStable, getTasteProfile, getStats, isInStable, getCompletedLessonIds } from '@/app/lib/storage'
import { getArchetypeForProfile } from '@/app/lib/tasteQuiz'
import { getAllCourses } from '@/app/lib/data'
import type { StableItem, TasteProfile } from '@/app/lib/types'

const categoryMeta: Record<string, { label: string; icon: string; color: string }> = {
  art: { label: 'Art', icon: '🎨', color: '#c23b22' },
  wine: { label: 'Wine', icon: '🍷', color: '#722F37' },
  design: { label: 'Design', icon: '✧', color: '#C5A55A' },
  style: { label: 'Style', icon: '🧵', color: '#7B68EE' },
  nature: { label: 'Nature', icon: '🌿', color: '#2e7d32' },
  place: { label: 'Place', icon: '📍', color: '#1565c0' },
}

const categoryOptions = Object.entries(categoryMeta)

export default function StablePage() {
  const router = useRouter()
  const [items, setItems] = useState<StableItem[]>([])
  const [profile, setProfile] = useState<TasteProfile | null>(null)
  const [stats, setStats] = useState({ streak: 0, coursesStarted: 0, coursesCompleted: 0, lessonsCompleted: 0, quizAccuracy: 0, stableItems: 0 })
  const [mounted, setMounted] = useState(false)
  const [openFolder, setOpenFolder] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', subtitle: '', category: 'art' as StableItem['category'], note: '' })
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    setMounted(true)
    setItems(getStable())
    setProfile(getTasteProfile())
    setStats(getStats())
  }, [])

  const refreshData = () => {
    setItems(getStable())
    setStats(getStats())
  }

  const handleAdd = () => {
    if (!newItem.title.trim()) return
    addToStable({
      category: newItem.category,
      title: newItem.title.trim(),
      subtitle: newItem.subtitle.trim() || undefined,
      note: newItem.note.trim() || undefined,
    })
    refreshData()
    setNewItem({ title: '', subtitle: '', category: 'art', note: '' })
    setShowAdd(false)
  }

  const handleRemove = (id: string) => {
    removeFromStable(id)
    refreshData()
    // If folder is now empty, close it
    const remaining = getStable().filter(i => i.category === openFolder)
    if (remaining.length === 0) setOpenFolder(null)
  }

  if (!mounted) return <main className="min-h-screen bg-[#1a1a2e]" />

  const archetype = profile ? getArchetypeForProfile(profile) : null
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, StableItem[]>)

  const folderCategories = Object.keys(grouped)
  const openItems = openFolder ? grouped[openFolder] || [] : []

  // Suggestions from courses
  const suggestions = (() => {
    const completedIds = getCompletedLessonIds()
    const courses = getAllCourses()
    const results: Array<{ title: string; image?: string; funFact?: string; courseId: string; domain: string }> = []
    for (const course of courses) {
      for (const lesson of course.lessons) {
        if (completedIds.includes(lesson.id) && !isInStable(lesson.title)) {
          results.push({ title: lesson.title, image: lesson.imageUrl, funFact: lesson.funFact, courseId: course.id, domain: course.domain })
        }
      }
    }
    return results.slice(0, 4)
  })()

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white select-none">
      {/* ── Desktop top bar (macOS-style) ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="text-white/30 hover:text-white/60 text-xs font-light transition-colors">
              ← Home
            </button>
            <span className="text-white/20 text-xs">|</span>
            <span className="text-white/50 text-xs font-light">
              {openFolder ? `${categoryMeta[openFolder]?.icon} ${categoryMeta[openFolder]?.label}` : 'Your Stable'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {archetype && (
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="text-[10px] text-white/25 hover:text-white/50 font-light transition-colors"
              >
                {archetype.name}
              </button>
            )}
            <span className="text-[10px] text-white/15">{items.length} items</span>
          </div>
        </div>
      </div>

      {/* ── Taste profile popover ── */}
      <AnimatePresence>
        {showProfile && profile && archetype && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-10 right-4 z-50 w-72 bg-[#1e1e3a]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl p-5 shadow-2xl"
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-2">Taste Profile</p>
            <p className="text-xl font-serif font-light mb-1">{archetype.name}</p>
            <p className="text-xs text-white/30 font-light italic mb-4">{archetype.yourTaste}</p>
            <div className="space-y-2">
              <MiniBar label="Classic" right="Modern" value={profile.classic_vs_modern} />
              <MiniBar label="Subtle" right="Bold" value={profile.subtle_vs_bold} />
              <MiniBar label="Minimal" right="Expressive" value={profile.minimalist_vs_expressive} />
            </div>
            <div className="flex gap-4 mt-4 text-[10px] text-white/20">
              <span>{stats.lessonsCompleted} lessons</span>
              <span>{stats.coursesCompleted} courses</span>
              {stats.streak > 0 && <span>{stats.streak}d streak</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop area ── */}
      <div className="pt-14 min-h-screen px-6 pb-24">
        <AnimatePresence mode="wait">
          {/* ═══ FOLDER VIEW (inside a category) ═══ */}
          {openFolder ? (
            <motion.div
              key={`folder-${openFolder}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              {/* Folder window */}
              <div className="max-w-4xl mx-auto mt-6">
                <div className="bg-[#12122a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
                  {/* Window title bar */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] bg-white/[0.02]">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setOpenFolder(null)}
                        className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors"
                        title="Close"
                      />
                      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="text-xs text-white/50 font-light ml-2">
                      {categoryMeta[openFolder]?.icon} {categoryMeta[openFolder]?.label} — {openItems.length} items
                    </span>
                  </div>

                  {/* File grid */}
                  <div className="p-6 min-h-[300px]">
                    {openItems.length === 0 ? (
                      <div className="flex items-center justify-center h-[200px]">
                        <p className="text-white/15 text-sm font-light">This folder is empty</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {openItems.map((item, i) => (
                          <FileIcon key={item.id} item={item} index={i} onRemove={handleRemove} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ═══ DESKTOP VIEW (all folders + loose items) ═══ */
            <motion.div
              key="desktop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              <div className="max-w-5xl mx-auto mt-8">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 text-center"
                >
                  <h1 className="text-3xl md:text-4xl font-serif font-light mb-2">Your Stable</h1>
                  <p className="text-white/25 font-light text-sm">
                    {items.length > 0 ? 'Your taste, organized.' : 'Start collecting the things you love.'}
                  </p>
                </motion.div>

                {/* Folder grid */}
                {folderCategories.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16">
                    {folderCategories.map((cat, i) => (
                      <FolderIcon
                        key={cat}
                        category={cat}
                        count={grouped[cat].length}
                        previewItems={grouped[cat].slice(0, 4)}
                        index={i}
                        onOpen={() => setOpenFolder(cat)}
                        isDragOver={dragOver === cat}
                      />
                    ))}
                  </div>
                )}

                {/* Empty categories to add to */}
                {folderCategories.length === 0 && (
                  <div className="flex flex-wrap justify-center gap-8 mb-16">
                    {['art', 'wine', 'design'].map((cat, i) => (
                      <motion.div
                        key={cat}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="flex flex-col items-center gap-2 opacity-20"
                      >
                        <div className="w-20 h-20 rounded-xl bg-white/[0.03] border border-dashed border-white/[0.06] flex items-center justify-center text-2xl">
                          {categoryMeta[cat]?.icon}
                        </div>
                        <span className="text-[10px] text-white/20">{categoryMeta[cat]?.label}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Suggestions from courses */}
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                  >
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/15 mb-4 text-center">From your courses — add to stable?</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {suggestions.map(s => (
                        <SuggestionChip
                          key={s.title}
                          suggestion={s}
                          onAdd={() => {
                            const cat = s.domain === 'wine' ? 'wine' : s.domain === 'culture' ? 'design' : 'art'
                            addToStable({ category: cat as StableItem['category'], title: s.title, subtitle: s.funFact, imageUrl: s.image, fromCourse: s.courseId })
                            refreshData()
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Add button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="text-xs text-white/20 hover:text-white/50 font-light transition-colors border border-white/[0.06] hover:border-white/10 rounded-full px-5 py-2"
                  >
                    {showAdd ? '✕ Cancel' : '+ Add to stable'}
                  </button>
                </div>

                {/* Add form */}
                <AnimatePresence>
                  {showAdd && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-6"
                    >
                      <div className="max-w-md mx-auto bg-[#12122a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
                        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
                          <div className="flex gap-1.5">
                            <button onClick={() => setShowAdd(false)} className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                          </div>
                          <span className="text-xs text-white/40 font-light ml-2">New Item</span>
                        </div>
                        <div className="p-5 space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {categoryOptions.map(([key, meta]) => (
                              <button
                                key={key}
                                onClick={() => setNewItem({ ...newItem, category: key as StableItem['category'] })}
                                className={`text-xs rounded-full px-3 py-1.5 transition-colors ${
                                  newItem.category === key
                                    ? 'bg-white/15 text-white'
                                    : 'bg-white/[0.04] text-white/30 hover:bg-white/[0.08]'
                                }`}
                              >
                                {meta.icon} {meta.label}
                              </button>
                            ))}
                          </div>
                          <input
                            value={newItem.title}
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                            placeholder="What do you love?"
                            className="w-full bg-transparent border-b border-white/[0.06] pb-2 text-white placeholder:text-white/15 font-light focus:outline-none focus:border-white/20 text-sm"
                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                          />
                          <input
                            value={newItem.subtitle}
                            onChange={e => setNewItem({ ...newItem, subtitle: e.target.value })}
                            placeholder="A detail (optional)"
                            className="w-full bg-transparent border-b border-white/[0.06] pb-2 text-white/60 placeholder:text-white/10 text-xs font-light focus:outline-none focus:border-white/20"
                          />
                          <input
                            value={newItem.note}
                            onChange={e => setNewItem({ ...newItem, note: e.target.value })}
                            placeholder="Why it resonates (optional)"
                            className="w-full bg-transparent border-b border-white/[0.06] pb-2 text-white/40 placeholder:text-white/10 text-xs font-light italic focus:outline-none focus:border-white/20"
                          />
                          <button
                            onClick={handleAdd}
                            disabled={!newItem.title.trim()}
                            className="bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white px-5 py-1.5 rounded-full text-xs font-light transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Dock ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-3 pointer-events-none">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pointer-events-auto bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] rounded-2xl px-4 py-2 flex items-center gap-1"
        >
          {folderCategories.map(cat => (
            <button
              key={cat}
              onClick={() => { setOpenFolder(openFolder === cat ? null : cat); }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110 ${
                openFolder === cat ? 'bg-white/10 scale-105' : 'hover:bg-white/[0.04]'
              }`}
              title={categoryMeta[cat]?.label}
            >
              {categoryMeta[cat]?.icon}
            </button>
          ))}
          {folderCategories.length > 0 && (
            <div className="w-px h-6 bg-white/[0.06] mx-1" />
          )}
          <button
            onClick={() => { setOpenFolder(null); setShowAdd(true); }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all hover:scale-110"
            title="Add new"
          >
            +
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all hover:scale-110"
            title="Home"
          >
            ⌂
          </button>
        </motion.div>
      </div>
    </main>
  )
}

// ── Folder Icon ──
function FolderIcon({ category, count, previewItems, index, onOpen, isDragOver }: {
  category: string
  count: number
  previewItems: StableItem[]
  index: number
  onOpen: () => void
  isDragOver: boolean
}) {
  const meta = categoryMeta[category] || { label: category, icon: '📁', color: '#666' }

  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06 }}
      onClick={onOpen}
      className={`flex flex-col items-center gap-2 group transition-all ${isDragOver ? 'scale-110' : ''}`}
    >
      {/* Folder body */}
      <div className="relative w-24 h-20 transition-transform group-hover:scale-105 group-active:scale-95">
        {/* Folder back */}
        <div
          className="absolute inset-0 rounded-xl border border-white/[0.06]"
          style={{ background: `linear-gradient(135deg, ${meta.color}20 0%, ${meta.color}08 100%)` }}
        />
        {/* Folder tab */}
        <div
          className="absolute -top-1.5 left-2 w-8 h-3 rounded-t-md"
          style={{ background: `${meta.color}30` }}
        />
        {/* Preview thumbnails */}
        <div className="absolute inset-2 top-3 flex flex-wrap gap-1 overflow-hidden">
          {previewItems.map((item, i) => (
            item.imageUrl ? (
              <div key={item.id} className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 opacity-60">
                <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="32px"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            ) : (
              <div key={item.id} className="w-8 h-8 rounded bg-white/[0.04] flex-shrink-0 flex items-center justify-center">
                <span className="text-[8px] text-white/20">{item.title.charAt(0)}</span>
              </div>
            )
          ))}
        </div>
        {/* Count badge */}
        <div className="absolute -bottom-1 -right-1 bg-white/10 backdrop-blur-sm text-[9px] text-white/60 rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </div>
      </div>
      {/* Label */}
      <span className="text-[11px] text-white/40 group-hover:text-white/70 font-light transition-colors max-w-24 truncate">
        {meta.icon} {meta.label}
      </span>
    </motion.button>
  )
}

// ── File Icon (item inside folder) ──
function FileIcon({ item, index, onRemove }: { item: StableItem; index: number; onRemove: (id: string) => void }) {
  const [showInfo, setShowInfo] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      className="flex flex-col items-center gap-2 group cursor-default"
      onDoubleClick={() => setShowInfo(!showInfo)}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/[0.04] group-hover:border-white/[0.1] transition-all group-hover:shadow-lg group-hover:shadow-white/[0.02]">
        {item.imageUrl ? (
          <>
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="200px"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        ) : (
          <div className="absolute inset-0 bg-white/[0.02] flex items-center justify-center">
            <span className="text-3xl opacity-20">{categoryMeta[item.category]?.icon || '✦'}</span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {confirmDelete ? (
            <div className="flex gap-1">
              <button onClick={() => onRemove(item.id)} className="bg-red-500/30 backdrop-blur-sm text-red-300 text-[9px] px-1.5 py-0.5 rounded">✕</button>
              <button onClick={() => setConfirmDelete(false)} className="bg-white/10 backdrop-blur-sm text-white/50 text-[9px] px-1.5 py-0.5 rounded">✓</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="bg-black/40 backdrop-blur-sm text-white/40 hover:text-white/70 text-[9px] px-1.5 py-0.5 rounded transition-colors">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Label */}
      <div className="text-center max-w-full px-1">
        <p className="text-[11px] text-white/60 font-light truncate leading-tight">{item.title}</p>
        {item.subtitle && (
          <p className="text-[9px] text-white/25 font-light truncate">{item.subtitle}</p>
        )}
      </div>

      {/* Info popover on double-click */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute top-full mt-2 z-10 bg-[#1e1e3a]/95 backdrop-blur-xl border border-white/[0.08] rounded-lg p-3 shadow-xl w-48"
            onClick={() => setShowInfo(false)}
          >
            <p className="text-xs text-white/70 font-serif mb-1">{item.title}</p>
            {item.subtitle && <p className="text-[10px] text-white/40 font-light mb-1">{item.subtitle}</p>}
            {item.note && <p className="text-[10px] text-white/25 font-light italic">{item.note}</p>}
            <p className="text-[9px] text-white/15 mt-2">Added {new Date(item.addedAt).toLocaleDateString()}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Suggestion Chip ──
function SuggestionChip({ suggestion, onAdd }: { suggestion: { title: string; image?: string }; onAdd: () => void }) {
  const [added, setAdded] = useState(false)
  return (
    <button
      onClick={() => { if (!added) { onAdd(); setAdded(true) } }}
      disabled={added}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all text-left ${
        added ? 'border-white/[0.04] opacity-40' : 'border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02]'
      }`}
    >
      {suggestion.image && (
        <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={suggestion.image} alt="" fill className="object-cover" sizes="32px"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      )}
      <div>
        <p className="text-[10px] text-white/50 font-light truncate max-w-[150px]">{suggestion.title}</p>
        <p className="text-[9px] text-white/20">{added ? '✓ Added' : '♡ Add'}</p>
      </div>
    </button>
  )
}

// ── Mini spectrum bar for profile popover ──
function MiniBar({ label, right, value }: { label: string; right: string; value: number }) {
  const pct = ((value + 1) / 2) * 100
  return (
    <div>
      <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/15 mb-0.5">
        <span>{label}</span>
        <span>{right}</span>
      </div>
      <div className="h-0.5 bg-white/[0.04] rounded-full relative">
        <div
          className="absolute top-0 h-full w-2 bg-white/40 rounded-full"
          style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  )
}
