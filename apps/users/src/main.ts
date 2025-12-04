import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);

  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Users service is running on http://localhost:${port}`);
    console.log(`Swagger is running on http://localhost:${port}/api-docs`);
  });
}
bootstrap();
