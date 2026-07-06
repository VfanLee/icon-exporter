import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import {
  DEFAULT_CUSTOM_OUTPUTS,
  DEFAULT_EFFECTS_OPTIONS,
  DEFAULT_EXPORT_OPTIONS,
  DEFAULT_RESIZE_OPTIONS,
  DEFAULT_TRANSFORM_OPTIONS,
  DEFAULT_TRIM_OPTIONS,
  EXPORT_PRESETS,
  cloneOutputs,
  createOutputsFromFormats,
  defaultOutputSpec,
  isBuiltinPresetId,
  type ExportFormat,
  type ExportIconRequest,
  type ExportOutputSpec,
  type ExportPresetId,
  type FitMode,
  type PreviewIconRequest,
  type ExportSize,
  type ValidateSvgResponse,
} from '@icon-forge/shared'
import {
  loadUserExportPresets,
  persistUserExportPresets,
  type UserExportPreset,
} from '../utils/exportPresetStorage'
import { loadCachedSvg, persistCachedSvg } from '../utils/svgSessionStorage'

const SAMPLE_SVG = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <circle cx="64" cy="64" r="48" fill="#8c8c8c"/>
  <circle cx="48" cy="54" r="6" fill="#ffffff"/>
  <circle cx="80" cy="54" r="6" fill="#ffffff"/>
  <path d="M44 78c8 12 32 12 40 0" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
