import { Injectable } from '@nestjs/common'
import sharp, { type Color, type FitEnum, type Sharp } from 'sharp'
import {
  DEFAULT_EFFECTS_OPTIONS,
  DEFAULT_RESIZE_OPTIONS,
  DEFAULT_TRANSFORM_OPTIONS,
  DEFAULT_TRIM_OPTIONS,
  RASTER_DENSITY,
  type ExportFormat,
  type ExportSize,
} from '@icon-forge/shared'
import type { ExportIconDto } from '../dto/export-icon.dto'

@Injectable()
export class ImageRendererService {
  async render(svg: string, size: ExportSize, format: Exclude<ExportFormat, 'svg'>, options: ExportIconDto) {
    const image = await this.buildPipeline(svg, size, options)
    return this.encode(image, format, options)
  }

  async renderPreview(svg: string, size: ExportSize, options: ExportIconDto) {
    const image = await this.buildPipeline(svg, size, options)
    return image.png().toBuffer()
  }

  private async buildPipeline(svg: string, size: ExportSize, options: ExportIconDto): Promise<Sharp> {
    const resizeOpts = { ...DEFAULT_RESIZE_OPTIONS, ...options.resize }
    const transform = { ...DEFAULT_TRANSFORM_OPTIONS, ...options.transform }
    const effects = this.mergeEffects(options)
    const trim = { ...DEFAULT_TRIM_OPTIONS, ...options.trim }

    const paddingX = Math.floor(size.width * options.padding)
    const paddingY = Math.floor(size.height * options.padding)
    const innerWidth = Math.max(1, size.width - paddingX * 2)
    const innerHeight = Math.max(1, size.height - paddingY * 2)

    let icon = sharp(Buffer.from(svg), { density: RASTER_DENSITY })

    if (trim.enabled) {
      icon = icon.trim({ threshold: trim.threshold })
    }

    icon = icon.resize({
      width: innerWidth,
      height: innerHeight,
      fit: options.fit as keyof FitEnum,
      position: resizeOpts.position,
      background: this.transparentBackground(),
    })

    if (transform.rotate !== 0) {
      icon = await this.applyCenterRotation(icon, transform.rotate, innerWidth, innerHeight)
    }
    if (transform.flip) {
      icon = icon.flip()
    }
    if (transform.flop) {
      icon = icon.flop()
    }

    if (effects.sharpen.enabled) {
      icon = icon.sharpen(effects.sharpen.sigma)
    }
    if (effects.blur > 0) {
      icon = icon.blur(effects.blur)
    }
    if (effects.greyscale) {
      icon = icon.greyscale()
    }
    if (effects.tint) {
      icon = icon.tint(effects.tint)
    }
    if (effects.negate) {
      icon = icon.negate()
    }
    if (effects.modulate.brightness !== 1 || effects.modulate.saturation !== 1 || effects.modulate.hue !== 0) {
      icon = icon.modulate({
        brightness: effects.modulate.brightness,
        saturation: effects.modulate.saturation,
        hue: effects.modulate.hue,
      })
    }
    if (effects.gamma !== 1) {
      icon = icon.gamma(effects.gamma)
    }
    if (effects.normalise) {
      icon = icon.normalise()
    }

    const rasterizedIcon = await icon.png().toBuffer()

    const composites: sharp.OverlayOptions[] = [
      {
        input: rasterizedIcon,
        left: paddingX,
        top: paddingY,
      },
    ]

    if (options.borderRadius > 0) {
      composites.push({
        input: await this.createRoundedMask(size, options.borderRadius),
        blend: 'dest-in',
      })
    }

    return sharp({
      create: {
        width: size.width,
        height: size.height,
        channels: 4,
        background: this.getBackground('png', options),
      },
    }).composite(composites)
  }

