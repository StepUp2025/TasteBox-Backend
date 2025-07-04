import { BadRequestException } from './bad-request.exception';

export class ValidationException extends BadRequestException {
  constructor(messages: Record<string, string[]>) {
    super(messages, 'VALIDATION_ERROR');
  }
}
