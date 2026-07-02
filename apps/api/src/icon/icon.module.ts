import { Module } from '@nestjs/common'
import { IconController } from './icon.controller'
import { IconService } from './icon.service'
import { ImageRendererService } from './services/image-renderer.service'
import { SvgSanitizerService } from './services/svg-sanitizer.service'
import { ZipBuilderService } from './services/zip-builder.service'

@Module({
  controllers: [IconController],
  providers: [IconService, SvgSanitizerService, ImageRendererService, ZipBuilderService],
})
export class IconModule {}
