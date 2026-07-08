import type { ExportFormat, ExportOutputSpec, ExportSize } from '@icon-forge/shared'
import { cloneOutputs, defaultUseOuterPadding } from '@icon-forge/shared'

export interface UserExportPreset {
  id: string
  label: string
  outputs: ExportOutputSpec[]
}

interface LegacyUserExportPreset {
  id: string
  label: string
  sizes?: ExportSize[]
  formats?: ExportFormat[]
  icoEmbedSizes?: number[]
  outputs?: ExportOutputSpec[]
}

const STORAGE_KEY = 'icon-forge:user-export-presets'

function migrateLegacyPreset(preset: LegacyUserExportPreset): UserExportPreset | null {
  if (!preset.id || !preset.label) {
    return null
  }

  if (preset.outputs?.length) {
    return {
      id: preset.id,
      label: preset.label,
      outputs: cloneOutputs(preset.outputs),
    }
  }

  if (!preset.formats?.length) {
    return null
  }

  const sizes = preset.sizes?.length ? preset.sizes : [{ width: 512, height: 512 }]

  return {
    id: preset.id,
    label: preset.label,
    outputs: preset.formats.map((format) => {
      if (format === 'ico' && preset.icoEmbedSizes?.length) {
        return {
          format,
          sizes: preset.icoEmbedSizes.map((size) => ({ width: size, height: size })),
          useOuterPadding: defaultUseOuterPadding(format),
        }
      }

      if (format === 'svg') {
        return { format, sizes: [{ width: 512, height: 512 }], useOuterPadding: defaultUseOuterPadding(format) }
      }

      if (format === 'icns') {
        const preferred = sizes.find((size) => size.width === 1024 && size.height === 1024)
        return {
          format,
          sizes: preferred ? [preferred] : [sizes.reduce((max, size) => (size.width > max.width ? size : max), sizes[0])],
          useOuterPadding: defaultUseOuterPadding(format),
        }
      }

      return { format, sizes: sizes.map((size) => ({ ...size })), useOuterPadding: defaultUseOuterPadding(format) }
    }),
  }
}

export function loadUserExportPresets(): UserExportPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as LegacyUserExportPreset[]
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((preset) => migrateLegacyPreset(preset))
      .filter((preset): preset is UserExportPreset => preset !== null)
  } catch {
    return []
  }
}

export function persistUserExportPresets(presets: UserExportPreset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
}
