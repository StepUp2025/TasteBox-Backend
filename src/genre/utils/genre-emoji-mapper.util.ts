export function mapGenreToEmoji(genreName: string): string {
  const mapping: Record<string, string> = {
    // 한글 장르명
    액션: '🔥',
    모험: '🗺️',
    애니메이션: '🎨',
    코미디: '😂',
    범죄: '🕵️',
    다큐멘터리: '🎥',
    드라마: '🎭',
    가족: '👨‍👩‍👧',
    판타지: '🧚',
    역사: '📜',
    공포: '👻',
    음악: '🎵',
    미스터리: '❓',
    로맨스: '❤️',
    SF: '🚀',
    'TV 영화': '📺',
    스릴러: '🔪',
    전쟁: '⚔️',
    서부: '🤠',

    // TV 영어 장르
    'action & adventure': '🔥',
    comedy: '😂',
    documentary: '🎥',
    drama: '🎭',
    family: '👨‍👩‍👧',
    mystery: '❓',
    western: '🤠',
    kids: '🧒',
    news: '📰',
    reality: '📺',
    'sci-fi & fantasy': '🚀🔮',
    talk: '🗣️',
    'war & politics': '⚔️',
  };

  const key = genreName.toLowerCase();
  return mapping[key] || '🎬'; // 기본 이모지
}
