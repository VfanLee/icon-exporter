import { BadRequestException, Injectable } from '@nestjs/common'
import { XMLParser } from 'fast-xml-parser'
import { SVG_MAX_BYTES } from '@icon-exporter/shared'
import type { ValidateSvgResponse } from '@icon-exporter/shared'

const FORBIDDEN_TAGS = ['script', 'foreignObject', 'iframe', 'object', 'embed']
const EXTERNAL_REF_PATTERN = /\b(?:href|xlink:href|src)\s*=\s*["'](?:https?:|\/\/|data:)/i
const EVENT_HANDLER_PATTERN = /\son[a-z]+\s*=/i
const EXTERNAL_STYLE_PATTERN = /@import|url\(\s*["']?(?:https?:|\/\/)/i

@Injectable()
export class SvgSanitizerService {
  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: false,
  })

  validateAndSanitize(svg: string): ValidateSvgResponse {
    const warnings: string[] = []
    const bytes = Buffer.byteLength(svg, 'utf8')

    if (bytes > SVG_MAX_BYTES) {
      throw new BadRequestException('SVG 超过 1MB 大小限制。')
    }

    if (!svg.trim().startsWith('<svg')) {
      return {
        valid: false,
        warnings: ['内容必须以 <svg> 元素开头。'],
      }
    }

    try {
      this.parser.parse(svg)
    } catch {
      return {
        valid: false,
        warnings: ['SVG XML 无法解析。'],
      }
    }

    for (const tag of FORBIDDEN_TAGS) {
      if (new RegExp(`<\\s*${tag}\\b`, 'i').test(svg)) {
        warnings.push(`发现禁止使用的标签：${tag}`)
      }
    }

    if (EVENT_HANDLER_PATTERN.test(svg)) {
      warnings.push('不允许使用事件处理属性。')
    }

    if (EXTERNAL_REF_PATTERN.test(svg)) {
      warnings.push('不允许引用外部图片或资源。')
    }

    if (EXTERNAL_STYLE_PATTERN.test(svg)) {
      warnings.push('不允许使用外部 CSS 导入或 URL。')
    }

    const dimensions = this.extractDimensions(svg)

    return {
      valid: warnings.length === 0,
      ...dimensions,
      warnings,
      sanitizedSvg: warnings.length === 0 ? this.stripXmlDeclaration(svg) : undefined,
    }
  }

  private stripXmlDeclaration(svg: string) {
    return svg.replace(/<\?xml[^>]*>\s*/i, '').trim()
  }

  private extractDimensions(svg: string) {
    const rootMatch = svg.match(/<svg\b([^>]*)>/i)
    const attrs = rootMatch?.[1] ?? ''
    const width = this.extractNumberAttr(attrs, 'width')
    const height = this.extractNumberAttr(attrs, 'height')
    const viewBox = attrs.match(/\bviewBox\s*=\s*["']([^"']+)["']/)?.[1]

    return {
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
      ...(viewBox ? { viewBox } : {}),
    }
  }

  private extractNumberAttr(attrs: string, name: string) {
    const match = attrs.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'i'))
    const number = match ? Number.parseFloat(match[1]) : undefined
    return Number.isFinite(number) ? number : undefined
  }
}
