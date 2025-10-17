import { NestFactory } from '@nestjs/core';
import { BlogsModule } from './blogs.module';

async function bootstrap() {
  const app = await NestFactory.create(BlogsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
