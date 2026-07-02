import { InboxOutlined } from '@ant-design/icons'
import { message, Upload } from 'antd'
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
      message.success('SVG loaded')
      return false
    },
  }

  return (
    <Upload.Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag an SVG file here</p>
      <p className="ant-upload-hint">
        The file is read locally, then sent to the API only when validating or exporting.
      </p>
    </Upload.Dragger>
  )
}
