import { CodeOutlined, EyeOutlined } from '@ant-design/icons'
import { Card, Space, Tabs } from 'antd'
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

function TabFallback() {
  return <div className="panel-fallback">加载中...</div>
}

export function EditorWorkspace() {
  const [activeKey, setActiveKey] = useState('preview')

  return (
    <Card size="small" variant="borderless" className="workspace-card">
      <Tabs
        className="workspace-tabs"
        activeKey={activeKey}
        onChange={setActiveKey}
        destroyOnHidden={false}
        tabBarExtraContent={
          <Space wrap>
            {activeKey === 'source' ? <ValidateSvgButton /> : null}
            <Suspense fallback={null}>
              <SvgUploader />
            </Suspense>
          </Space>
        }
        items={[
          {
            key: 'source',
            label: (
              <span className="workspace-tab-label">
                <CodeOutlined />
                源码
              </span>
            ),
            children: (
              <div className="workspace-pane workspace-source">{activeKey === 'source' ? <SvgEditor /> : null}</div>
            ),
          },
          {
            key: 'preview',
            label: (
              <span className="workspace-tab-label">
                <EyeOutlined />
                预览
              </span>
            ),
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