  private async applyCenterRotation(
    icon: Sharp,
    angle: number,
    innerWidth: number,
    innerHeight: number,
  ): Promise<Sharp> {
    const iconBuffer = await icon.png().toBuffer()
    const { width = innerWidth, height = innerHeight } = await sharp(iconBuffer).metadata()
    const padSize = Math.ceil(Math.sqrt(width ** 2 + height ** 2))
    const padTop = Math.floor((padSize - height) / 2)
    const padLeft = Math.floor((padSize - width) / 2)

    const rotatedBuffer = await sharp(iconBuffer)
      .extend({
        top: padTop,
        bottom: padSize - height - padTop,
        left: padLeft,
        right: padSize - width - padLeft,
        background: this.transparentBackground(),
      })
      .rotate(angle, { background: this.transparentBackground() })
      .png()
      .toBuffer()

    const { width: rotatedWidth = padSize, height: rotatedHeight = padSize } = await sharp(rotatedBuffer).metadata()
    const cropLeft = Math.max(0, Math.floor((rotatedWidth - innerWidth) / 2))
    const cropTop = Math.max(0, Math.floor((rotatedHeight - innerHeight) / 2))
    const cropWidth = Math.max(1, Math.min(innerWidth, rotatedWidth - cropLeft))
    const cropHeight = Math.max(1, Math.min(innerHeight, rotatedHeight - cropTop))

    const croppedBuffer = await sharp(rotatedBuffer)
      .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
      .png()
      .toBuffer()

    const { width: croppedWidth = cropWidth, height: croppedHeight = cropHeight } =
      await sharp(croppedBuffer).metadata()
    const compositeLeft = Math.floor((innerWidth - croppedWidth) / 2)
    const compositeTop = Math.floor((innerHeight - croppedHeight) / 2)

    return sharp({
      create: {
        width: innerWidth,
        height: innerHeight,
        channels: 4,
        background: this.transparentBackground(),
      },
    }).composite([
      {
        input: croppedBuffer,
        left: compositeLeft,
        top: compositeTop,
      },
    ])
  }

  private async encode(
    image: Sharp,
    format: Exclude<ExportFormat, 'svg'>,
    options: ExportIconDto,
  ): Promise<Buffer> {
    switch (format) {
      case 'png':
        return image.png().toBuffer()
      case 'webp':
        return image.webp({ quality: options.quality.webp }).toBuffer()
      case 'jpeg':
        return image
          .flatten({ background: options.background.color })
          .jpeg({ quality: options.quality.jpeg })
          .toBuffer()
      case 'avif':
        return image.avif({ quality: options.quality.avif ?? 50 }).toBuffer()
      default: {
        const _exhaustive: never = format
        throw new Error(`Unsupported format: ${_exhaustive}`)
      }
    }
  }

  private mergeEffects(options: ExportIconDto) {
    const defaults = DEFAULT_EFFECTS_OPTIONS
    const effects = options.effects

    return {
      sharpen: { ...defaults.sharpen, ...effects?.sharpen },
      blur: effects?.blur ?? defaults.blur,
      greyscale: effects?.greyscale ?? defaults.greyscale,
      tint: effects?.tint ?? defaults.tint,
      negate: effects?.negate ?? defaults.negate,
      modulate: { ...defaults.modulate, ...effects?.modulate },
      gamma: effects?.gamma ?? defaults.gamma,
      normalise: effects?.normalise ?? defaults.normalise,
    }
  }

  private getBackground(format: Exclude<ExportFormat, 'svg'>, options: ExportIconDto): Color {
    if (format !== 'jpeg' && format !== 'avif' && options.background.transparent) {
      return this.transparentBackground()
    }

    return options.background.color
  }

  private transparentBackground(): Color {
    return { r: 255, g: 255, b: 255, alpha: 0 }
  }

  private async createRoundedMask(size: ExportSize, borderRadius: number) {
    const radius = Math.round(Math.min(size.width, size.height) * borderRadius)

    const maskSvg = Buffer.from(
      `<svg width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size.width}" height="${size.height}" rx="${radius}" ry="${radius}" fill="white"/>
      </svg>`,
    )

    return sharp(maskSvg).resize(size.width, size.height, { fit: 'fill' }).png().toBuffer()
  }
}
