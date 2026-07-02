import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { MAX_OUTPUT_FILE_COUNT, type ExportFormat, type ValidateSvgResponse } from '@icon-forge/shared'
import type { Response } from 'express'
import { ExportIconDto, PreviewIconDto } from './dto/export-icon.dto'
import { ImageRendererService } from './services/image-renderer.service'
import { SvgSanitizerService } from './services/svg-sanitizer.service'
import { ZipBuilderService } from './services/zip-builder.service'

@Injectable()
export class IconService {
  constructor(
    private readonly sanitizer: SvgSanitizerService,
    private readonly renderer: ImageRendererService,
    private readonly zipBuilder: ZipBuilderService,
  ) {}

  validateSvg(svg: string): ValidateSvgResponse {
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
    const rasterFormatCount = dto.formats.filter((format) => format !== 'svg').length
    const outputFileCount = dto.sizes.length * rasterFormatCount + (dto.formats.includes('svg') ? 1 : 0)

    if (outputFileCount > MAX_OUTPUT_FILE_COUNT) {
      throw new BadRequestException(`输出文件过多，最多 ${MAX_OUTPUT_FILE_COUNT} 个。`)
    }

    const validation = this.sanitizer.validateAndSanitize(dto.svg)
    if (!validation.valid || !validation.sanitizedSvg) {
      throw new BadRequestException(validation.warnings.join('; '))
    }

    const archive = this.zipBuilder.createArchive(response)

    try {
      if (dto.formats.includes('svg')) {
        this.zipBuilder.appendBuffer(
          archive,
          Buffer.from(validation.sanitizedSvg),
          `${dto.filename}-export/${dto.filename}.svg`,
        )
      }

      for (const format of dto.formats) {
        if (format === 'svg') {
          continue
        }

        for (const size of dto.sizes) {
          const buffer = await this.renderer.render(validation.sanitizedSvg, size, format, dto)
          this.zipBuilder.appendBuffer(
            archive,
            buffer,
            `${dto.filename}-export/${this.buildFileName(dto.filename, size.width, size.height, format)}`,
          )
        }
      }

      await this.zipBuilder.finalize(archive)
    } catch (error) {
      archive.abort()
      throw new InternalServerErrorException(error instanceof Error ? error.message : '导出失败')
    }
  }

  private buildFileName(filename: string, width: number, height: number, format: Exclude<ExportFormat, 'svg'>) {
    return `${filename}-${width}x${height}.${format === 'jpeg' ? 'jpg' : format}`
  }
}
