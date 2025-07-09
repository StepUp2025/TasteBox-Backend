export const updateUserProfileValidationErrorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: 400 },
    message: {
      type: 'object',
      example: {
        nickname: [
          '닉네임을 입력해주세요.',
          '닉네임은 2~10자 사이로 입력해주세요.',
        ],
        contact: ['휴대폰 번호는 숫자만 9~11자리로 입력해주세요.'],
      },
    },
    error: { type: 'string', example: 'VALIDATION_ERROR' },
    timestamp: { type: 'string', example: '2025-07-04T03:44:00.000Z' },
  },
};
