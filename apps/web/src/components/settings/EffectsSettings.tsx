import { Checkbox, ColorPicker, Slider, Space, Typography } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function EffectsSettings() {
  const store = useIconStore()

  return (
    <>
      <SettingField>
        <Checkbox checked={store.sharpenEnabled} onChange={(event) => store.setSharpenEnabled(event.target.checked)}>
          锐化
        </Checkbox>
      </SettingField>

      {store.sharpenEnabled ? (
        <SettingField label="锐化强度">
          <Slider min={0.3} max={10} step={0.1} value={store.sharpenSigma} onChange={store.setSharpenSigma} />
        </SettingField>
      ) : null}

      <SettingField label="模糊">
        <Slider min={0} max={20} step={0.1} value={store.blur} onChange={store.setBlur} />
      </SettingField>

      <SettingField>
        <Checkbox checked={store.greyscale} onChange={(event) => store.setGreyscale(event.target.checked)}>
          灰度
        </Checkbox>
      </SettingField>

      <SettingField>
        <Checkbox checked={store.negate} onChange={(event) => store.setNegate(event.target.checked)}>
          反色
        </Checkbox>
      </SettingField>

      <SettingField label="着色">
        <Space wrap>
          <ColorPicker
            value={store.tint ?? '#ffffff'}
            onChange={(color: Color) => store.setTint(color.toHexString())}
          />
          <Checkbox checked={store.tint !== null} onChange={(event) => store.setTint(event.target.checked ? '#ffffff' : null)}>
            启用着色
          </Checkbox>
          {store.tint ? <Typography.Text code>{store.tint}</Typography.Text> : null}
        </Space>
      </SettingField>

      <SettingField label={`亮度（${store.modulateBrightness}）`}>
        <Slider min={0} max={3} step={0.05} value={store.modulateBrightness} onChange={store.setModulateBrightness} />
      </SettingField>

      <SettingField label={`饱和度（${store.modulateSaturation}）`}>
        <Slider min={0} max={3} step={0.05} value={store.modulateSaturation} onChange={store.setModulateSaturation} />
      </SettingField>

      <SettingField label={`色相（${store.modulateHue}°）`}>
        <Slider min={0} max={360} step={1} value={store.modulateHue} onChange={store.setModulateHue} />
      </SettingField>

      <SettingField label={`伽马（${store.gamma}）`}>
        <Slider min={1} max={3} step={0.05} value={store.gamma} onChange={store.setGamma} />
      </SettingField>

      <SettingField>
        <Checkbox checked={store.normalise} onChange={(event) => store.setNormalise(event.target.checked)}>
          自动均衡
        </Checkbox>
      </SettingField>
    </>
  )
}
