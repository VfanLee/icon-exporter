export type ExportFormat = 'png' | 'webp' | 'jpeg' | 'avif' | 'svg'
export type FitMode = 'contain' | 'cover' | 'fill' | 'inside' | 'outside'
export type ResizePosition =
  'center' | 'top' | 'right top' | 'right' | 'right bottom' | 'bottom' | 'left bottom' | 'left' | 'left top'

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

export interface ExportResizeOptions {
  position: ResizePosition
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

export interface ExportTrimOptions {
  enabled: boolean
  threshold: number
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
  resize?: ExportResizeOptions
  transform?: ExportTransformOptions
  effects?: ExportEffectsOptions
  trim?: ExportTrimOptions
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
