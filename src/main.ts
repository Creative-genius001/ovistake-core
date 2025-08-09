/* eslint-disable prettier/prettier */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression'
import morgan from 'morgan'

export async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: {
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      }
    },
  );

  app.use(helmet());
  // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(compression());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(morgan('combined'));
  app.enableVersioning();

  const reflector = app.get(Reflector);

  // app.useGlobalFilters(
  //   new HttpExceptionFilter(reflector),
  //   new QueryFailedFilter(reflector),
  // );

  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(reflector),
  //   new TranslationInterceptor(
  //     app.select(SharedModule).get(TranslationService),
  //   ),
  // );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );




  const port = 3000;

  await app.listen(port);
  console.info(`server running on ${await app.getUrl()}`);

}

bootstrap();
