import { Injectable } from '@nestjs/common'
import sharp, { type Color, type FitEnum, type KernelEnum, type Sharp } from 'sharp'
import {
  DEFAULT_AVIF_OPTIONS,
  DEFAULT_EFFECTS_OPTIONS,
  DEFAULT_JPEG_OPTIONS,
  DEFAULT_METADATA_OPTIONS,
  DEFAULT_PNG_OPTIONS,
  DEFAULT_RASTER_OPTIONS,
  DEFAULT_RESIZE_OPTIONS,
  DEFAULT_TRANSFORM_OPTIONS,
  DEFAULT_TRIM_OPTIONS,
  DEFAULT_WEBP_OPTIONS,
  type ExportFormat,
  type ExportSize,
} from '@icon-exporter/shared'
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
    const raster = { ...DEFAULT_RASTER_OPTIONS, ...options.raster }
    const resizeOpts = { ...DEFAULT_RESIZE_OPTIONS, ...options.resize }
    const transform = { ...DEFAULT_TRANSFORM_OPTIONS, ...options.transform }
    const effects = this.mergeEffects(options)
    const trim = { ...DEFAULT_TRIM_OPTIONS, ...options.trim }
    const metadata = { ...DEFAULT_METADATA_OPTIONS, ...options.metadata }
    const alpha = {
      ensureAlpha: options.alpha?.ensureAlpha ?? false,
      removeAlpha: options.alpha?.removeAlpha ?? false,
    }

    const paddingX = Math.floor(size.width * options.padding)
    const paddingY = Math.floor(size.height * options.padding)
    const innerWidth = Math.max(1, size.width - paddingX * 2)
    const innerHeight = Math.max(1, size.height - paddingY * 2)

    let icon = sharp(Buffer.from(svg), {
      density: raster.density,
      limitInputPixels: raster.limitInputPixels,
    })

    if (trim.enabled) {
      icon = icon.trim({ threshold: trim.threshold })
    }

    icon = icon.resize({
      width: innerWidth,
      height: innerHeight,
      fit: options.fit as keyof FitEnum,
      position: resizeOpts.position,
      kernel: resizeOpts.kernel as keyof KernelEnum,
      withoutEnlargement: resizeOpts.withoutEnlargement,
      background: this.transparentBackground(),
    })

    if (transform.rotate !== 0) {
      icon = icon.rotate(transform.rotate, { background: this.transparentBackground() })
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
    if (
      effects.modulate.brightness !== 1 ||
      effects.modulate.saturation !== 1 ||
      effects.modulate.hue !== 0
    ) {
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

    if (alpha.ensureAlpha) {
      icon = icon.ensureAlpha()
    }
    if (alpha.removeAlpha) {
      icon = icon.removeAlpha()
    }

    const rasterizedIcon = await icon.png().toBuffer()

    let image = sharp({
      create: {
        width: size.width,
        height: size.height,
        channels: 4,
        background: this.getBackground('png', options),
      },
    }).composite([
      {
        input: rasterizedIcon,
        left: paddingX,
        top: paddingY,
      },
    ])

    if (options.borderRadius > 0) {
      image = image.composite([
        {
          input: this.createRoundedMask(size, options.borderRadius),
          blend: 'dest-in',
        },
      ])
    }

    if (!metadata.strip) {
      image = image.withMetadata()
    }

    return image
  }

  private async encode(image: Sharp, format: Exclude<ExportFormat, 'svg'>, options: ExportIconDto) {
    const png = { ...DEFAULT_PNG_OPTIONS, ...options.png }
    const webp = { ...DEFAULT_WEBP_OPTIONS, ...options.webp }
    const jpeg = { ...DEFAULT_JPEG_OPTIONS, ...options.jpeg }
    const avif = { ...DEFAULT_AVIF_OPTIONS, ...options.avif }

    switch (format) {
      case 'png':
        return image
          .png({
            compressionLevel: png.compressionLevel,
            palette: png.palette,
            effort: png.effort,
          })
          .toBuffer()
      case 'webp':
        return image
          .webp({
            quality: options.quality.webp,
            lossless: webp.lossless,
            nearLossless: webp.nearLossless,
            effort: webp.effort,
            smartSubsample: webp.smartSubsample,
          })
          .toBuffer()
      case 'jpeg':
        return image
          .flatten({ background: options.background.color })
          .jpeg({
            quality: options.quality.jpeg,
            progressive: jpeg.progressive,
            mozjpeg: jpeg.mozjpeg,
            chromaSubsampling: jpeg.chromaSubsampling,
          })
          .toBuffer()
      case 'avif':
        return image
          .avif({
            quality: options.quality.avif ?? 50,
            lossless: avif.lossless,
            effort: avif.effort,
          })
          .toBuffer()
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

  private createRoundedMask(size: ExportSize, borderRadius: number) {
    const radius = Math.round(Math.min(size.width, size.height) * borderRadius)

    return Buffer.from(`
      <svg width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size.width}" height="${size.height}" rx="${radius}" ry="${radius}" fill="white"/>
      </svg>
    `)
  }
}
