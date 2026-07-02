import { Injectable } from '@nestjs/common';
import sharp, { type FitEnum } from 'sharp';
import type { ExportFormat, ExportSize } from '@icon-exporter/shared';
import type { ExportIconDto } from '../dto/export-icon.dto';

@Injectable()
export class ImageRendererService {
  async render(
    svg: string,
    size: ExportSize,
    format: Exclude<ExportFormat, 'svg'>,
    options: ExportIconDto,
  ) {
    const paddingX = Math.floor(size.width * options.padding);
    const paddingY = Math.floor(size.height * options.padding);
    const innerWidth = Math.max(1, size.width - paddingX * 2);
    const innerHeight = Math.max(1, size.height - paddingY * 2);
    const background = this.getBackground(format, options);

    let image = sharp(Buffer.from(svg), { density: 384 }).resize({
      width: innerWidth,
      height: innerHeight,
      fit: options.fit as keyof FitEnum,
      background,
    });

    if (options.padding > 0) {
      image = image.extend({
        top: paddingY,
        bottom: paddingY,
        left: paddingX,
        right: paddingX,
        background,
      });
    }

    image = image.resize({
      width: size.width,
      height: size.height,
      fit: 'fill',
    });

    switch (format) {
      case 'png':
        return image.png().toBuffer();
      case 'webp':
        return image.webp({ quality: options.quality.webp }).toBuffer();
      case 'jpeg':
        return image
          .flatten({ background: options.background.color })
          .jpeg({ quality: options.quality.jpeg })
          .toBuffer();
    }
  }

  private getBackground(format: Exclude<ExportFormat, 'svg'>, options: ExportIconDto) {
    if (format !== 'jpeg' && options.background.transparent) {
      return { r: 255, g: 255, b: 255, alpha: 0 };
    }

    return options.background.color;
  }
}
