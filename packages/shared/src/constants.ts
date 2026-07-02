import type { ExportFormat, ExportSize, FitMode } from './export.types';

export const DEFAULT_SIZES: ExportSize[] = [
  { width: 16, height: 16 },
  { width: 24, height: 24 },
  { width: 32, height: 32 },
  { width: 64, height: 64 },
  { width: 128, height: 128 },
  { width: 256, height: 256 },
  { width: 512, height: 512 },
];

export const EXPORT_FORMATS: ExportFormat[] = ['png', 'webp', 'jpeg', 'svg'];
export const FIT_MODES: FitMode[] = ['contain', 'cover', 'fill'];

export const SVG_MAX_BYTES = 1024 * 1024;
export const MAX_EXPORT_SIZE = 2048;
export const MAX_SIZE_COUNT = 20;
export const MAX_FORMAT_COUNT = 4;
export const MAX_OUTPUT_FILE_COUNT = 40;

export const DEFAULT_EXPORT_OPTIONS = {
  filename: 'icon',
  sizes: DEFAULT_SIZES,
  formats: ['png'] satisfies ExportFormat[],
  background: {
    transparent: true,
    color: '#ffffff',
  },
  padding: 0,
  fit: 'contain' satisfies FitMode,
  quality: {
    webp: 90,
    jpeg: 90,
  },
};
