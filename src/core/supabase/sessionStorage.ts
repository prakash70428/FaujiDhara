// Android / iOS: React Native has no browser localStorage, so expo-sqlite provides one
// backed by a small on-device database. Supabase keeps the login session there,
// which is why the user stays logged in after closing the app.
import 'expo-sqlite/localStorage/install';

export const sessionStorage = globalThis.localStorage;
