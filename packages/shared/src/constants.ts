import type {
  ExportEffectsOptions,
  ExportFormat,
  ExportResizeOptions,
  ExportTransformOptions,
  ExportTrimOptions,
  FitMode,
  ResizePosition,
} from './export.types'
import { DEFAULT_CUSTOM_OUTPUTS } from './export-presets'

export const EXPORT_FORMATS: ExportFormat[] = ['png', 'webp', 'jpeg', 'avif', 'svg', 'ico', 'icns']
export const FIT_MODES: FitMode[] = ['contain', 'cover', 'fill', 'inside', 'outside']
export const RESIZE_POSITIONS: ResizePosition[] = [
  'center',
  'top',
  'right top',
  'right',
  'right bottom',
  'bottom',
  'left bottom',
  'left',
  'left top',
]

export const SVG_MAX_BYTES = 1024 * 1024
export const MAX_EXPORT_SIZE = 2048
export const MAX_SIZE_COUNT = 20
export const MAX_FORMAT_COUNT = 7
export const MAX_OUTPUT_FILE_COUNT = 40

export const RASTER_DENSITY = 384

export const DEFAULT_RESIZE_OPTIONS: ExportResizeOptions = {
  position: 'center',
}

export const DEFAULT_TRANSFORM_OPTIONS: ExportTransformOptions = {
  rotate: 0,
  flip: false,
  flop: false,
}

export const DEFAULT_EFFECTS_OPTIONS: ExportEffectsOptions = {
  sharpen: { enabled: false, sigma: 1 },
  blur: 0,
  greyscale: false,
  tint: null,
  negate: false,
  modulate: { brightness: 1, saturation: 1, hue: 0 },
  gamma: 1,
  normalise: false,
}

export const DEFAULT_TRIM_OPTIONS: ExportTrimOptions = {
  enabled: false,
  threshold: 10,
}

export const DEFAULT_EXPORT_OPTIONS = {
  filename: 'icon',
  outputs: DEFAULT_CUSTOM_OUTPUTS,
  background: {
    transparent: false,
    color: '#ffffff',
  },
  padding: 0.12,
  borderRadius: 0.22,
  fit: 'contain' as FitMode,
  quality: {
    webp: 90,
    jpeg: 90,
    avif: 50,
  },
  resize: DEFAULT_RESIZE_OPTIONS,
  transform: DEFAULT_TRANSFORM_OPTIONS,
  effects: DEFAULT_EFFECTS_OPTIONS,
  trim: DEFAULT_TRIM_OPTIONS,
}
