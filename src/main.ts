import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // configure swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API Description Task Management')
    .setVersion('1.0')
    .build();

  const document= SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api',app,document)

  await app.listen(3000);
  console.log(`API Documentation : ${await app.getUrl()}/api`)
  
}
bootstrap();
