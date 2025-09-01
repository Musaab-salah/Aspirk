'use client'

import { useEffect, useState } from 'react'

interface FontLoaderProps {
  children: React.ReactNode
}

export default function FontLoader({ children }: FontLoaderProps) {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [fontsError, setFontsError] = useState(false)

  useEffect(() => {
    // Check if fonts are available
    const checkFonts = async () => {
      try {
        // Check if Inter font is available
        if (document.fonts && document.fonts.check) {
          const interAvailable = document.fonts.check('1em Inter')
          const notoAvailable = document.fonts.check('1em Noto Sans Arabic')
          
          if (interAvailable && notoAvailable) {
            setFontsLoaded(true)
          } else {
            // Wait a bit for fonts to load
            setTimeout(() => {
              const interLoaded = document.fonts.check('1em Inter')
              const notoLoaded = document.fonts.check('1em Noto Sans Arabic')
              setFontsLoaded(interLoaded && notoLoaded)
              if (!interLoaded || !notoLoaded) {
                setFontsError(true)
                console.warn('Some Google Fonts failed to load, using fallback fonts')
              }
            }, 2000)
          }
        } else {
          // Fallback for browsers that don't support document.fonts
          setFontsLoaded(true)
        }
      } catch (error) {
        console.warn('Font loading check failed:', error)
        setFontsError(true)
        setFontsLoaded(true) // Continue with fallback fonts
      }
    }

    checkFonts()
  }, [])

  // Add CSS variables for fallback fonts
  useEffect(() => {
    if (fontsError) {
      const style = document.createElement('style')
      style.textContent = `
        :root {
          --font-inter: 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;
          --font-noto-sans-arabic: 'Arial', 'Segoe UI', sans-serif;
        }
      `
      document.head.appendChild(style)
    }
  }, [fontsError])

  return <>{children}</>
}
