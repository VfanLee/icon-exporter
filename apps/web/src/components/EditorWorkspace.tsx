import { CodeOutlined, EyeOutlined } from '@ant-design/icons'
import { Card, Tabs } from 'antd'
import { lazy, Suspense } from 'react'

const SvgEditor = lazy(() =>
  import('./SvgEditor').then((module) => ({
    default: module.SvgEditor,
  })),
)
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
  return (
    <Card size="small" bordered={false} className="workspace-card">
      <Tabs
        className="workspace-tabs"
        defaultActiveKey="preview"
        tabBarExtraContent={
          <Suspense fallback={null}>
            <SvgUploader />
          </Suspense>
        }
        items={[
          {
            key: 'source',
            label: (
              <span className="workspace-tab-label">
                <CodeOutlined />
                SVG 源码
              </span>
            ),
            children: (
              <div className="workspace-pane workspace-source">
                <Suspense fallback={<TabFallback />}>
                  <SvgEditor />
                </Suspense>
              </div>
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
