# IconForge

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

- [Node.js](https://nodejs.org/) 22
- [pnpm](https://pnpm.io/) 11

## 安装

```bash
pnpm install
```

## 开发

一条命令启动 shared watch、API 与前端（Turborepo 会先构建 shared，再并行启动各 dev 服务）：

```bash
pnpm dev
```

| 服务    | 默认地址                       | 说明                                            |
| ------- | ------------------------------ | ----------------------------------------------- |
| Web     | http://localhost:5173          | 浏览器访问入口；5173 被占用时 Vite 会自动换端口 |
| API     | http://localhost:3000          | 后端接口                                        |
| Swagger | http://localhost:3000/api-docs | API 文档                                        |
| Health  | http://localhost:3000/health   | 健康检查                                        |

单独启动某个包：

```bash
pnpm --filter @icon-forge/web dev
pnpm --filter @icon-forge/api dev
pnpm --filter @icon-forge/shared dev
```

## 构建

```bash
pnpm build
```

生产环境启动 API：

```bash
pnpm --filter @icon-forge/api build
pnpm --filter @icon-forge/api start:prod
```

`web` 构建产物在 `apps/web/dist`，可部署到任意静态托管。

## 其他命令

```bash
pnpm lint    # 各子包分别 lint
pnpm format  # Prettier 格式化全仓库
```

根目录统一管理 `prettier`、`typescript`、`eslint` 等开发依赖；各子包保留自己的 `tsconfig` 与 `eslint.config`。

## 基本使用流程

1. **上传 SVG** — 点击「源码」里的「上传 SVG」，或在编辑器里粘贴代码
2. **预览调整** — 在「预览」里查看效果；右侧「容器」「图形」调整合成效果（预览与导出一致）；「导出」配置文件名、格式与尺寸
3. **导出** — 在右侧「导出」Tab 底部点击「导出 ZIP」下载成品
