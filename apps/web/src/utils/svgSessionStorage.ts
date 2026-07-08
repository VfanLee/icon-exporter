const STORAGE_KEY = 'icon-forge:svg-source'

export function loadCachedSvg(): string | null {
  try {
    const svg = sessionStorage.getItem(STORAGE_KEY)
    return svg && svg.trim() ? svg : null
  } catch {
    return null
  }
}

export function persistCachedSvg(svg: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, svg)
  } catch {
    // Session storage can be unavailable in private browsing or restricted contexts.
  }
}

export function clearCachedSvg() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Session storage can be unavailable in private browsing or restricted contexts.
  }
}
