export const passwordValidationErrorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: 400 },
    message: {
      type: 'object',
      example: {
        currentPassword: [
          '기존 비밀번호를 입력해주세요.',
          '기존 비밀번호는 문자열이어야 합니다.',
        ],
        newPassword: [
          '새 비밀번호를 입력해주세요.',
          '새 비밀번호는 문자열이어야 합니다.',
          '새 비밀번호는 6~20자 사이여야 하며, 공백 없이 영문, 숫자, 특수문자만 사용할 수 있어요.',
        ],
        newPasswordConfirm: [
          '새 비밀번호 확인을 입력해주세요.',
          '새 비밀번호 확인은 문자열이어야 합니다.',
          '새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.',
        ],
      },
    },
    error: { type: 'string', example: 'VALIDATION_ERROR' },
    timestamp: { type: 'string', example: '2025-07-04T03:44:00.000Z' },
  },
};
