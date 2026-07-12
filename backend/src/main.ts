import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow requests from the frontend
  app.enableCors();

  // Run backend on port 3001
  await app.listen(3001);

  console.log("🚀 Backend running at http://localhost:3001");
}

bootstrap();