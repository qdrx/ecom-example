import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const redisClient = new Redis({
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  });
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'sessions:',
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());
  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: parseInt(process.env.SESSION_TIMEOUT, 10) || 7200000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  if (configService.get('enviroment') !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('E-commerce application DOCUMENTATION')
      .setDescription('E-commerce application API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(configService.get('PORT'), '0.0.0.0', () =>
    console.log('App listening on PORT: ' + configService.get('PORT')),
  );
}

bootstrap().then(() => console.log('Started successfully'));
