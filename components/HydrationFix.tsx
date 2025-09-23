'use client'

import { useEffect } from 'react'

/**
 * Component to fix hydration warnings caused by browser extensions
 */
export default function HydrationFix() {
  useEffect(() => {
    // Clean browser extension attributes that cause hydration mismatches
    const cleanAttributes = () => {
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach(input => {
        // Remove common browser extension attributes
        const extensionAttributes = [
          'fdprocessedid',
          'data-lastpass-icon-root',
          'data-1p-ignore',
          'data-bwignore',
          'data-dashlane-ignore',
          'data-bitwarden-watching',
          'data-1password-ignore',
          'data-grammarly-ignore',
          'data-grammarly-shadow-root',
          'data-grammarly-original-text',
          'data-grammarly-original-html',
          'data-grammarly-original-attributes',
          'data-grammarly-original-tag',
          'data-grammarly-original-class',
          'data-grammarly-original-id',
          'data-grammarly-original-style',
          'data-grammarly-original-title',
          'data-grammarly-original-aria-label',
          'data-grammarly-original-aria-describedby',
          'data-grammarly-original-aria-labelledby',
          'data-grammarly-original-aria-hidden',
          'data-grammarly-original-aria-expanded',
          'data-grammarly-original-aria-selected',
          'data-grammarly-original-aria-checked',
          'data-grammarly-original-aria-pressed',
          'data-grammarly-original-aria-current',
          'data-grammarly-original-aria-atomic',
          'data-grammarly-original-aria-busy',
          'data-grammarly-original-aria-controls',
          'data-grammarly-original-aria-describedby',
          'data-grammarly-original-aria-details',
          'data-grammarly-original-aria-disabled',
          'data-grammarly-original-aria-dropeffect',
          'data-grammarly-original-aria-flowto',
          'data-grammarly-original-aria-grabbed',
          'data-grammarly-original-aria-haspopup',
          'data-grammarly-original-aria-invalid',
          'data-grammarly-original-aria-keyshortcuts',
          'data-grammarly-original-aria-level',
          'data-grammarly-original-aria-live',
          'data-grammarly-original-aria-modal',
          'data-grammarly-original-aria-multiline',
          'data-grammarly-original-aria-multiselectable',
          'data-grammarly-original-aria-orientation',
          'data-grammarly-original-aria-owns',
          'data-grammarly-original-aria-placeholder',
          'data-grammarly-original-aria-posinset',
          'data-grammarly-original-aria-readonly',
          'data-grammarly-original-aria-relevant',
          'data-grammarly-original-aria-required',
          'data-grammarly-original-aria-roledescription',
          'data-grammarly-original-aria-rowcount',
          'data-grammarly-original-aria-rowindex',
          'data-grammarly-original-aria-rowspan',
          'data-grammarly-original-aria-setsize',
          'data-grammarly-original-aria-sort',
          'data-grammarly-original-aria-valuemax',
          'data-grammarly-original-aria-valuemin',
          'data-grammarly-original-aria-valuenow',
          'data-grammarly-original-aria-valuetext'
        ]

        extensionAttributes.forEach(attr => {
          if (input.hasAttribute(attr)) {
            input.removeAttribute(attr)
          }
        })
      })
    }

    // Clean attributes on mount and when DOM changes
    cleanAttributes()

    // Set up a MutationObserver to clean attributes as they're added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
            const extensionAttributes = [
              'fdprocessedid',
              'data-lastpass-icon-root',
              'data-1p-ignore',
              'data-bwignore',
              'data-dashlane-ignore',
              'data-bitwarden-watching',
              'data-1password-ignore',
              'data-grammarly-ignore',
              'data-grammarly-shadow-root'
            ]
            
            extensionAttributes.forEach(attr => {
              if (target.hasAttribute(attr)) {
                target.removeAttribute(attr)
              }
            })
          }
        }
      })
    })

    // Start observing
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['fdprocessedid', 'data-lastpass-icon-root', 'data-1p-ignore', 'data-bwignore', 'data-dashlane-ignore', 'data-bitwarden-watching', 'data-1password-ignore', 'data-grammarly-ignore', 'data-grammarly-shadow-root']
    })

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
