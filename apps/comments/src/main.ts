import { NestFactory } from '@nestjs/core';
import { CommentsModule } from './comments.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CommentsModule);

  const config = new DocumentBuilder()
    .setTitle('Comments API')
    .setDescription('The comments API description')
    .setVersion('1.0')
    .addTag('comments')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3004;
  await app.listen(port, () => {
    console.log(`Comments service is running on http://localhost:${port}`);
    console.log(`Swagger is running on http://localhost:${port}/api-docs`);
  });
}
bootstrap();
