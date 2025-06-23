export function generateRandomNickname(base?: string): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8); // 6자리 랜덤 문자열
  return base ? `${base}_${randomSuffix}` : `user_${randomSuffix}`;
}
