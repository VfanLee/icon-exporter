import { Checkbox, Slider } from 'antd'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function TransformSettings() {
  const store = useIconStore()

  return (
    <>
      <SettingField label={`旋转（${store.rotate}°）`}>
        <Slider min={0} max={360} step={1} value={store.rotate} onChange={store.setRotate} />
      </SettingField>

      <SettingField>
        <Checkbox checked={store.flip} onChange={(event) => store.setFlip(event.target.checked)}>
          垂直翻转
        </Checkbox>
      </SettingField>

      <SettingField>
        <Checkbox checked={store.flop} onChange={(event) => store.setFlop(event.target.checked)}>
          水平翻转
        </Checkbox>
      </SettingField>
    </>
  )
}
