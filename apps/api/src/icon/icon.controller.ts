import { Body, Controller, Header, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { ExportIconDto } from './dto/export-icon.dto';
import { ValidateSvgDto } from './dto/validate-svg.dto';
import { IconService } from './icon.service';

@ApiTags('icon')
@Controller('api/icon')
export class IconController {
  constructor(private readonly iconService: IconService) {}

  @Post('validate')
  @ApiBody({ type: ValidateSvgDto })
  @ApiOkResponse({ description: 'SVG validation result' })
  validateSvg(@Body() dto: ValidateSvgDto) {
    return this.iconService.validateSvg(dto.svg);
  }

  @Post('export')
  @Header('Content-Type', 'application/zip')
  @ApiBody({ type: ExportIconDto })
  async exportIcon(@Body() dto: ExportIconDto, @Res() res: Response) {
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${dto.filename}-export.zip"`,
    );

    await this.iconService.exportIcon(dto, res);
  }
}
