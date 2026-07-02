export type ExportFormat = 'png' | 'webp' | 'jpeg' | 'svg';
export type FitMode = 'contain' | 'cover' | 'fill';

export interface ExportSize {
  width: number;
  height: number;
}

export interface ExportBackground {
  transparent: boolean;
  color: string;
}

export interface ExportQuality {
  webp: number;
  jpeg: number;
}

export interface ExportIconRequest {
  svg: string;
  filename: string;
  sizes: ExportSize[];
  formats: ExportFormat[];
  background: ExportBackground;
  padding: number;
  fit: FitMode;
  quality: ExportQuality;
}

export interface ValidateSvgRequest {
  svg: string;
}

export interface ValidateSvgResponse {
  valid: boolean;
  width?: number;
  height?: number;
  viewBox?: string;
  warnings: string[];
  sanitizedSvg?: string;
}
