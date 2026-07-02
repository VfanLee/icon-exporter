import { Checkbox, ColorPicker, Space, Typography } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function BackgroundSettings() {
  const store = useIconStore()

  return (
    <>
      <SettingField hint="画布整体背景；勾选后 PNG / WebP 导出透明">
        <Checkbox checked={store.transparent} onChange={(event) => store.setTransparent(event.target.checked)}>
          PNG / WebP 画布透明
        </Checkbox>
      </SettingField>

      <SettingField label="画布背景色" hint="填充整个导出画布">
        <Space>
          <ColorPicker
            value={store.backgroundColor}
            onChange={(color: Color) => store.setBackgroundColor(color.toHexString())}
          />
          <Typography.Text code>{store.backgroundColor}</Typography.Text>
        </Space>
      </SettingField>
    </>
  )
}
