import { Injectable } from '@nestjs/common';
import sharp, { type Color, type FitEnum } from 'sharp';
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

    const rasterizedIcon = await sharp(Buffer.from(svg), { density: 384 })
      .resize({
        width: innerWidth,
        height: innerHeight,
        fit: options.fit as keyof FitEnum,
        background: this.transparentBackground(),
      })
      .png()
      .toBuffer();

    let image = sharp({
      create: {
        width: size.width,
        height: size.height,
        channels: 4,
        background,
      },
    }).composite([
      {
        input: rasterizedIcon,
        left: paddingX,
        top: paddingY,
      },
    ]);

    if (options.borderRadius > 0) {
      image = image.composite([
        {
          input: this.createRoundedMask(size, options.borderRadius),
          blend: 'dest-in',
        },
      ]);
    }

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

  private getBackground(
    format: Exclude<ExportFormat, 'svg'>,
    options: ExportIconDto,
  ): Color {
    if (format !== 'jpeg' && options.background.transparent) {
      return this.transparentBackground();
    }

    return options.background.color;
  }

  private transparentBackground(): Color {
    return { r: 255, g: 255, b: 255, alpha: 0 };
  }

  private createRoundedMask(size: ExportSize, borderRadius: number) {
    const radius = Math.round(Math.min(size.width, size.height) * borderRadius);

    return Buffer.from(`
      <svg width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size.width}" height="${size.height}" rx="${radius}" ry="${radius}" fill="white"/>
      </svg>
    `);
  }
}
