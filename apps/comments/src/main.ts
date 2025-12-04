import { NestFactory } from '@nestjs/core';
import { CommentsModule } from './comments.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GlobalRpcExceptionFilter } from '@app/_shared/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CommentsModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3004,
      },
    },
  );
  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  await app.listen();
}
bootstrap();
