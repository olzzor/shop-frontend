export const API_BASE_URL = 'http://localhost.test:8080';
export const OAUTH2_REDIRECT_URI = 'http://localhost.test:3000/oauth2/redirect'
export const ACCESS_TOKEN = 'accessToken';

export const getAuthUrl = (provider) => `${API_BASE_URL}/oauth2/authorize/${provider}?redirect_uri=${OAUTH2_REDIRECT_URI}`;
// export const getAuthUrl = (provider) => `${API_BASE_URL}/oauth2/authorize/${provider}?redirect_uri=${encodeURIComponent(OAUTH2_REDIRECT_URI)}`;

export const GOOGLE_AUTH_URL = getAuthUrl('google');
export const FACEBOOK_AUTH_URL = getAuthUrl('facebook');
export const GITHUB_AUTH_URL = getAuthUrl('github');
export const NAVER_AUTH_URL = getAuthUrl('naver');
export const KAKAO_AUTH_URL = getAuthUrl('kakao');