import { Module } from '@nestjs/common'
import { IconController } from './icon.controller'
import { IconService } from './icon.service'
import { IcoBuilderService } from './services/ico-builder.service'
import { IcnsBuilderService } from './services/icns-builder.service'
import { ImageRendererService } from './services/image-renderer.service'
import { SvgSanitizerService } from './services/svg-sanitizer.service'
import { ZipBuilderService } from './services/zip-builder.service'

@Module({
  controllers: [IconController],
  providers: [IconService, SvgSanitizerService, ImageRendererService, IcoBuilderService, IcnsBuilderService, ZipBuilderService],
})
export class IconModule {}
