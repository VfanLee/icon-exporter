import { Body, Controller, Header, Post, Res } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import { ExportIconDto, PreviewIconDto } from './dto/export-icon.dto'
import { ValidateSvgDto } from './dto/validate-svg.dto'
import { IconService } from './icon.service'

@ApiTags('icon')
@Controller('api/icon')
export class IconController {
  constructor(private readonly iconService: IconService) {}

  @Post('validate')
  @ApiBody({ type: ValidateSvgDto })
  @ApiOkResponse({ description: 'SVG 校验结果' })
  validateSvg(@Body() dto: ValidateSvgDto) {
    return this.iconService.validateSvg(dto.svg)
  }

  @Post('preview')
  @Header('Content-Type', 'image/png')
  @ApiBody({ type: PreviewIconDto })
  @ApiOkResponse({ description: 'PNG 预览图' })
  async previewIcon(@Body() dto: PreviewIconDto, @Res() res: Response) {
    const buffer = await this.iconService.previewIcon(dto)
    res.send(buffer)
  }

  @Post('export')
  @Header('Content-Type', 'application/zip')
  @ApiBody({ type: ExportIconDto })
  async exportIcon(@Body() dto: ExportIconDto, @Res() res: Response) {
    res.setHeader('Content-Disposition', `attachment; filename="${dto.filename}-export.zip"`)

    await this.iconService.exportIcon(dto, res)
  }
}
