import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsHexColor,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import { EXPORT_FORMATS, FIT_MODES, MAX_EXPORT_SIZE, MAX_FORMAT_COUNT, MAX_SIZE_COUNT } from '@icon-exporter/shared'
import type { ExportFormat, FitMode } from '@icon-exporter/shared'

export class ExportSizeDto {
  @IsInt()
  @Min(1)
  @Max(MAX_EXPORT_SIZE)
  width!: number

  @IsInt()
  @Min(1)
  @Max(MAX_EXPORT_SIZE)
  height!: number
}

export class ExportBackgroundDto {
  @IsBoolean()
  transparent!: boolean

  @IsHexColor()
  color!: string
}

export class ExportQualityDto {
  @IsInt()
  @Min(1)
  @Max(100)
  webp!: number

  @IsInt()
  @Min(1)
  @Max(100)
  jpeg!: number
}

export class ExportIconDto {
  @IsString()
  svg!: string

  @IsString()
  @Matches(/^[a-zA-Z0-9._-]+$/)
  filename!: string

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_SIZE_COUNT)
  @ValidateNested({ each: true })
  @Type(() => ExportSizeDto)
  sizes!: ExportSizeDto[]

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_FORMAT_COUNT)
  @IsIn(EXPORT_FORMATS, { each: true })
  formats!: ExportFormat[]

  @IsObject()
  @ValidateNested()
  @Type(() => ExportBackgroundDto)
  background!: ExportBackgroundDto

  @IsNumber()
  @Min(0)
  @Max(0.5)
  padding!: number

  @IsNumber()
  @Min(0)
  @Max(0.5)
  borderRadius!: number

  @IsIn(FIT_MODES)
  fit!: FitMode

  @IsObject()
  @ValidateNested()
  @Type(() => ExportQualityDto)
  quality!: ExportQualityDto
}
