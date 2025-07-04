export const signupValidationErrorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: 400 },
    message: {
      type: 'object',
      example: {
        email: ['이메일을 입력해주세요.', '이메일 형식이 올바르지 않습니다.'],
        password: ['비밀번호를 입력해주세요.'],
        nickname: [
          '닉네임을 입력해주세요.',
          '닉네임은 2~10자 사이로 입력해주세요.',
        ],
        contact: [
          '휴대폰 번호를 입력해주세요.',
          '휴대폰 번호는 숫자만 9~11자리로 입력해주세요.',
        ],
        provider: ['가입 경로가 올바르지 않습니다.'],
      },
    },
    error: { type: 'string', example: 'VALIDATION_ERROR' },
    timestamp: { type: 'string', example: '2025-07-04T03:44:00.000Z' },
  },
};
