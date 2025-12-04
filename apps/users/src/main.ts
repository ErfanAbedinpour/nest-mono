import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Users service is running on http://localhost:${port}`);
  });
}
bootstrap();
