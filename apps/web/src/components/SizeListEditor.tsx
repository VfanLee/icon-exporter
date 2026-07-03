import { Button, InputNumber, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ExportSize } from '@icon-forge/shared'
import { MAX_EXPORT_SIZE } from '@icon-forge/shared'

interface SizeListEditorProps {
  sizes: ExportSize[]
  onChange: (sizes: ExportSize[]) => void
  minCount?: number
}

export function SizeListEditor({ sizes, onChange, minCount = 1 }: SizeListEditorProps) {
  const updateSize = (index: number, patch: Partial<ExportSize>) => {
    onChange(sizes.map((size, sizeIndex) => (sizeIndex === index ? { ...size, ...patch } : size)))
  }

  const removeSize = (index: number) => {
    onChange(sizes.filter((_, sizeIndex) => sizeIndex !== index))
  }

  const columns: ColumnsType<ExportSize & { key: number }> = [
    {
      title: '宽',
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
      title: '高',
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
          disabled={sizes.length <= minCount}
          onClick={() => removeSize(index)}
          aria-label="删除尺寸"
        />
      ),
    },
  ]

  return (
    <Space orientation="vertical" className="full-width">
      <Table
        bordered
        pagination={false}
        scroll={{ x: true }}
        columns={columns}
        dataSource={sizes.map((size, index) => ({ ...size, key: index }))}
      />
      <Button
        block
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => onChange([...sizes, { width: 1024, height: 1024 }])}
      >
        添加尺寸
      </Button>
    </Space>
  )
}
