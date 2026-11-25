# Engineering Workflow

Kaam kaise hota hai, taaki `main` branch hamesha Play Store pe bhejne layak rahe.

---

## 1. Branches

| Branch                   | Kya hai                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| `main`                   | Hamesha chalne wala, release-ready code. Seedha push **nahi** karte |
| `feat/<naam>`            | Naya feature, jaise `feat/community-feed`                           |
| `fix/<naam>`             | Bug fix, jaise `fix/otp-resend-timer`                               |
| `chore/<naam>`           | Tooling, CI, dependencies                                           |
| `release/<version>-prep` | Release ki taiyari (icons, store config)                            |

**Flow:** branch banao → chhote commits → GitHub pe Pull Request (PR) → CI green → merge into `main`.

```powershell
git switch main
git pull
git switch -c feat/community-feed
# ... kaam + commits ...
git push -u origin feat/community-feed
```

Phir GitHub pe **Compare & pull request** dabao.

## 2. Commit messages

Pehli line: kya badla, aaj ke tense mein, 72 akshar se kam. Neeche khaali line, phir _kyun_.

```
Add resend timer to OTP screen

Supabase allows one OTP per 60 seconds per number; without a timer users
tapped resend and saw a rate-limit error.
```

## 3. CI (GitHub Actions)

`.github/workflows/ci.yml` har push aur PR pe chalta hai:

| Step              | Command                  |
| ----------------- | ------------------------ |
| Formatting        | `npm run format:check`   |
| Lint              | `npm run lint`           |
| TypeScript        | `npm run typecheck`      |
| Unit tests        | `npm test`               |
| Crop data         | `npm run validate:crops` |
| Expo dependencies | `npx expo-doctor`        |

Commit se pehle wahi checks local pe chala lo: `npm run check`.

## 4. `main` ko protect karna (ek baar, GitHub pe)

Repo → **Settings → Branches → Add branch ruleset** (ya "Add rule"):

- Branch: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass → **Lint, typecheck, test** chuno
- ✅ Block force pushes

Isse galti se toota hua code `main` mein nahi jayega.

## 5. Feature flags

`src/core/config/features.ts` mein switch hain. Jo feature bana hai par release ke liye taiyar nahi, wo
code mein rehta hai par flag se band rehta hai. Release build (`eas.json`) mein flags env se set hote hain.

| Flag   | v1.0 | Kab on hoga                         |
| ------ | ---- | ----------------------------------- |
| `auth` | off  | v1.1: login + profile               |
| `feed` | off  | v1.2: community feed (needs `auth`) |
| `khet` | off  | v1.3: khet listings (needs `auth`)  |

Local pe on karke dekhna ho toh `.env.local` mein:

```
EXPO_PUBLIC_FEATURE_AUTH=true
```

## 6. Release karna

Poori checklist: [`docs/release-guide.md`](release-guide.md).

1. `CHANGELOG.md` mein `[Unreleased]` ko naye version mein badlo.
2. `app.json` mein `version` badhao (SemVer, upar dekho).
3. PR merge → `main`.
4. `eas build --platform android --profile production`
5. Play Console pe upload (pehli baar manual, baad mein `eas submit`).
6. Git tag: `git tag v1.0.0 && git push origin v1.0.0`
