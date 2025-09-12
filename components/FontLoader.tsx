'use client'

import { useEffect, useState } from 'react'

interface FontLoaderProps {
  children: React.ReactNode
}

export default function FontLoader({ children }: FontLoaderProps) {
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    // Next.js handles font loading automatically with next/font/google
    // We just need to wait for the fonts to be ready
    const checkFonts = () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          setFontsReady(true)
        }).catch(() => {
          // Fonts failed to load, but continue with fallbacks
          setFontsReady(true)
        })
      } else {
        // Fallback for browsers that don't support document.fonts
        setFontsReady(true)
      }
    }

    // Small delay to ensure fonts have time to start loading
    const timer = setTimeout(checkFonts, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return <>{children}</>
}
