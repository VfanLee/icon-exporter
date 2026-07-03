import { Slider } from 'antd'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function TransformSettings() {
  const rotate = useIconStore((state) => state.rotate)
  const setRotate = useIconStore((state) => state.setRotate)

  return (
    <SettingField label={`旋转（${rotate}°）`}>
      <Slider min={0} max={360} step={1} value={rotate} onChange={setRotate} />
    </SettingField>
  )
}
