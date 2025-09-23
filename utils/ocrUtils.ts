/**
 * OCR utility functions for extracting text from images
 */

export interface OCRResult {
  text: string
  confidence: number
  words: Array<{
    text: string
    confidence: number
    bbox: {
      x0: number
      y0: number
      x1: number
      y1: number
    }
  }>
}

/**
 * Extract text from image using Tesseract.js
 */
export async function extractTextFromImage(imageData: string): Promise<OCRResult> {
  try {
    // Dynamic import to avoid SSR issues
    const Tesseract = (await import('tesseract.js')).default
    
    const { data } = await Tesseract.recognize(imageData, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
        }
      }
    })

    return {
      text: data.text,
      confidence: data.confidence,
      words: (data as any).words || []
    }
  } catch (error) {
    console.error('OCR Error:', error)
    throw new Error('فشل في استخراج النص من الصورة')
  }
}

/**
 * Extract chassis number from OCR text
 * This function looks for patterns that might be chassis numbers
 */
export function extractChassisNumber(ocrText: string): string | null {
  // Clean the text - remove extra spaces and normalize
  const cleanText = ocrText.replace(/\s+/g, ' ').trim()
  
  // Enhanced chassis number patterns for better detection
  const patterns = [
    // Standard VIN patterns (17 characters)
    /[A-HJ-NPR-Z0-9]{17}/g,
    // Alphanumeric patterns (6-17 characters) - more lenient
    /[A-Z0-9]{6,17}/g,
    // Patterns with separators (common in chassis numbers)
    /[A-Z0-9]{2,6}[-_][A-Z0-9]{2,6}[-_][A-Z0-9]{2,6}/g,
    // Mixed letter-number patterns (more flexible)
    /[A-Z]{1,4}[0-9]{4,12}/g,
    // Number-letter patterns (more flexible)
    /[0-9]{2,8}[A-Z]{1,6}[0-9]{2,8}/g,
    // Patterns with spaces (OCR might add spaces)
    /[A-Z0-9]{2,6}\s[A-Z0-9]{2,6}\s[A-Z0-9]{2,6}/g,
    // Single long alphanumeric strings (common in chassis)
    /[A-Z0-9]{10,}/g,
    // Patterns with dots or other separators
    /[A-Z0-9]{2,6}[.-][A-Z0-9]{2,6}[.-][A-Z0-9]{2,6}/g,
    // Mixed case patterns (OCR might change case)
    /[A-Za-z0-9]{6,17}/g
  ]

  const matches: string[] = []
  
  patterns.forEach(pattern => {
    const found = cleanText.match(pattern)
    if (found) {
      matches.push(...found)
    }
  })

  if (matches.length === 0) {
    return null
  }

  // Score matches based on length and pattern quality
  const scoredMatches = matches.map(match => ({
    text: match,
    score: calculateChassisScore(match)
  }))

  // Sort by score (higher is better) and return the best match
  scoredMatches.sort((a, b) => b.score - a.score)
  
  return scoredMatches[0].text
}

/**
 * Calculate a score for chassis number candidates
 */
function calculateChassisScore(text: string): number {
  let score = 0
  
  // Length scoring (more lenient - chassis numbers can be 6-17 chars)
  if (text.length >= 10 && text.length <= 17) {
    score += 15
  } else if (text.length >= 6 && text.length <= 17) {
    score += 10
  } else if (text.length >= 4) {
    score += 5
  }
  
  // Character diversity (mix of letters and numbers is good)
  const hasLetters = /[A-Za-z]/.test(text)
  const hasNumbers = /[0-9]/.test(text)
  if (hasLetters && hasNumbers) {
    score += 20
  } else if (hasLetters || hasNumbers) {
    score += 10
  }
  
  // Bonus for common chassis patterns
  if (/^[A-Z0-9]+$/.test(text)) {
    score += 5
  }
  
  // VIN-specific scoring (17 chars)
  if (text.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/.test(text)) {
    score += 25
  }
  
  // Bonus for longer strings (more likely to be chassis)
  if (text.length >= 12) {
    score += 10
  }
  
  // Penalty for too many repeated characters (OCR errors)
  const charCounts: { [key: string]: number } = {}
  for (const char of text) {
    charCounts[char] = (charCounts[char] || 0) + 1
  }
  const maxCharCount = Math.max(...Object.values(charCounts))
  if (maxCharCount > text.length * 0.5) {
    score -= 10
  }
  
  return score
}

/**
 * Validate if extracted text looks like a chassis number
 */
export function isValidChassisNumber(text: string): boolean {
  if (!text || text.length < 4) return false
  
  // Clean the text
  const cleanText = text.trim().toUpperCase()
  
  // More lenient validation - allow numbers only or letters only for some cases
  const hasLetters = /[A-Z]/.test(cleanText)
  const hasNumbers = /[0-9]/.test(cleanText)
  
  // Accept if it has either letters or numbers (more lenient)
  if (!hasLetters && !hasNumbers) return false
  
  // Length validation (more lenient - 4-20 characters)
  if (cleanText.length < 4 || cleanText.length > 20) return false
  
  // Avoid common OCR mistakes (too many similar characters)
  const charCounts: { [key: string]: number } = {}
  for (const char of cleanText) {
    charCounts[char] = (charCounts[char] || 0) + 1
  }
  
  // If any character appears more than 60% of the time, it's likely an OCR error
  const maxCharCount = Math.max(...Object.values(charCounts))
  if (maxCharCount > cleanText.length * 0.6) return false
  
  return true
}

/**
 * Process image and extract chassis number
 */
export async function processImageForChassisNumber(imageData: string): Promise<{
  chassisNumber: string | null
  fullText: string
  confidence: number
  extractedText: string | null
}> {
  try {
    const ocrResult = await extractTextFromImage(imageData)
    const chassisNumber = extractChassisNumber(ocrResult.text)
    
    // Always return the best extracted text, even if not perfectly valid
    const extractedText = chassisNumber || extractBestText(ocrResult.text)
    
    return {
      chassisNumber: chassisNumber && isValidChassisNumber(chassisNumber) ? chassisNumber : null,
      fullText: ocrResult.text,
      confidence: ocrResult.confidence,
      extractedText: extractedText
    }
  } catch (error) {
    console.error('Error processing image:', error)
    throw error
  }
}

/**
 * Extract the best text from OCR result when no chassis number is found
 */
function extractBestText(ocrText: string): string | null {
  // Clean the text
  const cleanText = ocrText.replace(/\s+/g, ' ').trim()
  
  // Look for any alphanumeric sequences that might be useful
  const patterns = [
    /[A-Z0-9]{4,}/g,
    /[A-Za-z0-9]{4,}/g,
    /[0-9]{4,}/g,
    /[A-Z]{2,}/g
  ]
  
  const matches: string[] = []
  
  patterns.forEach(pattern => {
    const found = cleanText.match(pattern)
    if (found) {
      matches.push(...found)
    }
  })
  
  if (matches.length === 0) {
    return null
  }
  
  // Return the longest match
  return matches.reduce((longest, current) => 
    current.length > longest.length ? current : longest
  )
}
