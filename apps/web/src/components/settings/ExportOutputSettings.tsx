import { Alert, InputNumber } from 'antd'
import { useExportFormats, useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'
import { ExportOutputsEditor } from './ExportOutputsEditor'

export function ExportScopeAlert() {
  return (
    <Alert
      type="info"
      showIcon
      className="settings-panel-alert"
      title="以下设置仅影响点击「导出 ZIP」时的输出，不会改变左侧预览画面。"
    />
  )
}

export function ExportQualitySettings() {
  const formats = useExportFormats()
  const webpQuality = useIconStore((state) => state.webpQuality)
  const jpegQuality = useIconStore((state) => state.jpegQuality)
  const avifQuality = useIconStore((state) => state.avifQuality)
  const setWebpQuality = useIconStore((state) => state.setWebpQuality)
  const setJpegQuality = useIconStore((state) => state.setJpegQuality)
  const setAvifQuality = useIconStore((state) => state.setAvifQuality)
  const hasQualityOption = formats.includes('webp') || formats.includes('jpeg') || formats.includes('avif')

  if (!hasQualityOption) {
    return null
  }

  return (
    <>
      {formats.includes('webp') ? (
        <SettingField label="WebP 质量">
          <InputNumber
            min={1}
            max={100}
            value={webpQuality}
            onChange={(value) => setWebpQuality(value ?? 90)}
            style={{ width: '100%' }}
          />
        </SettingField>
      ) : null}

      {formats.includes('jpeg') ? (
        <SettingField label="JPEG 质量">
          <InputNumber
            min={1}
            max={100}
            value={jpegQuality}
            onChange={(value) => setJpegQuality(value ?? 90)}
            style={{ width: '100%' }}
          />
        </SettingField>
      ) : null}

      {formats.includes('avif') ? (
        <SettingField label="AVIF 质量">
          <InputNumber
            min={1}
            max={100}
            value={avifQuality}
            onChange={(value) => setAvifQuality(value ?? 50)}
            style={{ width: '100%' }}
          />
        </SettingField>
      ) : null}
    </>
  )
}

export { ExportOutputsEditor }
