import type {
  ExportAvifOptions,
  ExportEffectsOptions,
  ExportFormat,
  ExportJpegOptions,
  ExportMetadataOptions,
  ExportPngOptions,
  ExportRasterOptions,
  ExportResizeOptions,
  ExportSize,
  ExportTransformOptions,
  ExportTrimOptions,
  ExportWebpOptions,
  FitMode,
  ResizeKernel,
  ResizePosition,
} from './export.types'

export const DEFAULT_SIZES: ExportSize[] = [
  { width: 16, height: 16 },
  { width: 24, height: 24 },
  { width: 32, height: 32 },
  { width: 64, height: 64 },
  { width: 128, height: 128 },
  { width: 256, height: 256 },
  { width: 512, height: 512 },
]

export const EXPORT_FORMATS: ExportFormat[] = ['png', 'webp', 'jpeg', 'avif', 'svg']
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
export const RESIZE_KERNELS: ResizeKernel[] = [
  'nearest',
  'linear',
  'cubic',
  'lanczos2',
  'lanczos3',
  'mitchell',
]
export const JPEG_CHROMA_SUBSAMPLINGS = ['4:4:4', '4:2:0'] as const

export const SVG_MAX_BYTES = 1024 * 1024
export const MAX_EXPORT_SIZE = 2048
export const MAX_SIZE_COUNT = 20
export const MAX_FORMAT_COUNT = 5
export const MAX_OUTPUT_FILE_COUNT = 40

export const DEFAULT_RASTER_OPTIONS: ExportRasterOptions = {
  density: 384,
  limitInputPixels: 268_402_689,
}

export const DEFAULT_RESIZE_OPTIONS: ExportResizeOptions = {
  position: 'center',
  kernel: 'lanczos3',
  withoutEnlargement: false,
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

export const DEFAULT_PNG_OPTIONS: ExportPngOptions = {
  compressionLevel: 6,
  palette: false,
  effort: 7,
}

export const DEFAULT_WEBP_OPTIONS: ExportWebpOptions = {
  lossless: false,
  nearLossless: false,
  effort: 4,
  smartSubsample: false,
}

export const DEFAULT_JPEG_OPTIONS: ExportJpegOptions = {
  progressive: false,
  mozjpeg: false,
  chromaSubsampling: '4:2:0',
}

export const DEFAULT_AVIF_OPTIONS: ExportAvifOptions = {
  lossless: false,
  effort: 4,
}

export const DEFAULT_METADATA_OPTIONS: ExportMetadataOptions = {
  strip: true,
}

export const DEFAULT_EXPORT_OPTIONS = {
  filename: 'icon',
  sizes: DEFAULT_SIZES,
  formats: ['png'] satisfies ExportFormat[],
  background: {
    transparent: true,
    color: '#ffffff',
  },
  padding: 0,
  borderRadius: 0,
  fit: 'contain' satisfies FitMode,
  quality: {
    webp: 90,
    jpeg: 90,
    avif: 50,
  },
  raster: DEFAULT_RASTER_OPTIONS,
  resize: DEFAULT_RESIZE_OPTIONS,
  transform: DEFAULT_TRANSFORM_OPTIONS,
  effects: DEFAULT_EFFECTS_OPTIONS,
  alpha: {
    ensureAlpha: false,
    removeAlpha: false,
  },
  trim: DEFAULT_TRIM_OPTIONS,
  png: DEFAULT_PNG_OPTIONS,
  webp: DEFAULT_WEBP_OPTIONS,
  jpeg: DEFAULT_JPEG_OPTIONS,
  avif: DEFAULT_AVIF_OPTIONS,
  metadata: DEFAULT_METADATA_OPTIONS,
}
