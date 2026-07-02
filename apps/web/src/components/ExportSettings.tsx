import {
  AppstoreOutlined,
  BgColorsOutlined,
  CodeOutlined,
  CompressOutlined,
  ExperimentOutlined,
  LayoutOutlined,
  ScissorOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'
import { Collapse, Divider, Form, Select } from 'antd'
import { BasicSettings } from './settings/BasicSettings'
import { LayoutSettings } from './settings/LayoutSettings'
import { BackgroundSettings } from './settings/BackgroundSettings'
import { RasterSettings } from './settings/RasterSettings'
import { TransformSettings } from './settings/TransformSettings'
import { EffectsSettings } from './settings/EffectsSettings'
import { TrimSettings } from './settings/TrimSettings'
import { EncodingSettings } from './settings/EncodingSettings'
import { AdvancedSettings } from './settings/AdvancedSettings'
import { SettingField } from './settings/SettingField'
import { useIconStore } from '../stores/iconStore'

const PREVIEW_SIZES = [
  { label: '128 × 128', value: 128 },
  { label: '256 × 256', value: 256 },
  { label: '512 × 512', value: 512 },
]

function sectionLabel(icon: ReactNode, text: string) {
  return (
    <span className="settings-section-label">
      {icon}
      <span>{text}</span>
    </span>
  )
}

export function ExportSettings() {
  const previewSize = useIconStore((state) => state.previewSize)
  const setPreviewSize = useIconStore((state) => state.setPreviewSize)

  const items = [
    {
      key: 'basic',
      label: sectionLabel(<AppstoreOutlined />, '基础'),
      children: <BasicSettings />,
    },
    {
      key: 'layout',
      label: sectionLabel(<LayoutOutlined />, '布局'),
      children: <LayoutSettings />,
    },
    {
      key: 'background',
      label: sectionLabel(<BgColorsOutlined />, '背景'),
      children: <BackgroundSettings />,
    },
    {
      key: 'raster',
      label: sectionLabel(<CompressOutlined />, '渲染'),
      children: <RasterSettings />,
    },
    {
      key: 'transform',
      label: sectionLabel(<SyncOutlined />, '变换'),
      children: <TransformSettings />,
    },
    {
      key: 'effects',
      label: sectionLabel(<ExperimentOutlined />, '滤镜'),
      children: <EffectsSettings />,
    },
    {
      key: 'trim',
      label: sectionLabel(<ScissorOutlined />, '裁剪'),
      children: <TrimSettings />,
    },
    {
      key: 'encoding',
      label: sectionLabel(<CodeOutlined />, '编码'),
      children: <EncodingSettings />,
    },
    {
      key: 'advanced',
      label: sectionLabel(<SettingOutlined />, '高级'),
      children: <AdvancedSettings />,
    },
  ]

  return (
    <Form layout="vertical" size="small" colon={false} className="settings-form" requiredMark={false}>
      <SettingField label="预览画布尺寸" hint="预览时使用的画布宽高，与导出逻辑一致">
        <Select
          value={previewSize.width}
          options={PREVIEW_SIZES}
          onChange={(size) => setPreviewSize({ width: size, height: size })}
        />
      </SettingField>

      <Divider className="settings-divider" />

      <Collapse
        bordered={false}
        size="small"
        expandIconPosition="end"
        items={items}
        defaultActiveKey={['basic', 'layout', 'background']}
        className="settings-collapse"
      />
    </Form>
  )
}
