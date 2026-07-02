import { Checkbox, ColorPicker, Form, Input, InputNumber, Select, Slider, Space, Typography } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { lazy, Suspense } from 'react'
import { EXPORT_FORMATS, FIT_MODES, type ExportFormat, type FitMode } from '@icon-exporter/shared'
import { useIconStore } from '../stores/iconStore'

const SizeListEditor = lazy(() =>
  import('./SizeListEditor').then((module) => ({
    default: module.SizeListEditor,
  })),
)

export function ExportSettings() {
  const store = useIconStore()

  return (
    <Form layout="vertical" className="settings-form">
      <Form.Item label="Filename prefix">
        <Input value={store.filename} onChange={(event) => store.setFilename(event.target.value)} placeholder="icon" />
      </Form.Item>

      <Form.Item label="Formats">
        <Checkbox.Group
          options={EXPORT_FORMATS.map((format) => ({
            label: format.toUpperCase(),
            value: format,
          }))}
          value={store.formats}
          onChange={(formats) => store.setFormats(formats as ExportFormat[])}
        />
      </Form.Item>

      <Form.Item label="Sizes">
        <Suspense fallback={<div className="inline-fallback">Loading sizes...</div>}>
          <SizeListEditor />
        </Suspense>
      </Form.Item>

      <Form.Item label="Fit mode">
        <Select
          value={store.fit}
          options={FIT_MODES.map((fit) => ({ label: fit, value: fit }))}
          onChange={(fit) => store.setFit(fit as FitMode)}
        />
      </Form.Item>

      <Form.Item label="Padding">
        <Slider min={0} max={0.5} step={0.01} value={store.padding} onChange={store.setPadding} />
      </Form.Item>

      <Form.Item label="Border radius">
        <Slider min={0} max={0.5} step={0.01} value={store.borderRadius} onChange={store.setBorderRadius} />
      </Form.Item>

      <Form.Item>
        <Checkbox checked={store.transparent} onChange={(event) => store.setTransparent(event.target.checked)}>
          Transparent background for PNG/WebP
        </Checkbox>
      </Form.Item>

      <Form.Item label="Background color">
        <Space>
          <ColorPicker
            value={store.backgroundColor}
            onChange={(color: Color) => store.setBackgroundColor(color.toHexString())}
          />
          <Typography.Text code>{store.backgroundColor}</Typography.Text>
        </Space>
      </Form.Item>

      <Form.Item label="WebP quality">
        <InputNumber
          min={1}
          max={100}
          value={store.webpQuality}
          onChange={(value) => store.setWebpQuality(value ?? 90)}
        />
      </Form.Item>

      <Form.Item label="JPEG quality">
        <InputNumber
          min={1}
          max={100}
          value={store.jpegQuality}
          onChange={(value) => store.setJpegQuality(value ?? 90)}
        />
      </Form.Item>
    </Form>
  )
}
