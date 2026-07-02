import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ['http://localhost:5173'],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('IconForge API')
    .setDescription('本地 SVG 图标合成与导出')
    .setVersion('0.1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)

  await app.listen(3000)
}

void bootstrap()
