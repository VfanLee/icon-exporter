import { Body, Controller, Header, Post, Res } from '@nestjs/common'
import type { Response } from 'express'
import { ExportIconDto, PreviewIconDto } from './dto/export-icon.dto'
import { ValidateSvgDto } from './dto/validate-svg.dto'
import { IconService } from './icon.service'

@Controller('api/icon')
export class IconController {
  constructor(private readonly iconService: IconService) {}

  @Post('validate')
  validateSvg(@Body() dto: ValidateSvgDto) {
    return this.iconService.validateSvg(dto.svg)
  }

  @Post('preview')
  @Header('Content-Type', 'image/png')
  async previewIcon(@Body() dto: PreviewIconDto, @Res() res: Response) {
    const buffer = await this.iconService.previewIcon(dto)
    res.send(buffer)
  }

  @Post('export')
  async exportIcon(@Body() dto: ExportIconDto, @Res() res: Response) {
    const buffer = await this.iconService.exportIcon(dto)

    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', 'attachment; filename="icons.zip"')
    res.setHeader('Content-Length', buffer.byteLength.toString())

    res.send(buffer)
  }
}
