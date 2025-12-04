import { NestFactory } from '@nestjs/core';
import { BlogsModule } from './blogs.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BlogsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 3003, // Blogs service microservice port
    },
  });

  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('Blogs API')
    .setDescription('The blogs API description')
    .setVersion('1.0')
    .addTag('blogs')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    console.log(`Blogs service is running on http://localhost:${port}`);
    console.log(`Swagger is running on http://localhost:${port}/api-docs`);
  });
}
bootstrap();
