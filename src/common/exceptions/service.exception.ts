import { HttpException } from '@nestjs/common';

export class ServiceException extends HttpException {
  constructor(message: string | Record<string, any>, status: number) {
    super(message, status);
  }
}
