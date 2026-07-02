import { Checkbox, Slider } from 'antd'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function TrimSettings() {
  const store = useIconStore()

  return (
    <>
      <SettingField hint="trim()">
        <Checkbox checked={store.trimEnabled} onChange={(event) => store.setTrimEnabled(event.target.checked)}>
          自动裁剪透明边缘
        </Checkbox>
      </SettingField>

      {store.trimEnabled ? (
        <SettingField label={`裁剪阈值（${store.trimThreshold}）`} hint="trim({ threshold })">
          <Slider min={0} max={255} step={1} value={store.trimThreshold} onChange={store.setTrimThreshold} />
        </SettingField>
      ) : null}
    </>
  )
}
