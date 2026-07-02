import { create } from 'zustand'
import {
  DEFAULT_EFFECTS_OPTIONS,
  DEFAULT_EXPORT_OPTIONS,
  DEFAULT_RESIZE_OPTIONS,
  DEFAULT_SIZES,
  DEFAULT_TRANSFORM_OPTIONS,
  DEFAULT_TRIM_OPTIONS,
  type ExportFormat,
  type ExportIconRequest,
  type FitMode,
  type PreviewIconRequest,
  type ExportSize,
  type ValidateSvgResponse,
} from '@icon-forge/shared'

const SAMPLE_SVG = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <circle cx="64" cy="64" r="48" fill="#8c8c8c"/>
  <circle cx="48" cy="54" r="6" fill="#ffffff"/>
  <circle cx="80" cy="54" r="6" fill="#ffffff"/>
  <path d="M44 78c8 12 32 12 40 0" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
</svg>`

const DEFAULT_PREVIEW_SIZE: ExportSize = { width: 512, height: 512 }

interface IconState {
  svg: string
  filename: string
  sizes: ExportSize[]
  formats: ExportFormat[]
  transparent: boolean
  backgroundColor: string
  padding: number
  borderRadius: number
  fit: FitMode
  webpQuality: number
  jpegQuality: number
  avifQuality: number
  previewSize: ExportSize
  resizePosition: (typeof DEFAULT_RESIZE_OPTIONS)['position']
  rotate: number
  flip: boolean
  flop: boolean
  sharpenEnabled: boolean
  sharpenSigma: number
  blur: number
  greyscale: boolean
  tint: string | null
  negate: boolean
  modulateBrightness: number
  modulateSaturation: number
  modulateHue: number
  gamma: number
  normalise: boolean
  trimEnabled: boolean
  trimThreshold: number
  validation?: ValidateSvgResponse
  setSvg: (svg: string) => void
  setFilename: (filename: string) => void
  setSizes: (sizes: ExportSize[]) => void
  setFormats: (formats: ExportFormat[]) => void
  setTransparent: (transparent: boolean) => void
  setBackgroundColor: (color: string) => void
  setPadding: (padding: number) => void
  setBorderRadius: (borderRadius: number) => void
  setFit: (fit: FitMode) => void
  setWebpQuality: (quality: number) => void
  setJpegQuality: (quality: number) => void
  setAvifQuality: (quality: number) => void
  setPreviewSize: (size: ExportSize) => void
  setResizePosition: (position: IconState['resizePosition']) => void
  setRotate: (rotate: number) => void
  setFlip: (flip: boolean) => void
  setFlop: (flop: boolean) => void
  setSharpenEnabled: (enabled: boolean) => void
  setSharpenSigma: (sigma: number) => void
  setBlur: (blur: number) => void
  setGreyscale: (greyscale: boolean) => void
  setTint: (tint: string | null) => void
  setNegate: (negate: boolean) => void
  setModulateBrightness: (value: number) => void
  setModulateSaturation: (value: number) => void
  setModulateHue: (value: number) => void
  setGamma: (gamma: number) => void
  setNormalise: (normalise: boolean) => void
  setTrimEnabled: (enabled: boolean) => void
  setTrimThreshold: (threshold: number) => void
  setValidation: (validation?: ValidateSvgResponse) => void
  buildExportRequest: () => ExportIconRequest
  buildPreviewRequest: () => PreviewIconRequest
}

function buildRenderOptions(
  state: IconState,
): Pick<
  ExportIconRequest,
  'svg' | 'background' | 'padding' | 'borderRadius' | 'fit' | 'resize' | 'transform' | 'effects' | 'trim'
> {
  return {
    svg: state.svg,
    background: {
      transparent: state.transparent,
      color: state.backgroundColor,
    },
    padding: state.padding,
    borderRadius: state.borderRadius,
    fit: state.fit,
    resize: {
      position: state.resizePosition,
    },
    transform: {
      rotate: state.rotate,
      flip: state.flip,
      flop: state.flop,
    },
    effects: {
      sharpen: { enabled: state.sharpenEnabled, sigma: state.sharpenSigma },
      blur: state.blur,
      greyscale: state.greyscale,
      tint: state.tint,
      negate: state.negate,
      modulate: {
        brightness: state.modulateBrightness,
        saturation: state.modulateSaturation,
        hue: state.modulateHue,
      },
      gamma: state.gamma,
      normalise: state.normalise,
    },
    trim: {
      enabled: state.trimEnabled,
      threshold: state.trimThreshold,
    },
  }
}

export const useIconStore = create<IconState>((set, get) => ({
  svg: SAMPLE_SVG,
  filename: DEFAULT_EXPORT_OPTIONS.filename,
  sizes: DEFAULT_SIZES,
  formats: ['png'],
  transparent: DEFAULT_EXPORT_OPTIONS.background.transparent,
  backgroundColor: DEFAULT_EXPORT_OPTIONS.background.color,
  padding: DEFAULT_EXPORT_OPTIONS.padding,
  borderRadius: DEFAULT_EXPORT_OPTIONS.borderRadius,
  fit: DEFAULT_EXPORT_OPTIONS.fit,
  webpQuality: DEFAULT_EXPORT_OPTIONS.quality.webp,
  jpegQuality: DEFAULT_EXPORT_OPTIONS.quality.jpeg,
  avifQuality: DEFAULT_EXPORT_OPTIONS.quality.avif,
  previewSize: DEFAULT_PREVIEW_SIZE,
  resizePosition: DEFAULT_RESIZE_OPTIONS.position,
  rotate: DEFAULT_TRANSFORM_OPTIONS.rotate,
  flip: DEFAULT_TRANSFORM_OPTIONS.flip,
  flop: DEFAULT_TRANSFORM_OPTIONS.flop,
  sharpenEnabled: DEFAULT_EFFECTS_OPTIONS.sharpen.enabled,
  sharpenSigma: DEFAULT_EFFECTS_OPTIONS.sharpen.sigma,
  blur: DEFAULT_EFFECTS_OPTIONS.blur,
  greyscale: DEFAULT_EFFECTS_OPTIONS.greyscale,
  tint: DEFAULT_EFFECTS_OPTIONS.tint,
  negate: DEFAULT_EFFECTS_OPTIONS.negate,
  modulateBrightness: DEFAULT_EFFECTS_OPTIONS.modulate.brightness,
  modulateSaturation: DEFAULT_EFFECTS_OPTIONS.modulate.saturation,
  modulateHue: DEFAULT_EFFECTS_OPTIONS.modulate.hue,
  gamma: DEFAULT_EFFECTS_OPTIONS.gamma,
  normalise: DEFAULT_EFFECTS_OPTIONS.normalise,
  trimEnabled: DEFAULT_TRIM_OPTIONS.enabled,
  trimThreshold: DEFAULT_TRIM_OPTIONS.threshold,
  setSvg: (svg) => set({ svg }),
  setFilename: (filename) => set({ filename }),
  setSizes: (sizes) => set({ sizes }),
  setFormats: (formats) => set({ formats }),
  setTransparent: (transparent) => set({ transparent }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setPadding: (padding) => set({ padding }),
  setBorderRadius: (borderRadius) => set({ borderRadius }),
  setFit: (fit) => set({ fit }),
  setWebpQuality: (webpQuality) => set({ webpQuality }),
  setJpegQuality: (jpegQuality) => set({ jpegQuality }),
  setAvifQuality: (avifQuality) => set({ avifQuality }),
  setPreviewSize: (previewSize) => set({ previewSize }),
  setResizePosition: (resizePosition) => set({ resizePosition }),
  setRotate: (rotate) => set({ rotate }),
  setFlip: (flip) => set({ flip }),
  setFlop: (flop) => set({ flop }),
  setSharpenEnabled: (sharpenEnabled) => set({ sharpenEnabled }),
  setSharpenSigma: (sharpenSigma) => set({ sharpenSigma }),
  setBlur: (blur) => set({ blur }),
  setGreyscale: (greyscale) => set({ greyscale }),
  setTint: (tint) => set({ tint }),
  setNegate: (negate) => set({ negate }),
  setModulateBrightness: (modulateBrightness) => set({ modulateBrightness }),
  setModulateSaturation: (modulateSaturation) => set({ modulateSaturation }),
  setModulateHue: (modulateHue) => set({ modulateHue }),
  setGamma: (gamma) => set({ gamma }),
  setNormalise: (normalise) => set({ normalise }),
  setTrimEnabled: (trimEnabled) => set({ trimEnabled }),
  setTrimThreshold: (trimThreshold) => set({ trimThreshold }),
  setValidation: (validation) => set({ validation }),
  buildExportRequest: () => {
    const state = get()

    return {
      ...buildRenderOptions(state),
      filename: state.filename || DEFAULT_EXPORT_OPTIONS.filename,
      sizes: state.sizes,
      formats: state.formats,
      quality: {
        webp: state.webpQuality,
        jpeg: state.jpegQuality,
        avif: state.avifQuality,
      },
    }
  },
  buildPreviewRequest: () => {
    const state = get()

    return {
      ...buildRenderOptions(state),
      filename: DEFAULT_EXPORT_OPTIONS.filename,
      sizes: [state.previewSize],
      formats: ['png'],
      quality: DEFAULT_EXPORT_OPTIONS.quality,
      previewSize: state.previewSize,
    }
  },
}))
