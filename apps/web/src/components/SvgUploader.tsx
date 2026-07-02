import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload } from 'antd'
import type { UploadProps } from 'antd'
import { useIconStore } from '../stores/iconStore'

export function SvgUploader() {
  const setSvg = useIconStore((state) => state.setSvg)
  const setFilename = useIconStore((state) => state.setFilename)

  const props: UploadProps = {
    accept: '.svg,image/svg+xml',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: async (file) => {
      const text = await file.text()
      setSvg(text)
      setFilename(file.name.replace(/\.svg$/i, '') || 'icon')
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
