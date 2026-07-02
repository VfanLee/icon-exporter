import { Card, Flex, Layout, Typography } from 'antd'
import { lazy, Suspense } from 'react'

const SettingsPanel = lazy(() =>
  import('./components/SettingsPanel').then((module) => ({
    default: module.SettingsPanel,
  })),
)
const EditorWorkspace = lazy(() =>
  import('./components/EditorWorkspace').then((module) => ({
    default: module.EditorWorkspace,
  })),
)

const { Header, Content } = Layout
const { Title, Text } = Typography

function PanelFallback() {
  return (
    <Flex align="center" justify="center" className="panel-fallback">
      <Text type="secondary">加载中...</Text>
    </Flex>
  )
}

export default function App() {
  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <Flex justify="space-between" align="center" wrap="wrap" gap={16} className="app-header-inner">
          <div>
            <Title level={3} className="app-title">
              免费图标导出
            </Title>
            <Text type="secondary">本地 SVG 预览、校验与多格式导出</Text>
          </div>
        </Flex>
      </Header>

      <Content className="app-content">
        <div className="content-grid">
          <div className="workspace-column">
            <Suspense fallback={<PanelFallback />}>
              <EditorWorkspace />
            </Suspense>
          </div>

          <aside className="settings-column">
            <Card size="small" variant="borderless" className="settings-card">
              <Suspense fallback={<PanelFallback />}>
                <SettingsPanel />
              </Suspense>
            </Card>
          </aside>
        </div>
      </Content>
    </Layout>
  )
}
