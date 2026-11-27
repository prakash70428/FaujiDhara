import Constants from 'expo-constants';

/** Public facts about the app, shown on the About screen and used in links. */
export const APP_INFO = {
  name: 'FaujiDhara',
  /** User-facing version from app.json ("1.0.0"). */
  version: Constants.expoConfig?.version ?? '0.0.0',
  /** Hosted from docs/privacy-policy.md by GitHub Pages. Must match the Play Console field. */
  privacyPolicyUrl: 'https://prakash70428.github.io/FaujiDhara/privacy-policy',
  sourceUrl: 'https://github.com/prakash70428/FaujiDhara',
  /** Public support address, same as the Play Store listing. */
  contactEmail: 'faujidhara@gmail.com',
} as const;
