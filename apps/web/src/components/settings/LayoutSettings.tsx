import { Checkbox, Select, Slider } from 'antd'
import { type FitMode } from '@icon-exporter/shared'
import { fitModeOptions, positionOptions } from '../../constants/labels'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function LayoutSettings() {
  const store = useIconStore()

  return (
    <>
      <SettingField label="适应模式" hint="resize({ fit })">
        <Select
          value={store.fit}
          options={fitModeOptions()}
          onChange={(fit) => store.setFit(fit as FitMode)}
        />
      </SettingField>

      <SettingField label="对齐位置" hint="resize({ position })">
        <Select value={store.resizePosition} options={positionOptions()} onChange={store.setResizePosition} />
      </SettingField>

      <SettingField
        label={`内边距（${Math.round(store.padding * 100)}%）`}
        hint="SVG 内容与画布边缘的间距（绿框与红框之间）"
      >
        <Slider min={0} max={0.5} step={0.01} value={store.padding} onChange={store.setPadding} />
      </SettingField>

      <SettingField
        label={`圆角（${Math.round(store.borderRadius * 100)}%）`}
        hint="画布外框圆角（红色区域四角）"
      >
        <Slider min={0} max={0.5} step={0.01} value={store.borderRadius} onChange={store.setBorderRadius} />
      </SettingField>

      <SettingField hint="resize({ withoutEnlargement })">
        <Checkbox checked={store.withoutEnlargement} onChange={(event) => store.setWithoutEnlargement(event.target.checked)}>
          禁止放大
        </Checkbox>
      </SettingField>
    </>
  )
}
