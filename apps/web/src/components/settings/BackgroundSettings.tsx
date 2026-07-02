import { Checkbox, ColorPicker, Space, Typography } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function BackgroundSettings() {
  const store = useIconStore()

  return (
    <>
      <SettingField hint="容器整体背景；勾选后 PNG / WebP 导出透明">
        <Checkbox checked={store.transparent} onChange={(event) => store.setTransparent(event.target.checked)}>
          PNG / WebP 容器透明
        </Checkbox>
      </SettingField>

      <SettingField label="容器背景色" hint={store.transparent ? 'JPEG 导出时会用此颜色铺底' : '填充整个导出容器'}>
        <Space>
          <ColorPicker
            value={store.backgroundColor}
            disabled={store.transparent}
            onChange={(color: Color) => store.setBackgroundColor(color.toHexString())}
          />
          <Typography.Text code type={store.transparent ? 'secondary' : undefined}>
            {store.backgroundColor}
          </Typography.Text>
        </Space>
      </SettingField>
    </>
  )
}
