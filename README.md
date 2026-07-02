# icon-exporter

Local SVG icon preview, validation, and export tool.

## Stack

- Web: React, Vite, TypeScript, Ant Design, CodeMirror, Zustand
- API: NestJS, TypeScript, Sharp, archiver, Swagger
- Workspace: pnpm monorepo with `apps/web`, `apps/api`, and `packages/shared`

## Features

- Upload or paste SVG source
- Edit SVG source with CodeMirror
- Preview on transparent, white, or dark backgrounds
- Validate SVG with basic safety checks
- Export PNG, WebP, JPEG, and SVG
- Batch export multiple sizes as a ZIP file
- Configure filename, sizes, formats, background, padding, fit mode, and quality

## Limits

- SVG max size: 1MB
- Max export dimension: 2048 x 2048
- Max sizes per request: 20
- Max formats per request: 4
- Max output files per request: 40

The SVG safety layer is a basic local-tool filter. It rejects common risky content such as scripts, `foreignObject`, event handlers, and external references, but it is not a complete hostile SVG sandbox.

## Development

```bash
pnpm install
pnpm dev
```

Expected local URLs:

- Web: http://localhost:5173
- API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs

## API

### `GET /health`

Returns:

```json
{ "status": "ok" }
```

### `POST /api/icon/validate`

```json
{
  "svg": "<svg>...</svg>"
}
```

Returns SVG validity, width, height, viewBox, warnings, and sanitized SVG when valid.

### `POST /api/icon/export`

Returns `application/zip`.

```json
{
  "svg": "<svg>...</svg>",
  "filename": "logo",
  "sizes": [{ "width": 16, "height": 16 }],
  "formats": ["png", "webp", "jpeg", "svg"],
  "background": {
    "transparent": true,
    "color": "#ffffff"
  },
  "padding": 0,
  "borderRadius": 0,
  "fit": "contain",
  "quality": {
    "webp": 90,
    "jpeg": 90
  }
}
```
