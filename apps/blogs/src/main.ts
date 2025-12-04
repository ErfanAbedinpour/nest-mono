import { NestFactory } from '@nestjs/core';
import { BlogsModule } from './blogs.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GlobalRpcExceptionFilter } from '@app/_shared/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BlogsModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3003,
      },
    },
  );
  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  await app.listen();
}
bootstrap();
