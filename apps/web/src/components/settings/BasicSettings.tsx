import { Checkbox, Input } from 'antd'
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

      <SettingField label="格式" hint="sharp().png() / webp() / jpeg() / avif()">
        <Checkbox.Group
          options={EXPORT_FORMATS.map((format) => ({
            label: format.toUpperCase(),
            value: format,
          }))}
          value={store.formats}
          onChange={(formats) => store.setFormats(formats as ExportFormat[])}
        />
      </SettingField>

      <SettingField label="画布尺寸" hint="导出图片整体宽高（含背景与内边距，即红色区域）">
        <SizeListEditor />
      </SettingField>
    </>
  )
}
