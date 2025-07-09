export const loginValidationErrorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: 400 },
    message: {
      type: 'object',
      example: {
        email: ['이메일을 입력해주세요.', '이메일 형식이 올바르지 않습니다.'],
        password: ['비밀번호를 입력해주세요.'],
      },
    },
    error: { type: 'string', example: 'VALIDATION_ERROR' },
    timestamp: { type: 'string', example: '2025-07-04T03:44:00.000Z' },
  },
};