</svg>`

const PREVIEW_SIZE: ExportSize = { width: 512, height: 512 }
const DEFAULT_BUILTIN_PRESET: ExportPresetId = 'preset1'

function getBuiltinPreset(presetId: Exclude<ExportPresetId, 'custom'>) {
  return EXPORT_PRESETS[presetId]
}

interface IconState {
  svg: string
  activePresetId: string
  userPresets: UserExportPreset[]
  outputs: ExportOutputSpec[]
  transparent: boolean
  backgroundColor: string
  padding: number
  borderRadius: number
  fit: FitMode
  webpQuality: number
  jpegQuality: number
  avifQuality: number
  resizePosition: (typeof DEFAULT_RESIZE_OPTIONS)['position']
  rotate: number
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
  applyExportPreset: (presetId: string) => void
  saveCurrentAsPreset: (label: string) => void
  setFormats: (formats: ExportFormat[]) => void
  setOutputSizes: (format: ExportFormat, sizes: ExportSize[]) => void
  toggleOutputSize: (format: ExportFormat, size: number) => void
  addCustomOutputSize: (format: ExportFormat, size: number) => void
  addOutputFormat: (format: ExportFormat) => void
  removeOutputFormat: (format: ExportFormat) => void
  setTransparent: (transparent: boolean) => void
  setBackgroundColor: (color: string) => void
  setPadding: (padding: number) => void
  setBorderRadius: (borderRadius: number) => void
  setFit: (fit: FitMode) => void
  setWebpQuality: (quality: number) => void
  setJpegQuality: (quality: number) => void
  setAvifQuality: (quality: number) => void
  setResizePosition: (position: IconState['resizePosition']) => void
  setRotate: (rotate: number) => void
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
      flip: false,
      flop: false,
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

function syncOutputsWithFormats(currentOutputs: ExportOutputSpec[], formats: ExportFormat[]): ExportOutputSpec[] {
  return formats.map((format) => {
    const existing = currentOutputs.find((output) => output.format === format)
    if (existing) {
      return {
        format: existing.format,
        sizes: existing.sizes.map((size) => ({ ...size })),
      }
    }

    return createOutputsFromFormats([format])[0]
  })
}

const initialBuiltinPreset = getBuiltinPreset(DEFAULT_BUILTIN_PRESET)
const initialSvg = loadCachedSvg() ?? SAMPLE_SVG

export const useIconStore = create<IconState>((set, get) => ({
  svg: initialSvg,
  activePresetId: DEFAULT_BUILTIN_PRESET,
  userPresets: loadUserExportPresets(),
  outputs: cloneOutputs(initialBuiltinPreset.outputs),
  transparent: DEFAULT_EXPORT_OPTIONS.background.transparent,
  backgroundColor: DEFAULT_EXPORT_OPTIONS.background.color,
  padding: DEFAULT_EXPORT_OPTIONS.padding,
  borderRadius: DEFAULT_EXPORT_OPTIONS.borderRadius,
  fit: DEFAULT_EXPORT_OPTIONS.fit,
  webpQuality: DEFAULT_EXPORT_OPTIONS.quality.webp,
  jpegQuality: DEFAULT_EXPORT_OPTIONS.quality.jpeg,
  avifQuality: DEFAULT_EXPORT_OPTIONS.quality.avif,
  resizePosition: DEFAULT_RESIZE_OPTIONS.position,
  rotate: DEFAULT_TRANSFORM_OPTIONS.rotate,
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
  setSvg: (svg) => {
    persistCachedSvg(svg)
    set({ svg })
  },
  applyExportPreset: (presetId) => {
    if (presetId === 'custom') {
      set({ activePresetId: 'custom' })
      return
    }

    if (isBuiltinPresetId(presetId)) {
      const preset = getBuiltinPreset(presetId)
      set({
        activePresetId: presetId,
        outputs: cloneOutputs(preset.outputs),
      })
      return
    }

    const userPreset = get().userPresets.find((preset) => preset.id === presetId)
    if (!userPreset) {
      return
    }

    set({
      activePresetId: presetId,
      outputs: cloneOutputs(userPreset.outputs),
    })
  },
  saveCurrentAsPreset: (label) => {
    const trimmed = label.trim()
    if (!trimmed) {
      throw new Error('预设名称不能为空')
    }

    const state = get()
    if (state.userPresets.some((preset) => preset.label === trimmed)) {
      throw new Error('已存在同名预设')
    }

    const preset: UserExportPreset = {
      id: crypto.randomUUID(),
      label: trimmed,
      outputs: cloneOutputs(state.outputs),
    }
    const userPresets = [...state.userPresets, preset]
    persistUserExportPresets(userPresets)
    set({ userPresets, activePresetId: preset.id })
  },
  setFormats: (formats) =>
    set((state) => {
      if (formats.length === 0) {
        return state
      }

      return {
        activePresetId: 'custom',
        outputs: syncOutputsWithFormats(state.outputs, formats),
      }
    }),
  setOutputSizes: (format, sizes) =>
    set((state) => ({
      activePresetId: 'custom',
      outputs: state.outputs.map((output) =>
        output.format === format ? { ...output, sizes: sizes.map((size) => ({ ...size })) } : output,
      ),
    })),
  toggleOutputSize: (format, size) =>
    set((state) => ({
      activePresetId: 'custom',
      outputs: state.outputs.map((output) => {
        if (output.format !== format) {
          return output
        }

        const exists = output.sizes.some((item) => item.width === size && item.height === size)
        if (exists) {
          if (output.sizes.length <= 1) {
            return output
          }

          return {
            ...output,
            sizes: output.sizes.filter((item) => !(item.width === size && item.height === size)),
          }
        }

        return {
          ...output,
          sizes: [...output.sizes, { width: size, height: size }].sort((a, b) => b.width - a.width),
        }
      }),
    })),
  addCustomOutputSize: (format, size) =>
    set((state) => ({
      activePresetId: 'custom',
      outputs: state.outputs.map((output) => {
        if (output.format !== format) {
          return output
        }

        const exists = output.sizes.some((item) => item.width === size && item.height === size)
        if (exists) {
          return output
        }

        return {
          ...output,
          sizes: [...output.sizes, { width: size, height: size }].sort((a, b) => b.width - a.width),
        }
      }),
    })),
  addOutputFormat: (format) =>
    set((state) => {
      if (state.outputs.some((output) => output.format === format)) {
        return state
      }

      return {
        activePresetId: 'custom',
        outputs: [...state.outputs, defaultOutputSpec(format)],
      }
    }),
  removeOutputFormat: (format) =>
    set((state) => {
      if (state.outputs.length <= 1) {
        return state
      }

      return {
        activePresetId: 'custom',
        outputs: state.outputs.filter((output) => output.format !== format),
      }
    }),
  setTransparent: (transparent) => set({ transparent }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setPadding: (padding) => set({ padding }),
  setBorderRadius: (borderRadius) => set({ borderRadius }),
  setFit: (fit) => set({ fit }),
  setWebpQuality: (webpQuality) => set({ webpQuality }),
  setJpegQuality: (jpegQuality) => set({ jpegQuality }),
  setAvifQuality: (avifQuality) => set({ avifQuality }),
  setResizePosition: (resizePosition) => set({ resizePosition }),
  setRotate: (rotate) => set({ rotate }),
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
      filename: DEFAULT_EXPORT_OPTIONS.filename,
      outputs: cloneOutputs(state.outputs),
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
      quality: {
        webp: state.webpQuality,
        jpeg: state.jpegQuality,
        avif: state.avifQuality,
      },
      previewSize: PREVIEW_SIZE,
    }
  },
}))

export function useExportFormats() {
  return useIconStore(useShallow((state) => state.outputs.map((output) => output.format)))
}

export { DEFAULT_CUSTOM_OUTPUTS }
