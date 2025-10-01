import * as React from 'react'

/**
 * Custom React hook to detect if the user is on a mobile viewport.
 *
 * - Uses `window.matchMedia` to listen for viewport width changes.
 * - Returns `true` if the screen width is below the mobile breakpoint.
 * - Returns `false` otherwise.
 * - Prevents hydration mismatch by starting with `undefined` until mounted.
 *
 * @returns {boolean} - Whether the current viewport is considered "mobile".
 *
 * Example usage:
 * ```tsx
 * const isMobile = useIsMobile()
 * 
 * return (
 *   <div>
 *     {isMobile ? "Mobile view" : "Desktop view"}
 *   </div>
 * )
 * ```
 */

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Match media query for mobile screen sizes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Update state on viewport changes
    const onChange = () => {
      // Initial check
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Subscribe to changes
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    // Cleanup listener on unmount
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}
