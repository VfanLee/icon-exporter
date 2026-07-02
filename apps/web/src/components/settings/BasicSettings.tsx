import { Checkbox, Input, InputNumber } from 'antd'
import { EXPORT_FORMATS, type ExportFormat } from '@icon-exporter/shared'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'
import { SizeListEditor } from '../SizeListEditor'

export function BasicSettings() {
  const store = useIconStore()

  return (
    <>
      <SettingField label="文件名前缀">
        <Input value={store.filename} onChange={(event) => store.setFilename(event.target.value)} placeholder="icon" />
      </SettingField>

      <SettingField label="格式">
        <Checkbox.Group
          options={EXPORT_FORMATS.map((format) => ({
            label: format.toUpperCase(),
            value: format,
          }))}
          value={store.formats}
          onChange={(formats) => store.setFormats(formats as ExportFormat[])}
        />
      </SettingField>

      <SettingField label="画布尺寸" hint="导出图片整体宽高">
        <SizeListEditor />
      </SettingField>

      {store.formats.includes('webp') ? (
        <SettingField label="WebP 质量" hint="仅影响导出，预览固定为 PNG">
          <InputNumber min={1} max={100} value={store.webpQuality} onChange={(value) => store.setWebpQuality(value ?? 90)} style={{ width: '100%' }} />
        </SettingField>
      ) : null}

      {store.formats.includes('jpeg') ? (
        <SettingField label="JPEG 质量" hint="仅影响导出，预览固定为 PNG">
          <InputNumber min={1} max={100} value={store.jpegQuality} onChange={(value) => store.setJpegQuality(value ?? 90)} style={{ width: '100%' }} />
        </SettingField>
      ) : null}

      {store.formats.includes('avif') ? (
        <SettingField label="AVIF 质量" hint="仅影响导出，预览固定为 PNG">
          <InputNumber min={1} max={100} value={store.avifQuality} onChange={(value) => store.setAvifQuality(value ?? 50)} style={{ width: '100%' }} />
        </SettingField>
      ) : null}
    </>
  )
}
