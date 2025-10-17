import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule,{
    transport:Transport.TCP,
    options:{
      host:"0.0.0.0",
      port:5001
    }
  });
  await app.listen();

}
bootstrap();
