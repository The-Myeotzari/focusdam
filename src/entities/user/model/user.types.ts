export type SocialProvider = 'google' | 'kakao' | 'apple';

export type UserAccount = {
  name: string;
  email: string;
  socialProvider: SocialProvider;
};
