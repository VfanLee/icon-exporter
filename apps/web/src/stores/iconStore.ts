import { create } from 'zustand'
import {
  DEFAULT_EXPORT_OPTIONS,
  DEFAULT_SIZES,
  type ExportFormat,
  type ExportIconRequest,
  type ExportSize,
  type FitMode,
  type ValidateSvgResponse,
} from '@icon-exporter/shared'

const SAMPLE_SVG = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="28" fill="#1677ff"/>
  <path d="M36 68L56 88L94 40" fill="none" stroke="white" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

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
  setValidation: (validation?: ValidateSvgResponse) => void
  buildExportRequest: () => ExportIconRequest
}

export const useIconStore = create<IconState>((set, get) => ({
  svg: SAMPLE_SVG,
  filename: DEFAULT_EXPORT_OPTIONS.filename,
  sizes: DEFAULT_SIZES,
  formats: ['png'],
  transparent: true,
  backgroundColor: '#ffffff',
  padding: 0,
  borderRadius: 0,
  fit: 'contain',
  webpQuality: 90,
  jpegQuality: 90,
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
  setValidation: (validation) => set({ validation }),
  buildExportRequest: () => {
    const state = get()

    return {
      svg: state.svg,
      filename: state.filename || DEFAULT_EXPORT_OPTIONS.filename,
      sizes: state.sizes,
      formats: state.formats,
      background: {
        transparent: state.transparent,
        color: state.backgroundColor,
      },
      padding: state.padding,
      borderRadius: state.borderRadius,
      fit: state.fit,
      quality: {
        webp: state.webpQuality,
        jpeg: state.jpegQuality,
      },
    }
  },
}))
