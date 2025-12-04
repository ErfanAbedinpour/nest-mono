import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { GlobalRpcExceptionFilter } from '@app/_shared/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3002,
      },
    },
  );
  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  await app.listen();
}
bootstrap();
