import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  MAX_OUTPUT_FILE_COUNT,
  type ExportFormat,
  type ValidateSvgResponse,
} from '@icon-exporter/shared';
import type { Response } from 'express';
import { ExportIconDto } from './dto/export-icon.dto';
import { ImageRendererService } from './services/image-renderer.service';
import { SvgSanitizerService } from './services/svg-sanitizer.service';
import { ZipBuilderService } from './services/zip-builder.service';

@Injectable()
export class IconService {
  constructor(
    private readonly sanitizer: SvgSanitizerService,
    private readonly renderer: ImageRendererService,
    private readonly zipBuilder: ZipBuilderService,
  ) {}

  validateSvg(svg: string): ValidateSvgResponse {
    return this.sanitizer.validateAndSanitize(svg);
  }

  async exportIcon(dto: ExportIconDto, response: Response) {
    const rasterFormatCount = dto.formats.filter((format) => format !== 'svg').length;
    const outputFileCount =
      dto.sizes.length * rasterFormatCount + (dto.formats.includes('svg') ? 1 : 0);

    if (outputFileCount > MAX_OUTPUT_FILE_COUNT) {
      throw new BadRequestException(
        `Too many output files. Maximum is ${MAX_OUTPUT_FILE_COUNT}.`,
      );
    }

    const validation = this.sanitizer.validateAndSanitize(dto.svg);
    if (!validation.valid || !validation.sanitizedSvg) {
      throw new BadRequestException(validation.warnings.join('; '));
    }

    const archive = this.zipBuilder.createArchive(response);

    try {
      if (dto.formats.includes('svg')) {
        this.zipBuilder.appendBuffer(
          archive,
          Buffer.from(validation.sanitizedSvg),
          `${dto.filename}-export/${dto.filename}.svg`,
        );
      }

      for (const format of dto.formats) {
        if (format === 'svg') {
          continue;
        }

        for (const size of dto.sizes) {
          const buffer = await this.renderer.render(
            validation.sanitizedSvg,
            size,
            format,
            dto,
          );
          this.zipBuilder.appendBuffer(
            archive,
            buffer,
            `${dto.filename}-export/${this.buildFileName(
              dto.filename,
              size.width,
              size.height,
              format,
            )}`,
          );
        }
      }

      await this.zipBuilder.finalize(archive);
    } catch (error) {
      archive.abort();
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Export failed',
      );
    }
  }

  private buildFileName(
    filename: string,
    width: number,
    height: number,
    format: Exclude<ExportFormat, 'svg'>,
  ) {
    const extension = format === 'jpeg' ? 'jpg' : format;
    return `${filename}-${width}x${height}.${extension}`;
  }
}
