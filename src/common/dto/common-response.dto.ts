import { HttpStatus } from '@nestjs/common';
import { ResponseMessage } from './response-message.enum';

export class CommonResponseDto<T> {
  private statusCode: number;
  private message: string | ResponseMessage;
  private data?: T;

  constructor(statuscode: number, message: string, data?: T) {
    this.statusCode = statuscode;
    this.message = message;
    this.data = data;
  }

  static success<T>(message: ResponseMessage, data: T): CommonResponseDto<T> {
    const statusCode =
      message === ResponseMessage.CREATE_SUCCESS
        ? HttpStatus.CREATED
        : HttpStatus.OK;

    return new CommonResponseDto<T>(statusCode, message, data);
  }

  static successNoContent<T>(message: ResponseMessage): CommonResponseDto<T> {
    const statusCode =
      message === ResponseMessage.CREATE_SUCCESS
        ? HttpStatus.CREATED
        : HttpStatus.OK;

    return new CommonResponseDto<T>(statusCode, message);
  }
}
