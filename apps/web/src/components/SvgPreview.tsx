import { Alert, Radio, Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIconStore } from '../stores/iconStore';

type PreviewBackground = 'transparent' | 'white' | 'dark';

export function SvgPreview() {
  const svg = useIconStore((state) => state.svg);
  const validation = useIconStore((state) => state.validation);
  const sizes = useIconStore((state) => state.sizes);
  const padding = useIconStore((state) => state.padding);
  const borderRadius = useIconStore((state) => state.borderRadius);
  const fit = useIconStore((state) => state.fit);
  const transparent = useIconStore((state) => state.transparent);
  const backgroundColor = useIconStore((state) => state.backgroundColor);
  const [background, setBackground] = useState<PreviewBackground>('transparent');

  const previewUrl = useMemo(() => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  }, [svg]);
  const previewSize = sizes[0] ?? { width: 512, height: 512 };
  const canvasBackground = transparent ? 'transparent' : backgroundColor;
  const canvasStyle = {
    aspectRatio: `${previewSize.width} / ${previewSize.height}`,
    backgroundColor: canvasBackground,
    borderRadius: `${borderRadius * 100}%`,
    padding: `${padding * 100}%`,
  };
  const imageStyle = {
    objectFit: fit,
  };

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const previewClass = `preview-surface preview-${background}`;

  return (
    <Space direction="vertical" size="middle" className="full-width">
      {validation && !validation.valid ? (
        <Alert type="error" showIcon message={validation.warnings.join('; ')} />
      ) : null}
      {validation?.valid ? (
        <Alert
          type="success"
          showIcon
          message={`Valid SVG${validation.viewBox ? ` · viewBox ${validation.viewBox}` : ''}`}
        />
      ) : null}
      <Radio.Group
        value={background}
        onChange={(event) => setBackground(event.target.value as PreviewBackground)}
        optionType="button"
        buttonStyle="solid"
      >
        <Radio.Button value="transparent">Transparent</Radio.Button>
        <Radio.Button value="white">White</Radio.Button>
        <Radio.Button value="dark">Dark</Radio.Button>
      </Radio.Group>
      <div className={previewClass}>
        <div className="export-preview-canvas" style={canvasStyle}>
          <img src={previewUrl} alt="SVG preview" style={imageStyle} />
        </div>
      </div>
      <Typography.Text type="secondary">
        Preview uses the first export size and current export settings.
      </Typography.Text>
    </Space>
  );
}
