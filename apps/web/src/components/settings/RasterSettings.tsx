import { InputNumber, Select } from 'antd'
import { RESIZE_KERNELS, type ResizeKernel } from '@icon-exporter/shared'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function RasterSettings() {
  const store = useIconStore()

  return (
    <>
      <SettingField label="SVG 密度（DPI）" hint="sharp(input, { density })">
        <InputNumber
          min={72}
          max={600}
          value={store.rasterDensity}
          onChange={(value) => store.setRasterDensity(value ?? 384)}
          style={{ width: '100%' }}
        />
      </SettingField>

      <SettingField label="缩放算法" hint="resize({ kernel })">
        <Select
          value={store.resizeKernel}
          options={RESIZE_KERNELS.map((kernel) => ({ label: kernel, value: kernel }))}
          onChange={(kernel) => store.setResizeKernel(kernel as ResizeKernel)}
        />
      </SettingField>

      <SettingField label="输入像素上限" hint="sharp(input, { limitInputPixels })">
        <InputNumber
          min={1}
          value={store.rasterLimitInputPixels}
          onChange={(value) => store.setRasterLimitInputPixels(value ?? 268402689)}
          style={{ width: '100%' }}
        />
      </SettingField>
    </>
  )
}
