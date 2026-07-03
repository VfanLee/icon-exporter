import { DownloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { DEFAULT_EXPORT_OPTIONS } from '@icon-forge/shared'
import { Button, message } from 'antd'
import { useState } from 'react'
import { exportIcon, validateSvg } from '../services/api'
import { useIconStore } from '../stores/iconStore'

export function ValidateSvgButton() {
  const [validating, setValidating] = useState(false)
  const svg = useIconStore((state) => state.svg)
  const setValidation = useIconStore((state) => state.setValidation)

  const handleValidate = async () => {
    setValidating(true)
    try {
      const result = await validateSvg({ svg })
      setValidation(result)
      if (result.valid) {
        message.success('SVG 校验通过')
      } else {
        message.error(result.warnings.join('；'))
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '校验失败')
    } finally {
      setValidating(false)
    }
  }

  return (
    <Button icon={<SafetyCertificateOutlined />} loading={validating} onClick={handleValidate}>
      校验 SVG
    </Button>
  )
}

export function ExportZipButton({ block = false }: { block?: boolean }) {
  const [exporting, setExporting] = useState(false)
  const buildExportRequest = useIconStore((state) => state.buildExportRequest)

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportIcon(buildExportRequest())
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${DEFAULT_EXPORT_OPTIONS.filename}-export.zip`
      link.click()
      URL.revokeObjectURL(url)
      message.success('ZIP 已下载')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '导出失败')
    } finally {
      setExporting(false)
    }
  }

  return (
    <Button type="primary" block={block} icon={<DownloadOutlined />} loading={exporting} onClick={handleExport}>
      导出 ZIP
    </Button>
  )
}
