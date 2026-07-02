import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './styles.less'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          borderRadius: 8,
          colorPrimary: '#1677ff',
          colorBgLayout: '#f5f7fb',
          colorBgContainer: '#ffffff',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        components: {
          Card: {
            paddingLG: 20,
          },
          Form: {
            itemMarginBottom: 16,
            verticalLabelPadding: '0 0 6px',
          },
          Collapse: {
            headerPadding: '10px 12px',
            contentPadding: '4px 12px 12px',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
