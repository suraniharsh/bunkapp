"use client"

import { useCallback } from "react"

export function useExport() {
  const exportToPNG = useCallback(async (elementId: string, filename = "attendance-report") => {
    try {
      console.log(`Looking for element with ID: ${elementId}`)
      
      const element = document.getElementById(elementId)
      if (!element) {
        console.error(`Element with ID '${elementId}' not found`)
        throw new Error(`Element with ID '${elementId}' not found`)
      }

      console.log("Element found, creating isolated copy...")

      // Create a completely isolated container
      const isolatedContainer = document.createElement('div')
      isolatedContainer.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 800px;
        background: #ffffff;
        font-family: system-ui, -apple-system, sans-serif;
        padding: 20px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
      `
      
      // Clone the content and strip all classes
      const clonedElement = element.cloneNode(true) as HTMLElement
      
      // Remove all existing classes and add safe inline styles
      const addSafeStyles = (el: Element) => {
        // Remove all classes
        el.className = ''
        
        if (el instanceof HTMLElement) {
          // Apply safe inline styles based on original content
          const originalText = el.textContent || ''
          const tagName = el.tagName.toLowerCase()
          
          // Base styles
          el.style.cssText = `
            color: #000000;
            background: transparent;
            border: none;
            margin: 0;
            padding: 0;
            font-family: inherit;
          `
          
          // Specific element styling
          if (tagName === 'h1' || tagName === 'h2') {
            el.style.cssText += `
              font-size: 24px;
              font-weight: 700;
              margin: 16px 0 8px 0;
            `
          } else if (tagName === 'h3') {
            el.style.cssText += `
              font-size: 20px;
              font-weight: 600;
              margin: 12px 0 6px 0;
            `
          } else if (tagName === 'p') {
            el.style.cssText += `
              font-size: 14px;
              line-height: 1.5;
              margin: 8px 0;
            `
          } else if (tagName === 'div') {
            el.style.cssText += `
              margin: 8px 0;
            `
          }
          
          // Color based on content patterns
          if (originalText.includes('%') || originalText.match(/\d+/)) {
            el.style.cssText += `
              font-weight: 700;
              font-size: 28px;
            `
          }
          
          // Status-based coloring
          if (originalText.includes('bunk') || originalText.includes('Safe') || originalText.includes('Perfect')) {
            el.style.color = '#059669'
          } else if (originalText.includes('must attend') || originalText.includes('Critical') || originalText.includes('Careful')) {
            el.style.color = '#dc2626'
          } else if (originalText.includes('Caution') || originalText.includes('threshold')) {
            el.style.color = '#d97706'
          }
          
          // Card-like containers
          if (el.children.length > 2) {
            el.style.cssText += `
              background: #f8f9fa;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
              margin: 12px 0;
            `
          }
        }
        
        // Process children recursively
        Array.from(el.children).forEach(addSafeStyles)
      }
      
      addSafeStyles(clonedElement)
      isolatedContainer.appendChild(clonedElement)
      document.body.appendChild(isolatedContainer)

      console.log("Isolated container created, loading html2canvas...")
      
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default
      console.log("html2canvas loaded successfully")

      // Create canvas with minimal options to avoid OKLCH issues
      const canvas = await html2canvas(isolatedContainer, {
        backgroundColor: "#ffffff",
        scale: 2,
        width: 800,
        height: isolatedContainer.scrollHeight + 40,
        logging: false,
        useCORS: false,
        allowTaint: false,
      })

      // Clean up
      document.body.removeChild(isolatedContainer)
      console.log("Canvas created successfully")

      // Create download link
      const dataURL = canvas.toDataURL("image/png", 0.95)
      console.log("Data URL created, length:", dataURL.length)
      
      const link = document.createElement("a")
      link.download = `${filename}.png`
      link.href = dataURL
      link.style.display = "none"
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      console.log("Download initiated successfully")
      
    } catch (error) {
      console.error("Error exporting to PNG:", error)
      throw error
    }
  }, [])

  return { exportToPNG }
}
