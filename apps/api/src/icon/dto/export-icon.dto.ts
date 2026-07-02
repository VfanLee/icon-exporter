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
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import {
  EXPORT_FORMATS,
  FIT_MODES,
  MAX_EXPORT_SIZE,
  MAX_FORMAT_COUNT,
  MAX_SIZE_COUNT,
  RESIZE_POSITIONS,
} from '@icon-forge/shared'
import type { ExportFormat, FitMode } from '@icon-forge/shared'

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

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  avif?: number
}

export class ExportResizeOptionsDto {
  @IsOptional()
  @IsIn(RESIZE_POSITIONS)
  position?: string
}

export class ExportTransformOptionsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  rotate?: number

  @IsOptional()
  @IsBoolean()
  flip?: boolean

  @IsOptional()
  @IsBoolean()
  flop?: boolean
}

export class ExportSharpenOptionsDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean

  @IsOptional()
  @IsNumber()
  @Min(0.3)
  @Max(10)
  sigma?: number
}

export class ExportModulateOptionsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(3)
  brightness?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(3)
  saturation?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  hue?: number
}

export class ExportEffectsOptionsDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ExportSharpenOptionsDto)
  sharpen?: ExportSharpenOptionsDto

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  blur?: number

  @IsOptional()
  @IsBoolean()
  greyscale?: boolean

  @IsOptional()
  @IsHexColor()
  tint?: string | null

  @IsOptional()
  @IsBoolean()
  negate?: boolean

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ExportModulateOptionsDto)
  modulate?: ExportModulateOptionsDto

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  gamma?: number

  @IsOptional()
  @IsBoolean()
  normalise?: boolean
}

export class ExportTrimOptionsDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(255)
  threshold?: number
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

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ExportResizeOptionsDto)
  resize?: ExportResizeOptionsDto

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ExportTransformOptionsDto)
  transform?: ExportTransformOptionsDto

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ExportEffectsOptionsDto)
  effects?: ExportEffectsOptionsDto

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ExportTrimOptionsDto)
  trim?: ExportTrimOptionsDto
}

export class PreviewIconDto extends ExportIconDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ExportSizeDto)
  previewSize!: ExportSizeDto
}
