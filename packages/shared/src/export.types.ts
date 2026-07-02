export type ExportFormat = 'png' | 'webp' | 'jpeg' | 'avif' | 'svg'
export type FitMode = 'contain' | 'cover' | 'fill' | 'inside' | 'outside'
export type ResizePosition =
  | 'center'
  | 'top'
  | 'right top'
  | 'right'
  | 'right bottom'
  | 'bottom'
  | 'left bottom'
  | 'left'
  | 'left top'
export type ResizeKernel = 'nearest' | 'linear' | 'cubic' | 'lanczos2' | 'lanczos3' | 'mitchell'

export interface ExportSize {
  width: number
  height: number
}

export interface ExportBackground {
  transparent: boolean
  color: string
}

export interface ExportQuality {
  webp: number
  jpeg: number
  avif: number
}

export interface ExportRasterOptions {
  density: number
  limitInputPixels: number
}

export interface ExportResizeOptions {
  position: ResizePosition
  kernel: ResizeKernel
  withoutEnlargement: boolean
}

export interface ExportTransformOptions {
  rotate: number
  flip: boolean
  flop: boolean
}

export interface ExportSharpenOptions {
  enabled: boolean
  sigma: number
}

export interface ExportModulateOptions {
  brightness: number
  saturation: number
  hue: number
}

export interface ExportEffectsOptions {
  sharpen: ExportSharpenOptions
  blur: number
  greyscale: boolean
  tint: string | null
  negate: boolean
  modulate: ExportModulateOptions
  gamma: number
  normalise: boolean
}

export interface ExportAlphaOptions {
  ensureAlpha: boolean
  removeAlpha: boolean
}

export interface ExportTrimOptions {
  enabled: boolean
  threshold: number
}

export interface ExportPngOptions {
  compressionLevel: number
  palette: boolean
  effort: number
}

export interface ExportWebpOptions {
  lossless: boolean
  nearLossless: boolean
  effort: number
  smartSubsample: boolean
}

export interface ExportJpegOptions {
  progressive: boolean
  mozjpeg: boolean
  chromaSubsampling: string
}

export interface ExportAvifOptions {
  lossless: boolean
  effort: number
}

export interface ExportMetadataOptions {
  strip: boolean
}

export interface ExportIconRequest {
  svg: string
  filename: string
  sizes: ExportSize[]
  formats: ExportFormat[]
  background: ExportBackground
  padding: number
  borderRadius: number
  fit: FitMode
  quality: ExportQuality
  raster?: ExportRasterOptions
  resize?: ExportResizeOptions
  transform?: ExportTransformOptions
  effects?: ExportEffectsOptions
  alpha?: ExportAlphaOptions
  trim?: ExportTrimOptions
  png?: ExportPngOptions
  webp?: ExportWebpOptions
  jpeg?: ExportJpegOptions
  avif?: ExportAvifOptions
  metadata?: ExportMetadataOptions
}

export interface PreviewIconRequest extends ExportIconRequest {
  previewSize: ExportSize
}

export interface ValidateSvgRequest {
  svg: string
}

export interface ValidateSvgResponse {
  valid: boolean
  width?: number
  height?: number
  viewBox?: string
  warnings: string[]
  sanitizedSvg?: string
}
