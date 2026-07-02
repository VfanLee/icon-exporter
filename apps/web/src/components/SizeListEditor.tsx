import { Button, InputNumber, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ExportSize } from '@icon-exporter/shared'
import { MAX_EXPORT_SIZE } from '@icon-exporter/shared'
import { useIconStore } from '../stores/iconStore'

export function SizeListEditor() {
  const sizes = useIconStore((state) => state.sizes)
  const setSizes = useIconStore((state) => state.setSizes)

  const updateSize = (index: number, patch: Partial<ExportSize>) => {
    setSizes(sizes.map((size, sizeIndex) => (sizeIndex === index ? { ...size, ...patch } : size)))
  }

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, sizeIndex) => sizeIndex !== index))
  }

  const columns: ColumnsType<ExportSize & { key: number }> = [
    {
      title: 'Width',
      dataIndex: 'width',
      render: (_, record, index) => (
        <InputNumber
          min={1}
          max={MAX_EXPORT_SIZE}
          value={record.width}
          onChange={(value) => updateSize(index, { width: value ?? 1 })}
        />
      ),
    },
    {
      title: 'Height',
      dataIndex: 'height',
      render: (_, record, index) => (
        <InputNumber
          min={1}
          max={MAX_EXPORT_SIZE}
          value={record.height}
          onChange={(value) => updateSize(index, { height: value ?? 1 })}
        />
      ),
    },
    {
      title: '',
      width: 48,
      render: (_, __, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          disabled={sizes.length <= 1}
          onClick={() => removeSize(index)}
          aria-label="Remove size"
        />
      ),
    },
  ]

  return (
    <Space direction="vertical" className="full-width">
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={sizes.map((size, index) => ({ ...size, key: index }))}
      />
      <Button icon={<PlusOutlined />} onClick={() => setSizes([...sizes, { width: 1024, height: 1024 }])}>
        Add size
      </Button>
    </Space>
  )
}
