import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { MAX_OUTPUT_FILE_COUNT, countOutputFiles, type ExportFormat } from '@icon-forge/shared'
import type { Response } from 'express'
import { ExportIconDto, PreviewIconDto } from './dto/export-icon.dto'
import { IcoBuilderService } from './services/ico-builder.service'
import { IcnsBuilderService } from './services/icns-builder.service'
import { ImageRendererService } from './services/image-renderer.service'
import { SvgSanitizerService } from './services/svg-sanitizer.service'
import { ZipBuilderService } from './services/zip-builder.service'

type RasterExportFormat = Exclude<ExportFormat, 'svg' | 'ico' | 'icns'>

@Injectable()
export class IconService {
  constructor(
    private readonly sanitizer: SvgSanitizerService,
    private readonly renderer: ImageRendererService,
    private readonly icoBuilder: IcoBuilderService,
    private readonly icnsBuilder: IcnsBuilderService,
    private readonly zipBuilder: ZipBuilderService,
  ) {}

  validateSvg(svg: string) {
    return this.sanitizer.validateAndSanitize(svg)
  }

  async previewIcon(dto: PreviewIconDto) {
    const validation = this.sanitizer.validateAndSanitize(dto.svg)
    if (!validation.valid || !validation.sanitizedSvg) {
      throw new BadRequestException(validation.warnings.join('; '))
    }

    return this.renderer.renderPreview(validation.sanitizedSvg, dto.previewSize, dto)
  }

  async exportIcon(dto: ExportIconDto, response: Response) {
    const outputFileCount = countOutputFiles(dto.outputs)

    if (outputFileCount > MAX_OUTPUT_FILE_COUNT) {
      throw new BadRequestException(`输出文件过多，最多 ${MAX_OUTPUT_FILE_COUNT} 个。`)
    }

    const validation = this.sanitizer.validateAndSanitize(dto.svg)
    if (!validation.valid || !validation.sanitizedSvg) {
      throw new BadRequestException(validation.warnings.join('; '))
    }

    const archive = this.zipBuilder.createArchive(response)

    try {
      for (const output of dto.outputs) {
        switch (output.format) {
          case 'svg':
            this.zipBuilder.appendBuffer(
              archive,
              Buffer.from(validation.sanitizedSvg),
              `${dto.filename}-export/${dto.filename}.svg`,
            )
            break

          case 'ico': {
            const embedSizes = output.sizes.map((size) => size.width)
            const icoBuffer = await this.icoBuilder.build(validation.sanitizedSvg, dto, embedSizes)
            this.zipBuilder.appendBuffer(archive, icoBuffer, `${dto.filename}-export/${dto.filename}.ico`)
            break
          }

          case 'icns': {
            const icnsBuffer = await this.icnsBuilder.build(validation.sanitizedSvg, dto, output.sizes)
            this.zipBuilder.appendBuffer(archive, icnsBuffer, `${dto.filename}-export/${dto.filename}.icns`)
            break
          }

          default: {
            const rasterFormat = output.format as RasterExportFormat
            for (const size of output.sizes) {
              const buffer = await this.renderer.render(validation.sanitizedSvg, size, rasterFormat, dto)
              this.zipBuilder.appendBuffer(
                archive,
                buffer,
                `${dto.filename}-export/${this.buildFileName(dto.filename, size.width, size.height, rasterFormat)}`,
              )
            }
          }
        }
      }

      await this.zipBuilder.finalize(archive)
    } catch (error) {
      archive.abort()
      throw new InternalServerErrorException(error instanceof Error ? error.message : '导出失败')
    }
  }

  private buildFileName(filename: string, width: number, height: number, format: RasterExportFormat) {
    return `${filename}-${width}x${height}.${format === 'jpeg' ? 'jpg' : format}`
  }
}
