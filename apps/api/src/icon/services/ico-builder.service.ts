import { Injectable } from '@nestjs/common'
import toIco from 'to-ico'
import { DEFAULT_ICO_EMBED_SIZES, type ExportSize } from '@icon-forge/shared'
import type { ExportIconDto } from '../dto/export-icon.dto'
import { ImageRendererService } from './image-renderer.service'

@Injectable()
export class IcoBuilderService {
  constructor(private readonly renderer: ImageRendererService) {}

  async build(
    svg: string,
    options: ExportIconDto,
    embedSizes: number[] = [...DEFAULT_ICO_EMBED_SIZES],
  ): Promise<Buffer> {
    const buffers = await Promise.all(
      embedSizes.map(async (size) => {
        const exportSize: ExportSize = { width: size, height: size }
        return this.renderer.render(svg, exportSize, 'png', options)
      }),
    )

    return toIco(buffers)
  }
}
