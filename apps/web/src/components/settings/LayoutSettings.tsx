import { QuestionCircleOutlined } from '@ant-design/icons'
import { Select, Slider, Space, Tooltip } from 'antd'
import { type FitMode } from '@icon-forge/shared'
import { fitModeOptions, positionOptions } from '../../constants/labels'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function LayoutSettings() {
  const store = useIconStore()
  const outerPaddingLabel = (
    <Space size={6}>
      <span>{`外边距（${Math.round(store.outerPadding * 100)}%）`}</span>
      <Tooltip title="除 ico 外均生效">
        <QuestionCircleOutlined style={{ color: '#8c8c8c' }} />
      </Tooltip>
    </Space>
  )

  return (
    <>
      <SettingField label="适应模式">
        <Select value={store.fit} options={fitModeOptions()} onChange={(fit) => store.setFit(fit as FitMode)} />
      </SettingField>

      <SettingField label="对齐位置">
        <Select value={store.resizePosition} options={positionOptions()} onChange={store.setResizePosition} />
      </SettingField>

      <SettingField label={outerPaddingLabel} hint="容器与最终画布边缘的透明留白">
        <Slider min={0} max={0.5} step={0.01} value={store.outerPadding} onChange={store.setOuterPadding} />
      </SettingField>

      <SettingField label={`内边距（${Math.round(store.padding * 100)}%）`} hint="图形与容器边缘的留白">
        <Slider min={0} max={0.5} step={0.01} value={store.padding} onChange={store.setPadding} />
      </SettingField>

      <SettingField label={`圆角（${Math.round(store.borderRadius * 100)}%）`} hint="容器外框圆角">
        <Slider min={0} max={0.5} step={0.01} value={store.borderRadius} onChange={store.setBorderRadius} />
      </SettingField>
    </>
  )
}
