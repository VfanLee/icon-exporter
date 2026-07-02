import { FIT_MODES, RESIZE_POSITIONS, type FitMode, type ResizePosition } from '@icon-exporter/shared'

export const FIT_MODE_LABELS: Record<FitMode, string> = {
  contain: 'contain（适应）',
  cover: 'cover（覆盖）',
  fill: 'fill（填充）',
  inside: 'inside（缩小适应）',
  outside: 'outside（放大适应）',
}

export const POSITION_LABELS: Record<ResizePosition, string> = {
  center: '居中',
  top: '顶部',
  'right top': '右上',
  right: '右侧',
  'right bottom': '右下',
  bottom: '底部',
  'left bottom': '左下',
  left: '左侧',
  'left top': '左上',
}

export function fitModeOptions() {
  return FIT_MODES.map((fit) => ({ label: FIT_MODE_LABELS[fit], value: fit }))
}

export function positionOptions() {
  return RESIZE_POSITIONS.map((position) => ({ label: POSITION_LABELS[position], value: position }))
}
