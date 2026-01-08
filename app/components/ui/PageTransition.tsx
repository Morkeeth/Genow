'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayLocation, setDisplayLocation] = useState(pathname)

  useEffect(() => {
    if (pathname !== displayLocation) {
      setDisplayLocation(pathname)
    }
  }, [pathname, displayLocation])

  return (
    <motion.div
      key={displayLocation}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

