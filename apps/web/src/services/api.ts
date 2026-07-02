import type { ExportIconRequest, ValidateSvgRequest, ValidateSvgResponse } from '@icon-exporter/shared'

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

  return response.blob()
}
