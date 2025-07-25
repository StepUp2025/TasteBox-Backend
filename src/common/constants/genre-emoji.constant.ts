import { ContentType } from '../enums/content-type.enum';

export const GENRE_EMOJI_MAP: {
  [key in ContentType]: { [key: string]: string };
} & {
  DEFAULT: string;
} = {
  [ContentType.MOVIE]: {
    액션: '🔫',
    모험: '🧭',
    애니메이션: '🎨',
    코미디: '😂',
    범죄: '🕵️',
    다큐멘터리: '🎥',
    드라마: '🎭',
    가족: '👨‍👩‍👧‍👦',
    판타지: '🐉',
    역사: '📜',
    공포: '👻',
    음악: '🎵',
    미스터리: '🕵️',
    로맨스: '💕',
    SF: '🚀️',
    'TV 영화': '📺',
    스릴러: '😱',
    전쟁: '🗡️',
    서부: '🤠',
  },
  [ContentType.TVSERIES]: {
    '액션 & 어드벤처': '🗡️',
    애니메이션: '🎨',
    코미디: '😂',
    범죄: '🕵️',
    다큐멘터리: '🎥',
    드라마: '🎭',
    가족: '👨‍👩‍👧‍👦',
    키즈: '🧒',
    미스터리: '🕵️',
    뉴스: '📰',
    리얼리티: '📸',
    'SF & 판타지': '🪐',
    '막장 드라마': '💄',
    토크쇼: '🎙️',
    '전쟁 & 정치': '🪖',
    서부: '🤠',
  },
  DEFAULT: '✨',
};
