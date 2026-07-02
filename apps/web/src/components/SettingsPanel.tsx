import { ExportOutlined, LayoutOutlined, PictureOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'
import { Collapse, Form, Tabs, Typography } from 'antd'
import {
  ExportFormatSettings,
  ExportQualitySettings,
  ExportScopeAlert,
  ExportSizeSettings,
} from './settings/ExportOutputSettings'
import { LayoutSettings } from './settings/LayoutSettings'
import { BackgroundSettings } from './settings/BackgroundSettings'
import { TransformSettings } from './settings/TransformSettings'
import { EffectsSettings } from './settings/EffectsSettings'
import { TrimSettings } from './settings/TrimSettings'
import { useIconStore } from '../stores/iconStore'
import { ExportZipButton } from './ExportButton'

function tabLabel(icon: ReactNode, title: string) {
  return (
    <span className="settings-tab-label">
      {icon}
      <span>{title}</span>
    </span>
  )
}

function PanelDescription({ children }: { children: ReactNode }) {
  return (
    <Typography.Paragraph className="settings-panel-desc" type="secondary">
      {children}
    </Typography.Paragraph>
  )
}

function SettingsCollapse({
  items,
  defaultActiveKey,
}: {
  items: { key: string; label: string; children: ReactNode }[]
  defaultActiveKey: string[]
}) {
  return (
    <Collapse
      bordered={false}
      size="small"
      expandIconPosition="end"
      defaultActiveKey={defaultActiveKey}
      className="settings-collapse"
      items={items.map((item) => ({
        key: item.key,
        label: <span className="settings-subsection-title">{item.label}</span>,
        children: item.children,
      }))}
    />
  )
}

function ContainerSettings() {
  return (
    <div className="settings-tab-pane">
      <PanelDescription>设置图标容器的外观（背景、留白、圆角），左侧预览与导出结果保持一致。</PanelDescription>
      <SettingsCollapse
        defaultActiveKey={['layout', 'background']}
        items={[
          { key: 'layout', label: '布局', children: <LayoutSettings /> },
          { key: 'background', label: '背景', children: <BackgroundSettings /> },
        ]}
      />
    </div>
  )
}

function GraphicSettings() {
  return (
    <div className="settings-tab-pane">
      <PanelDescription>调整 SVG 图形的变换与效果（旋转、滤镜、裁切），左侧预览与导出结果保持一致。</PanelDescription>
      <SettingsCollapse
        defaultActiveKey={['transform']}
        items={[
          { key: 'transform', label: '位置与方向', children: <TransformSettings /> },
          { key: 'effects', label: '色彩与效果', children: <EffectsSettings /> },
          { key: 'trim', label: '边缘处理', children: <TrimSettings /> },
        ]}
      />
    </div>
  )
}

function ExportSettings() {
  const formats = useIconStore((state) => state.formats)
  const hasQualityOption = formats.includes('webp') || formats.includes('jpeg') || formats.includes('avif')

  const items = [
    { key: 'format', label: '文件与格式', children: <ExportFormatSettings /> },
    { key: 'sizes', label: '导出尺寸', children: <ExportSizeSettings /> },
  ]

  if (hasQualityOption) {
    items.push({ key: 'quality', label: '编码质量', children: <ExportQualitySettings /> })
  }

  return (
    <div className="settings-tab-pane">
      <ExportScopeAlert />
      <SettingsCollapse defaultActiveKey={['format', 'sizes']} items={items} />
      <div className="settings-action">
        <ExportZipButton block />
      </div>
    </div>
  )
}

export function SettingsPanel() {
  return (
    <Form layout="vertical" size="small" colon={false} className="settings-form" requiredMark={false}>
      <Tabs
        className="settings-tabs"
        defaultActiveKey="container"
        items={[
          {
            key: 'container',
            label: tabLabel(<LayoutOutlined />, '容器'),
            children: <ContainerSettings />,
          },
          {
            key: 'graphic',
            label: tabLabel(<PictureOutlined />, '图形'),
            children: <GraphicSettings />,
          },
          {
            key: 'export',
            label: tabLabel(<ExportOutlined />, '导出'),
            children: <ExportSettings />,
          },
        ]}
      />
    </Form>
  )
}
