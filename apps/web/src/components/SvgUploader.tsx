import { ReloadOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload } from 'antd'
import type { UploadProps } from 'antd'
import { useIconStore } from '../stores/iconStore'

export function ResetDefaultsButton() {
  const resetDefaults = useIconStore((state) => state.resetDefaults)

  const handleReset = () => {
    resetDefaults()
    message.success('已恢复默认')
  }

  return (
    <Button danger icon={<ReloadOutlined />} onClick={handleReset}>
      恢复默认
    </Button>
  )
}

export function SvgUploader() {
  const setSvg = useIconStore((state) => state.setSvg)

  const props: UploadProps = {
    accept: '.svg,image/svg+xml',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: async (file) => {
      const text = await file.text()
      setSvg(text)
      message.success('SVG 已加载')
      return false
    },
  }

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>上传 SVG</Button>
    </Upload>
  )
}
