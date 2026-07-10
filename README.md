# Icon Forge

把 SVG 快速合成 App 风格图标，并批量导出多种尺寸与格式。

适合制作应用图标、Dock 图标、多尺寸素材包等。

## 能做什么

- 上传或编辑 SVG
- 实时预览合成效果
- 调整容器背景、内边距、圆角
- 一次导出 PNG、WebP、JPEG、AVIF、SVG
- 同时输出多个导出尺寸，打包为 ZIP

## 项目结构

pnpm workspace monorepo：

| 包                | 说明                                      |
| ----------------- | ----------------------------------------- |
| `packages/shared` | 共享类型、常量（编译为 CJS，供 API 使用） |
| `apps/api`        | NestJS 后端，SVG 校验、预览与导出         |
| `apps/web`        | React + Vite 前端                         |

开发时 `web` 通过 Vite alias 直接引用 shared 源码；`api` 通过 workspace 包引用 shared 的 `dist`。

## 环境要求

- Node.js：24
- pnpm：11

## 安装

```bash
pnpm install
```

## 开发

```bash
pnpm dev
```

| 服务 | 地址                  |
| ---- | --------------------- |
| Web  | http://localhost:5173 |
| API  | http://localhost:3000 |

单独启动某个包：

```bash
pnpm --filter @icon-forge/web dev
pnpm --filter @icon-forge/api dev
pnpm --filter @icon-forge/shared dev
```
