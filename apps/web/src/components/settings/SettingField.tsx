import { Form, Typography } from 'antd'
import type { FormItemProps } from 'antd'
import type { ReactNode } from 'react'

interface SettingFieldProps extends FormItemProps {
  hint?: ReactNode
}

export function SettingField({ hint, children, ...props }: SettingFieldProps) {
  return (
    <Form.Item
      {...props}
      extra={
        hint ? (
          typeof hint === 'string' ? (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {hint}
            </Typography.Text>
          ) : (
            hint
          )
        ) : undefined
      }
    >
      {children}
    </Form.Item>
  )
}
