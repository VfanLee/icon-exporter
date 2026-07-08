import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Flex, InputNumber, Select, Space, Switch, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import {
  EXPORT_FORMATS,
  countOutputFiles,
  type ExportFormat,
  type ExportOutputSpec,
} from '@icon-forge/shared'
import { useExportFormats, useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

const { CheckableTag } = Tag

const COMMON_SIZES = [16, 32, 48, 64, 128, 180, 192, 256, 512, 1024] as const

const FORMAT_META: Record<ExportFormat, { label: string; hint: string }> = {
  png: { label: 'PNG', hint: '每尺寸一个文件' },
  webp: { label: 'WebP', hint: '每尺寸一个文件' },
  jpeg: { label: 'JPEG', hint: '每尺寸一个文件' },
  avif: { label: 'AVIF', hint: '每尺寸一个文件' },
  svg: { label: 'SVG', hint: '单文件 · 原始矢量' },
  ico: { label: 'ICO', hint: '单文件 · 内嵌多尺寸' },
  icns: { label: 'ICNS', hint: '单文件 · macOS 图标集' },
}

function getSelectedSizes(output: ExportOutputSpec) {
  return output.sizes.map((size) => size.width).sort((a, b) => b - a)
}

function OutputFormatCard({
  output,
  onToggleSize,
  onAddCustomSize,
  onRemoveCustomSize,
  onUseOuterPaddingChange,
}: {
  output: ExportOutputSpec
  onToggleSize: (size: number) => void
  onAddCustomSize: (size: number) => void
  onRemoveCustomSize: (size: number) => void
  onUseOuterPaddingChange: (useOuterPadding: boolean) => void
}) {
  const [customSize, setCustomSize] = useState<number | null>(null)
  const meta = FORMAT_META[output.format]
  const selectedSizes = getSelectedSizes(output)
  const customSizes = selectedSizes.filter((size) => !COMMON_SIZES.includes(size as (typeof COMMON_SIZES)[number]))
  const isSvg = output.format === 'svg'

  const handleAddCustom = () => {
    if (!customSize || customSize < 1) {
      return
    }

    onAddCustomSize(customSize)
    setCustomSize(null)
  }

  return (
    <Card
      size="small"
      title={
        <Space size={8} wrap>
          <Tag style={{ margin: 0 }}>{meta.label}</Tag>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {meta.hint}
          </Typography.Text>
        </Space>
      }
    >
      {isSvg ? (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          不含背景、内边距与圆角合成效果
        </Typography.Text>
      ) : (
        <Flex vertical gap={8}>
          <Flex align="center" justify="space-between" gap={8}>
            <Typography.Text style={{ fontSize: 12 }}>使用应用外边距</Typography.Text>
            <Switch
              size="small"
              checked={output.useOuterPadding}
              onChange={onUseOuterPaddingChange}
            />
          </Flex>

          <Space size={4} wrap>
            {COMMON_SIZES.map((size) => (
              <CheckableTag
                key={size}
                checked={selectedSizes.includes(size)}
                onChange={() => onToggleSize(size)}
              >
                {size}
              </CheckableTag>
            ))}
            {customSizes.map((size) => (
              <Tag
                key={`custom-${size}`}
                closable={selectedSizes.length > 1}
                color="processing"
                onClose={(event) => {
                  event.preventDefault()
                  onRemoveCustomSize(size)
                }}
              >
                {size}
              </Tag>
            ))}
          </Space>

          <Space.Compact>
            <InputNumber
              size="small"
              min={1}
              max={2048}
              placeholder="其他尺寸"
              value={customSize}
              onChange={(value) => setCustomSize(value)}
              onPressEnter={handleAddCustom}
            />
            <Button size="small" icon={<PlusOutlined />} onClick={handleAddCustom}>
              添加
            </Button>
          </Space.Compact>
        </Flex>
      )}
    </Card>
  )
}

export function ExportOutputsEditor() {
  const outputs = useIconStore((state) => state.outputs)
  const activeFormats = useExportFormats()
  const setFormats = useIconStore((state) => state.setFormats)
  const toggleOutputSize = useIconStore((state) => state.toggleOutputSize)
  const setOutputUseOuterPadding = useIconStore((state) => state.setOutputUseOuterPadding)
  const addCustomOutputSize = useIconStore((state) => state.addCustomOutputSize)

  const formatOptions = useMemo(
    () =>
      EXPORT_FORMATS.map((format) => ({
        label: FORMAT_META[format].label,
        value: format,
      })),
    [],
  )
  const fileCount = countOutputFiles(outputs)

  return (
    <SettingField label="输出清单" hint="上方多选格式，下方点选尺寸芯片；修改后自动切换为自定义">
      <Flex vertical gap={10}>
        <Flex align="center" gap={8}>
          <Select
            mode="multiple"
            placeholder="选择输出格式"
            value={activeFormats}
            options={formatOptions}
            onChange={(formats) => {
              if (formats.length === 0) {
                return
              }
              setFormats(formats as ExportFormat[])
            }}
            maxTagCount="responsive"
            optionFilterProp="label"
            style={{ flex: 1, minWidth: 0 }}
          />
          <Typography.Text type="secondary" style={{ flexShrink: 0, fontSize: 12, whiteSpace: 'nowrap' }}>
            约 {fileCount} 个文件
          </Typography.Text>
        </Flex>

        <Flex vertical gap={8}>
          {outputs.map((output) => (
            <OutputFormatCard
              key={output.format}
              output={output}
              onToggleSize={(size) => toggleOutputSize(output.format, size)}
              onAddCustomSize={(size) => addCustomOutputSize(output.format, size)}
              onRemoveCustomSize={(size) => toggleOutputSize(output.format, size)}
              onUseOuterPaddingChange={(useOuterPadding) =>
                setOutputUseOuterPadding(output.format, useOuterPadding)
              }
            />
          ))}
        </Flex>
      </Flex>
    </SettingField>
  )
}
