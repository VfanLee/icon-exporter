import type {
  ExportIconRequest,
  PreviewIconRequest,
  ValidateSvgRequest,
  ValidateSvgResponse,
} from '@icon-forge/shared'

async function parseError(response: Response) {
  try {
    const body = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(body.message)) {
      return body.message.join('; ')
    }
    return body.message ?? response.statusText
  } catch {
    return response.statusText
  }
}

function isCompleteZipArchive(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  if (
    bytes.length < 22 ||
    bytes[0] !== 0x50 ||
    bytes[1] !== 0x4b ||
    bytes[2] !== 0x03 ||
    bytes[3] !== 0x04
  ) {
    return false
  }

  const maxCommentLength = 0xffff
  const minEndOffset = Math.max(0, bytes.length - maxCommentLength - 22)

  for (let index = bytes.length - 22; index >= minEndOffset; index -= 1) {
    if (
      bytes[index] === 0x50 &&
      bytes[index + 1] === 0x4b &&
      bytes[index + 2] === 0x05 &&
      bytes[index + 3] === 0x06
    ) {
      return true
    }
  }

  return false
}

export async function validateSvg(payload: ValidateSvgRequest): Promise<ValidateSvgResponse> {
  const response = await fetch('/api/icon/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return response.json() as Promise<ValidateSvgResponse>
}

export async function exportIcon(payload: ExportIconRequest) {
  const response = await fetch('/api/icon/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const contentType = response.headers.get('Content-Type') ?? ''
  if (!contentType.includes('application/zip')) {
    throw new Error('导出失败：服务端没有返回 ZIP 文件')
  }

  const buffer = await response.arrayBuffer()
  if (!isCompleteZipArchive(buffer)) {
    throw new Error('导出失败：ZIP 文件不完整，请刷新页面后重试')
  }

  return new Blob([buffer], { type: contentType })
}

export async function previewIcon(payload: PreviewIconRequest): Promise<Blob> {
  const response = await fetch('/api/icon/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return response.blob()
}
