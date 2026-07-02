import { Checkbox, InputNumber, Select, Tabs } from 'antd'
import { JPEG_CHROMA_SUBSAMPLINGS } from '@icon-exporter/shared'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function EncodingSettings() {
  const store = useIconStore()

  const items = [
    store.formats.includes('png')
      ? {
          key: 'png',
          label: 'PNG',
          children: (
            <>
              <SettingField label="压缩等级" hint="png({ compressionLevel })">
                <InputNumber
                  min={0}
                  max={9}
                  value={store.pngCompressionLevel}
                  onChange={(value) => store.setPngCompressionLevel(value ?? 6)}
                  style={{ width: '100%' }}
                />
              </SettingField>
              <SettingField hint="png({ palette })">
                <Checkbox checked={store.pngPalette} onChange={(event) => store.setPngPalette(event.target.checked)}>
                  调色板模式
                </Checkbox>
              </SettingField>
              <SettingField label="effort" hint="png({ effort })">
                <InputNumber
                  min={1}
                  max={10}
                  value={store.pngEffort}
                  onChange={(value) => store.setPngEffort(value ?? 7)}
                  style={{ width: '100%' }}
                />
              </SettingField>
            </>
          ),
        }
      : null,
    store.formats.includes('webp')
      ? {
          key: 'webp',
          label: 'WebP',
          children: (
            <>
              <SettingField label="质量" hint="webp({ quality })">
                <InputNumber
                  min={1}
                  max={100}
                  value={store.webpQuality}
                  onChange={(value) => store.setWebpQuality(value ?? 90)}
                  style={{ width: '100%' }}
                />
              </SettingField>
              <SettingField hint="webp({ lossless })">
                <Checkbox checked={store.webpLossless} onChange={(event) => store.setWebpLossless(event.target.checked)}>
                  lossless
                </Checkbox>
              </SettingField>
              <SettingField hint="webp({ nearLossless })">
                <Checkbox
                  checked={store.webpNearLossless}
                  onChange={(event) => store.setWebpNearLossless(event.target.checked)}
                >
                  nearLossless
                </Checkbox>
              </SettingField>
              <SettingField label="effort" hint="webp({ effort })">
                <InputNumber
                  min={0}
                  max={6}
                  value={store.webpEffort}
                  onChange={(value) => store.setWebpEffort(value ?? 4)}
                  style={{ width: '100%' }}
                />
              </SettingField>
              <SettingField hint="webp({ smartSubsample })">
                <Checkbox
                  checked={store.webpSmartSubsample}
                  onChange={(event) => store.setWebpSmartSubsample(event.target.checked)}
                >
                  smartSubsample
                </Checkbox>
              </SettingField>
            </>
          ),
        }
      : null,
    store.formats.includes('jpeg')
      ? {
          key: 'jpeg',
          label: 'JPEG',
          children: (
            <>
              <SettingField label="质量" hint="jpeg({ quality })">
                <InputNumber
                  min={1}
                  max={100}
                  value={store.jpegQuality}
                  onChange={(value) => store.setJpegQuality(value ?? 90)}
                  style={{ width: '100%' }}
                />
              </SettingField>
              <SettingField hint="jpeg({ progressive })">
                <Checkbox
                  checked={store.jpegProgressive}
                  onChange={(event) => store.setJpegProgressive(event.target.checked)}
                >
                  progressive
                </Checkbox>
              </SettingField>
              <SettingField hint="jpeg({ mozjpeg })">
                <Checkbox checked={store.jpegMozjpeg} onChange={(event) => store.setJpegMozjpeg(event.target.checked)}>
                  mozjpeg
                </Checkbox>
              </SettingField>
              <SettingField label="chromaSubsampling" hint="jpeg({ chromaSubsampling })">
                <Select
                  value={store.jpegChromaSubsampling}
                  options={JPEG_CHROMA_SUBSAMPLINGS.map((value) => ({ label: value, value }))}
                  onChange={store.setJpegChromaSubsampling}
                />
              </SettingField>
            </>
          ),
        }
      : null,
    store.formats.includes('avif')
      ? {
          key: 'avif',
          label: 'AVIF',
          children: (
            <>
              <SettingField label="质量" hint="avif({ quality })">
                <InputNumber
                  min={1}
                  max={100}
                  value={store.avifQuality}
                  onChange={(value) => store.setAvifQuality(value ?? 50)}
                  style={{ width: '100%' }}
                />
              </SettingField>
              <SettingField hint="avif({ lossless })">
                <Checkbox checked={store.avifLossless} onChange={(event) => store.setAvifLossless(event.target.checked)}>
                  lossless
                </Checkbox>
              </SettingField>
              <SettingField label="effort" hint="avif({ effort })">
                <InputNumber
                  min={0}
                  max={9}
                  value={store.avifEffort}
                  onChange={(value) => store.setAvifEffort(value ?? 4)}
                  style={{ width: '100%' }}
                />
              </SettingField>
            </>
          ),
        }
      : null,
  ].filter(Boolean)

  if (items.length === 0) {
    return null
  }

  return <Tabs size="small" type="card" items={items as NonNullable<(typeof items)[number]>[]} />
}
