import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const collectMessages = (errors: ValidationError[]): string[] => {
          return errors.flatMap((error) => {
            const messages: string[] = [];

            if (error.constraints) {
              messages.push(
                ...Object.values(error.constraints).map((msg) =>
                  msg.replace(/events\.\d+\./, 'event.'),
                ),
              );
            }

            if (error.children && error.children.length > 0) {
              messages.push(...collectMessages(error.children));
            }

            return messages;
          });
        };

        const messages = collectMessages(errors);
        return new BadRequestException(messages);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
