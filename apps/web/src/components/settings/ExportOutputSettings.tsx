import { Alert, Checkbox, Input, InputNumber } from 'antd'
import { EXPORT_FORMATS, type ExportFormat } from '@icon-exporter/shared'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'
import { SizeListEditor } from '../SizeListEditor'

export function ExportScopeAlert() {
  return (
    <Alert
      type="info"
      showIcon
      className="settings-panel-alert"
      message="以下设置仅影响点击「导出 ZIP」时的输出，不会改变左侧预览画面。"
    />
  )
}

export function ExportFormatSettings() {
  const store = useIconStore()

  return (
    <>
      <SettingField label="文件名前缀">
        <Input value={store.filename} onChange={(event) => store.setFilename(event.target.value)} placeholder="icon" />
      </SettingField>

      <SettingField label="输出格式">
        <Checkbox.Group
          options={EXPORT_FORMATS.map((format) => ({
            label: format.toUpperCase(),
            value: format,
          }))}
          value={store.formats}
          onChange={(formats) => store.setFormats(formats as ExportFormat[])}
        />
      </SettingField>

      {store.formats.includes('svg') ? (
        <Alert type="warning" showIcon message="SVG 导出原始矢量文件，不含背景、内边距与圆角合成效果" />
      ) : null}
    </>
  )
}

export function ExportSizeSettings() {
  return (
    <SettingField label="导出尺寸" hint="ZIP 内生成的图片尺寸列表">
      <SizeListEditor />
    </SettingField>
  )
}

export function ExportQualitySettings() {
  const store = useIconStore()
  const hasQualityOption =
    store.formats.includes('webp') || store.formats.includes('jpeg') || store.formats.includes('avif')

  if (!hasQualityOption) {
    return null
  }

  return (
    <>
      {store.formats.includes('webp') ? (
        <SettingField label="WebP 质量">
          <InputNumber
            min={1}
            max={100}
            value={store.webpQuality}
            onChange={(value) => store.setWebpQuality(value ?? 90)}
            style={{ width: '100%' }}
          />
        </SettingField>
      ) : null}

      {store.formats.includes('jpeg') ? (
        <SettingField label="JPEG 质量">
          <InputNumber
            min={1}
            max={100}
            value={store.jpegQuality}
            onChange={(value) => store.setJpegQuality(value ?? 90)}
            style={{ width: '100%' }}
          />
        </SettingField>
      ) : null}

      {store.formats.includes('avif') ? (
        <SettingField label="AVIF 质量">
          <InputNumber
            min={1}
            max={100}
            value={store.avifQuality}
            onChange={(value) => store.setAvifQuality(value ?? 50)}
            style={{ width: '100%' }}
          />
        </SettingField>
      ) : null}
    </>
  )
}
