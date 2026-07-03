import { ExportOutlined, LayoutOutlined, PictureOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'
import { Collapse, Divider, Flex, Form, Space, Tabs, Typography } from 'antd'
import { ExportPresetSettings, SavePresetButton } from './settings/ExportPresetSettings'
import {
  ExportOutputsEditor,
  ExportQualitySettings,
  ExportScopeAlert,
} from './settings/ExportOutputSettings'
import { LayoutSettings } from './settings/LayoutSettings'
import { BackgroundSettings } from './settings/BackgroundSettings'
import { TransformSettings } from './settings/TransformSettings'
import { EffectsSettings } from './settings/EffectsSettings'
import { TrimSettings } from './settings/TrimSettings'
import { useExportFormats } from '../stores/iconStore'
import { ExportZipButton } from './ExportButton'

function PanelDescription({ children }: { children: ReactNode }) {
  return (
    <Typography.Text
      type="secondary"
      style={{ display: 'block', marginBottom: 12, fontSize: 12, lineHeight: 1.5 }}
    >
      {children}
    </Typography.Text>
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
      expandIconPlacement="end"
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
      <div className="settings-tab-scroll">
        <PanelDescription>设置图标容器的外观（背景、留白、圆角），左侧预览与导出结果保持一致。</PanelDescription>
        <SettingsCollapse
          defaultActiveKey={['layout', 'background']}
          items={[
            { key: 'layout', label: '布局', children: <LayoutSettings /> },
            { key: 'background', label: '背景', children: <BackgroundSettings /> },
          ]}
        />
      </div>
    </div>
  )
}

function GraphicSettings() {
  return (
    <div className="settings-tab-pane">
      <div className="settings-tab-scroll">
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
    </div>
  )
}

function ExportSettings() {
  const formats = useExportFormats()
  const hasQualityOption = formats.includes('webp') || formats.includes('jpeg') || formats.includes('avif')

  const qualityItems = hasQualityOption
    ? [{ key: 'quality', label: '编码质量', children: <ExportQualitySettings /> }]
    : []

  return (
    <div className="settings-tab-pane settings-tab-pane-export">
      <div className="settings-tab-scroll">
        <ExportScopeAlert />
        <Flex vertical gap={12} style={{ marginBottom: 12 }}>
          <ExportPresetSettings />
        </Flex>
        <ExportOutputsEditor />
        {qualityItems.length > 0 ? (
          <SettingsCollapse defaultActiveKey={[]} items={qualityItems} />
        ) : null}
      </div>
      <Flex vertical gap={8} style={{ flexShrink: 0, marginTop: 12 }}>
        <Divider style={{ margin: 0 }} />
        <Space orientation="vertical" size={8} style={{ width: '100%' }}>
          <ExportZipButton block />
          <SavePresetButton block />
        </Space>
      </Flex>
    </div>
  )
}

export function SettingsPanel() {
  return (
    <Form layout="vertical" colon={false} className="settings-form" requiredMark={false}>
      <Tabs
        className="settings-tabs"
        defaultActiveKey="container"
        items={[
          {
            key: 'container',
            label: '容器',
            icon: <LayoutOutlined />,
            children: <ContainerSettings />,
          },
          {
            key: 'graphic',
            label: '图形',
            icon: <PictureOutlined />,
            children: <GraphicSettings />,
          },
          {
            key: 'export',
            label: '导出',
            icon: <ExportOutlined />,
            children: <ExportSettings />,
          },
        ]}
      />
    </Form>
  )
}
