import { Alert, Flex, Segmented, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { previewIcon } from '../services/api'
import { useIconStore } from '../stores/iconStore'

type PreviewBackground = 'transparent' | 'white' | 'dark'

const BACKGROUND_OPTIONS = [
  { label: '透明格', value: 'transparent' },
  { label: '白底', value: 'white' },
  { label: '深底', value: 'dark' },
]

export function SvgPreview() {
  const validation = useIconStore((state) => state.validation)
  const [background, setBackground] = useState<PreviewBackground>('transparent')
  const [previewUrl, setPreviewUrl] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let objectUrl: string | undefined

    const fetchPreview = async () => {
      setLoading(true)
      setError(undefined)

      try {
        const blob = await previewIcon(useIconStore.getState().buildPreviewRequest())
        if (cancelled) {
          return
        }

        objectUrl = URL.createObjectURL(blob)
        setPreviewUrl((previous) => {
          if (previous) {
            URL.revokeObjectURL(previous)
          }
          return objectUrl
        })
      } catch (previewError) {
        if (!cancelled) {
          setError(previewError instanceof Error ? previewError.message : '预览失败')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    const schedulePreview = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        void fetchPreview()
      }, 300)
    }

    schedulePreview()
    const unsubscribe = useIconStore.subscribe(schedulePreview)

    return () => {
      cancelled = true
      clearTimeout(timer)
      unsubscribe()
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const stageClass = `preview-stage preview-${background}`

  return (
    <Flex vertical className="preview-layout full-width">
      <div className="preview-meta">
        {validation && !validation.valid ? (
          <Alert type="error" showIcon message={validation.warnings.join('；')} />
        ) : null}
        {validation?.valid ? (
          <Alert
            type="success"
            showIcon
            message={`SVG 有效${validation.viewBox ? ` · viewBox ${validation.viewBox}` : ''}`}
          />
        ) : null}
        {error ? <Alert type="error" showIcon message={error} /> : null}
      </div>

      <Flex justify="space-between" align="center" wrap="wrap" gap={12} className="preview-toolbar">
        <Segmented
          value={background}
          options={BACKGROUND_OPTIONS}
          onChange={(value) => setBackground(value as PreviewBackground)}
        />
        <Typography.Text type="secondary">预览即导出画布 · 下方背景仅用于检视透明区域</Typography.Text>
      </Flex>

      <div className={stageClass}>
        {loading && !previewUrl ? <Spin size="large" /> : null}
        {previewUrl ? (
          <div className="export-preview-canvas">
            <img src={previewUrl} alt="Sharp 预览" />
            {loading ? (
              <div className="preview-loading-overlay">
                <Spin />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Flex>
  )
}
