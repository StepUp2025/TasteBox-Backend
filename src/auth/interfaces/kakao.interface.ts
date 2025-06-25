export interface KakaoProfile {
  nickname?: string;
  profile_image_url?: string;
  thumbnail_image_url?: string;
}

export interface KakaoAccount {
  email?: string;
  profile?: KakaoProfile;
}

export interface KakaoProfileResponse {
  kakao_account: KakaoAccount;
}
