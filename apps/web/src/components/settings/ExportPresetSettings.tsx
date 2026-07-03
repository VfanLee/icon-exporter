import { SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Select, message } from 'antd'
import { useMemo, useState } from 'react'
import { BUILTIN_PRESET_IDS, EXPORT_PRESETS } from '@icon-forge/shared'
import { useIconStore } from '../../stores/iconStore'
import { SettingField } from './SettingField'

export function ExportPresetSettings() {
  const activePresetId = useIconStore((state) => state.activePresetId)
  const userPresets = useIconStore((state) => state.userPresets)
  const applyExportPreset = useIconStore((state) => state.applyExportPreset)

  const options = useMemo(() => {
    const builtinOptions = [
      ...BUILTIN_PRESET_IDS.map((presetId) => ({
        label: EXPORT_PRESETS[presetId].label,
        value: presetId,
      })),
      { label: '自定义', value: 'custom' },
    ]

    if (userPresets.length === 0) {
      return builtinOptions
    }

    return [
      ...builtinOptions,
      {
        label: '已保存预设',
        options: userPresets.map((preset) => ({
          label: preset.label,
          value: preset.id,
        })),
      },
    ]
  }, [userPresets])

  return (
    <SettingField label="导出预设" hint="选择后会自动填入对应的格式与尺寸">
      <Select
        value={activePresetId}
        options={options}
        onChange={applyExportPreset}
        style={{ width: '100%' }}
      />
    </SettingField>
  )
}

interface SavePresetFormValues {
  name: string
}

export function SavePresetButton({ block = false }: { block?: boolean }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm<SavePresetFormValues>()
  const saveCurrentAsPreset = useIconStore((state) => state.saveCurrentAsPreset)

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)
      try {
        saveCurrentAsPreset(values.name)
        message.success('预设已保存')
        setOpen(false)
        form.resetFields()
      } catch (error) {
        message.error(error instanceof Error ? error.message : '保存失败')
      } finally {
        setSaving(false)
      }
    } catch {
      // 表单校验未通过，保持弹窗打开
    }
  }

  return (
    <>
      <Button block={block} icon={<SaveOutlined />} onClick={() => setOpen(true)}>
        保存预设
      </Button>
      <Modal
        title="保存预设"
        open={open}
        okText="保存"
        cancelText="取消"
        confirmLoading={saving}
        onOk={handleSave}
        onCancel={() => setOpen(false)}
        afterClose={() => form.resetFields()}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="name"
            label="预设名称"
            rules={[{ required: true, message: '请输入预设名称' }]}
          >
            <Input placeholder="例如：我的 App 图标" onPressEnter={handleSave} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
