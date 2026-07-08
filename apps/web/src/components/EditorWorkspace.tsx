import { CodeOutlined, EyeOutlined } from '@ant-design/icons'
import { Card, Flex, Space, Spin, Tabs } from 'antd'
import { lazy, Suspense, useState } from 'react'
import { ValidateSvgButton } from './ExportButton'
import { SvgEditor } from './SvgEditor'

const SvgPreview = lazy(() =>
  import('./SvgPreview').then((module) => ({
    default: module.SvgPreview,
  })),
)
const SvgUploader = lazy(() =>
  import('./SvgUploader').then((module) => ({
    default: module.SvgUploader,
  })),
)
const ResetDefaultsButton = lazy(() =>
  import('./SvgUploader').then((module) => ({
    default: module.ResetDefaultsButton,
  })),
)

function TabFallback() {
  return (
    <Flex align="center" justify="center" className="panel-fallback">
      <Spin />
    </Flex>
  )
}

export function EditorWorkspace() {
  const [activeKey, setActiveKey] = useState('preview')

  return (
    <Card variant="borderless" className="workspace-card">
      <Tabs
        className="workspace-tabs"
        activeKey={activeKey}
        onChange={setActiveKey}
        destroyOnHidden={false}
        tabBarExtraContent={
          <Space wrap size={12}>
            <Suspense fallback={null}>
              <ResetDefaultsButton />
            </Suspense>
            {activeKey === 'source' ? <ValidateSvgButton /> : null}
            <Suspense fallback={null}>
              <SvgUploader />
            </Suspense>
          </Space>
        }
        items={[
          {
            key: 'source',
            label: '源码',
            icon: <CodeOutlined />,
            children: (
              <div className="workspace-pane workspace-source">
                <SvgEditor />
              </div>
            ),
          },
          {
            key: 'preview',
            label: '预览',
            icon: <EyeOutlined />,
            children: (
              <div className="workspace-pane workspace-preview">
                <Suspense fallback={<TabFallback />}>
                  <SvgPreview />
                </Suspense>
              </div>
            ),
          },
        ]}
      />
    </Card>
  )
}
