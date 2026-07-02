import { Checkbox } from 'antd'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function AdvancedSettings() {
  const store = useIconStore()

  return (
    <>
      <SettingField hint="ensureAlpha()">
        <Checkbox checked={store.ensureAlpha} onChange={(event) => store.setEnsureAlpha(event.target.checked)}>
          确保 alpha 通道
        </Checkbox>
      </SettingField>

      <SettingField hint="removeAlpha()">
        <Checkbox checked={store.removeAlpha} onChange={(event) => store.setRemoveAlpha(event.target.checked)}>
          移除 alpha 通道
        </Checkbox>
      </SettingField>

      <SettingField hint="withMetadata()">
        <Checkbox checked={store.stripMetadata} onChange={(event) => store.setStripMetadata(event.target.checked)}>
          移除元数据
        </Checkbox>
      </SettingField>
    </>
  )
}
