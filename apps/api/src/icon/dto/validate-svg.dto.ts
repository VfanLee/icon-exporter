import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'
import { SVG_MAX_BYTES } from '@icon-forge/shared'

export class ValidateSvgDto {
  @ApiProperty({ example: '<svg viewBox="0 0 24 24"></svg>' })
  @IsString()
  @MaxLength(SVG_MAX_BYTES)
  svg!: string
}
