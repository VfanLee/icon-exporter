import { IsString, MaxLength } from 'class-validator'
import { SVG_MAX_BYTES } from '@icon-forge/shared'

export class ValidateSvgDto {
  @IsString()
  @MaxLength(SVG_MAX_BYTES)
  svg!: string
}
