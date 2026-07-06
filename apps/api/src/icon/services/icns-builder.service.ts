import { Injectable, InternalServerErrorException } from '@nestjs/common'
import * as png2icons from 'png2icons'
import { type ExportSize } from '@icon-forge/shared'
import type { ExportIconDto } from '../dto/export-icon.dto'
import { ImageRendererService } from './image-renderer.service'

@Injectable()
export class IcnsBuilderService {
  constructor(private readonly renderer: ImageRendererService) {}

  async build(svg: string, options: ExportIconDto, sizes: ExportSize[]): Promise<Buffer> {
    const sourceSize = this.resolveSourceSize(sizes)
    const exportSize: ExportSize = { width: sourceSize, height: sourceSize }
    const sourceBuffer = await this.renderer.render(svg, exportSize, 'png', options)
    const icnsBuffer = png2icons.createICNS(sourceBuffer, png2icons.BILINEAR, 0)

    if (!icnsBuffer) {
      throw new InternalServerErrorException('ICNS 生成失败')
    }

    return icnsBuffer
  }

  private resolveSourceSize(sizes: ExportSize[]) {
    const preferred = sizes.find((size) => size.width === 1024 && size.height === 1024)
    if (preferred) {
      return 1024
    }

    return Math.max(...sizes.map((size) => Math.min(size.width, size.height)))
  }
}
