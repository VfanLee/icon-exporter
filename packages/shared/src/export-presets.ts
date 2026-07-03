import type { ExportFormat, ExportOutputSpec, ExportSize } from './export.types'

export type ExportPresetId = 'preset1' | 'preset2' | 'preset3' | 'custom'

export interface ExportPreset {
  id: ExportPresetId
  label: string
  description: string
  outputs: ExportOutputSpec[]
}

function squareSize(size: number): ExportSize {
  return { width: size, height: size }
}

function squareSizes(sizes: readonly number[]): ExportSize[] {
  return sizes.map(squareSize)
}

export const DEFAULT_ICO_EMBED_SIZES = [16, 32, 48, 256] as const

export const DEFAULT_CUSTOM_OUTPUTS: ExportOutputSpec[] = [
  { format: 'png', sizes: [squareSize(512)] },
]

export const EXPORT_PRESETS: Record<Exclude<ExportPresetId, 'custom'>, ExportPreset> = {
  preset1: {
    id: 'preset1',
    label: '预设1',
    description: 'ICO 16–256 · ICNS 16–1024 · PNG 1024',
    outputs: [
      { format: 'ico', sizes: squareSizes([16, 32, 48, 64, 128, 256]) },
      { format: 'icns', sizes: squareSizes([16, 32, 64, 128, 256, 512, 1024]) },
      { format: 'png', sizes: [squareSize(1024)] },
    ],
  },
  preset2: {
    id: 'preset2',
    label: '预设2',
    description: 'PNG · 1024 / 512',
    outputs: [{ format: 'png', sizes: squareSizes([1024, 512]) }],
  },
  preset3: {
    id: 'preset3',
    label: '预设3',
    description: 'SVG 512 · ICO 16/32/48 · PNG 512/192/180',
    outputs: [
      { format: 'svg', sizes: [squareSize(512)] },
      { format: 'ico', sizes: squareSizes([16, 32, 48]) },
      { format: 'png', sizes: squareSizes([512, 192, 180]) },
    ],
  },
}

export const BUILTIN_PRESET_IDS = Object.keys(EXPORT_PRESETS) as Exclude<ExportPresetId, 'custom'>[]

export function isBuiltinPresetId(presetId: string): presetId is Exclude<ExportPresetId, 'custom'> {
  return presetId in EXPORT_PRESETS
}

export function resolveExportPreset(presetId: ExportPresetId): Pick<ExportPreset, 'outputs'> {
  if (presetId === 'custom') {
    throw new Error('resolveExportPreset does not apply to custom preset')
  }

  const preset = EXPORT_PRESETS[presetId]
  return {
    outputs: preset.outputs.map((output) => ({
      format: output.format,
      sizes: output.sizes.map((size) => ({ ...size })),
    })),
  }
}

export function defaultOutputSpec(format: ExportFormat): ExportOutputSpec {
  switch (format) {
    case 'ico':
      return { format, sizes: squareSizes(DEFAULT_ICO_EMBED_SIZES) }
    case 'icns':
      return { format, sizes: [squareSize(1024)] }
    case 'svg':
      return { format, sizes: [squareSize(512)] }
    default:
      return { format, sizes: [squareSize(512)] }
  }
}

export function getOutputFormats(outputs: ExportOutputSpec[]): ExportFormat[] {
  return outputs.map((output) => output.format)
}

const BUNDLE_FORMATS: ExportFormat[] = ['svg', 'ico', 'icns']

export function isBundleFormat(format: ExportFormat): boolean {
  return BUNDLE_FORMATS.includes(format)
}

export function countOutputFiles(outputs: ExportOutputSpec[]): number {
  return outputs.reduce((count, output) => {
    if (isBundleFormat(output.format)) {
      return count + 1
    }

    return count + output.sizes.length
  }, 0)
}

export function createOutputsFromFormats(formats: ExportFormat[]): ExportOutputSpec[] {
  return formats.map((format) => defaultOutputSpec(format))
}

export function cloneOutputs(outputs: ExportOutputSpec[]): ExportOutputSpec[] {
  return outputs.map((output) => ({
    format: output.format,
    sizes: output.sizes.map((size) => ({ ...size })),
  }))
}
