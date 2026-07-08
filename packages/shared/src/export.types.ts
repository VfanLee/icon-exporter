export type ExportFormat = 'png' | 'webp' | 'jpeg' | 'avif' | 'svg' | 'ico' | 'icns'
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

export interface ExportOutputSpec {
  format: ExportFormat
  sizes: ExportSize[]
  useOuterPadding: boolean
}

export interface ExportRenderRequest {
  svg: string
  background: ExportBackground
  outerPadding: number
  padding: number
  borderRadius: number
  fit: FitMode
  resize?: ExportResizeOptions
  transform?: ExportTransformOptions
  effects?: ExportEffectsOptions
  trim?: ExportTrimOptions
}

export interface ExportIconRequest extends ExportRenderRequest {
  filename: string
  outputs: ExportOutputSpec[]
  quality: ExportQuality
}

export interface PreviewIconRequest extends ExportRenderRequest {
  previewSize: ExportSize
  quality: ExportQuality
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
