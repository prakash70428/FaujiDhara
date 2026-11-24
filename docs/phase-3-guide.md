# Phase 3 Guide: Backend + Login (Supabase, Phone OTP)

Is phase mein app ko backend mila: user mobile number + OTP se login karta hai, Fauji ya Kisan role chunta hai, aur apni profile (naam, rajya, zila) banata hai. Har hisse ke liye **What / Why / How**.

---

## Pehle: tumhe kya setup karna hai (ek baar, ~20 minute)

Code ready hai, lekin Supabase project tumhare account mein banta hai. Jab tak ye nahi hota, app "Supabase setup baaki hai" screen dikhayega.

### Step 1: Supabase project banao

1. [supabase.com](https://supabase.com) pe free account banao aur **New project** banao.
   - Name: `faujidhara`
   - Region: **South Asia (Mumbai)**, kyunki users India mein hain aur isse app tez chalega.
   - Database password: strong rakho aur password manager mein save karo.
2. Project ban jaaye toh **Project Settings → API Keys** kholo. Wahan se do cheezein chahiye:
   - Project URL (`https://xxxx.supabase.co`)
   - **Publishable key** (`sb_publishable_...`)

> **Secret / service_role key kabhi app mein mat daalna.** Wo poore database ki chaabi hai.

### Step 2: Database schema chalao

Dashboard → **SQL Editor** → New query mein `supabase/migrations/20261124000000_profiles.sql` ki poori file paste karo aur **Run** karo. Isse `profiles` table, roles aur security rules ban jayenge.

### Step 3: Phone login on karo

Dashboard → **Authentication → Sign In / Providers → Phone**:

1. **Enable Phone provider** on karo.
2. Supabase ko SMS bhejne ke liye ek provider chahiye, chahe tum sirf test numbers use karo. Supabase ka **Twilio** option sabse aasaan hai: Twilio ka free trial account banao aur uski 3 values (Account SID, Auth Token, Message Service SID) yahan daalo.
3. **Test Phone Numbers and OTPs** mein development ke liye fake numbers daalo. Inpe asli SMS nahi jaata aur paisa nahi lagta:
   ```
   919876543210=123456, 919999999999=654321
   ```
   Format: country code ke saath, bina `+` aur bina space. **Test OTPs Valid Until** mein Play Store launch se pehle ki date rakho.

> ⚠️ Test number aur uska code jisko pata hai, wo us account mein login kar sakta hai. Launch se pehle test numbers hata dena (Phase 10 checklist mein hai).

### Step 4: App ko keys do

Project ke root mein `.env.example` ko copy karke `.env.local` naam se save karo aur values bharo:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

`.env.local` git mein nahi jaata (`.gitignore` mein hai). App restart karo: `npx expo start --clear`.

### Step 5: Test karo

1. Number daalo: `9876543210`, phir OTP `123456`.
2. Fauji ya Kisan chuno, naam, rajya aur zila bharo, aur **Shuru karein** dabao.
3. Tabs khul jayenge. Profile tab mein tumhari jaankari dikhegi.
4. App band karke dobara kholo. Login bana rehna chahiye.
5. Profile → Logout karo. Login screen wapas aani chahiye.

---

## Login ka flow

```
App khula
   │
   ▼
AuthProvider: device pe saved session hai?
   │
   ├── Nahi ──────────► /login  ──►  /verify (OTP)  ──► session mila
   │                                                       │
   └── Haan ─► profile hai?  ◄─────────────────────────────┘
                 ├── Nahi ──► /onboarding (role, naam, rajya, zila) ──► save
                 └── Haan ──► (tabs): Feed, Khet, Fasal, Profile
```

Kisi bhi screen pe `router.push('/feed')` jaisa code likhne ki zaroorat nahi. Status badalta hai, aur root layout khud sahi screens dikhata hai.

---

## 1. Supabase client: `src/core/supabase/`

**What:** Poore app mein Supabase se baat karne wala ek hi client.

**Why:**

- **Ek hi jagah:** agar kal backend badla, toh sirf yahi folder badlega.
- **Session yaad rehta hai:** phone pe session `expo-sqlite` ke localStorage mein save hota hai (Expo 58 ka official tareeka), aur web pe browser ke apne localStorage mein. Isliye app band karke kholne pe bhi user logged in rehta hai.
- **Battery bachat:** app background mein ho toh token refresh band rehta hai, aur wapas aate hi chalu ho jaata hai (`AppState` listener).

**How:**

| File                    | Kaam                                                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `client.ts`             | `getSupabase()`. Env keys na hon toh crash ki jagah `AppError('CONFIG')` deta hai.                          |
| `sessionStorage.ts`     | Phone: SQLite wala localStorage                                                                             |
| `sessionStorage.web.ts` | Web: browser ka localStorage. Metro `.web.ts` file web pe khud chunta hai.                                  |
| `toAppError.ts`         | Supabase ke har error ko hamare `AppError` mein badalta hai (jaise 429 → `RATE_LIMITED`, RLS → `FORBIDDEN`) |

> Publishable key app ke andar jaati hai, isliye koi bhi use nikaal sakta hai. **Ye theek hai.** Data ko key nahi bachati, RLS bachata hai (neeche dekho).

---

## 2. Database: `supabase/migrations/20261124000000_profiles.sql`

**What:** `profiles` table, jismein har user ki ek row hai: `role`, `full_name`, `state_id`, `district`, `is_verified`.

**Why har rule:**

| Rule                                         | Kyun                                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `id` = login user ki id, `on delete cascade` | Account delete ho toh profile bhi apne aap hat jaaye (Play Store ki account-deletion policy)           |
| `CHECK` constraints (naam 2–60 akshar)       | Koi app ko bypass karke kachra data na daal sake                                                       |
| RLS: sirf apni profile insert/update         | Koi doosre ki profile nahi badal sakta, chahe usne key chura li ho                                     |
| `profiles_guard` trigger                     | User khud ko `ADMIN` ya `is_verified = true` nahi bana sakta, aur signup ke baad role nahi badal sakta |
| `is_admin()` function                        | Admin (Phase 8) kisi ki bhi profile theek kar sake                                                     |
| `(state_id, district)` index                 | Phase 5 mein "mere zile ki zameen" wali search tez chale                                               |

**How:** RLS ka matlab hai ki har query database ke andar in rules se check hoti hai. App mein bug ho tab bhi database galat kaam nahi karne dega. Ye "defense in depth" hai: app bhi check karta hai, database bhi.

---

## 3. Auth feature: `src/features/auth/`

Phase 2 wale same 4 layers:

```
auth/
├── domain/       phone.ts, profileRules.ts, types.ts   ← koi React/Supabase nahi, tests yahin
├── data/         authRepository.ts, profileRepository.ts ← sirf yahan Supabase call
├── hooks/        AuthProvider, usePhoneLogin, useSaveProfile, useAsyncAction, useCountdown
└── components/   AuthShell, PhoneInput, RolePicker, StatePicker, ProfileForm
```

### domain/phone.ts

**What:** Number ko ek format mein badalna: `+919876543210` (E.164).
**Why:** Log number alag-alag tareeke se likhte hain (`98765 43210`, `+91-98765...`, `098765...`). Agar format ek na ho toh ek hi insaan ke do account ban jaate. Sirf 6–9 se shuru hone wale 10 ank maane jaate hain (Indian mobile).

### domain/profileRules.ts

**What:** Naam/zila ki validation.
**Why:** Same limits database ke `CHECK` mein bhi hain. App pehle hi saaf message dikha deta hai, taaki user ko server ka ajeeb error na dikhe. Naam Hindi (देवनागरी) mein bhi likh sakte ho.

### data/ (repositories)

**What:** `authRepository` (OTP bhejna/verify, logout) aur `profileRepository` (profile padhna/banana/badalna).
**Why:** Database `full_name` (snake_case) mein rakhta hai, jabki app `fullName` use karta hai. Ye conversion sirf yahin hota hai, isliye screens ko database ki shakal nahi pata.

### hooks/AuthProvider.tsx

**What:** Poore app ka login state: `status` = `loading | signedOut | needsProfile | ready | error | unconfigured`.
**How:**

1. Supabase ka `onAuthStateChange` listener batata hai ki session aaya ya gaya (login, logout, token refresh).
2. User badle toh uski profile load hoti hai. Har result `userId + attempt` ke saath save hota hai, isliye purane user ka late aaya jawab galti se naye user pe nahi lagta (race condition se bachaav).
3. `status` in dono se nikalta hai. Ye alag state nahi hai, isliye dono kabhi mismatch nahi hote.

### hooks/useAsyncAction.ts

**What:** Kisi bhi button ke async kaam (OTP bhejna, save) ke liye `loading` aur `error` sambhalta hai.
**Why:** Double-tap pe do baar OTP na jaaye, aur har screen pe same try/catch na likhna pade.

---

## 4. Screens aur route guard

| Route           | File                       | Kab dikhta hai |
| --------------- | -------------------------- | -------------- |
| `/login`        | `src/app/login.tsx`        | `signedOut`    |
| `/verify`       | `src/app/verify.tsx`       | `signedOut`    |
| `/onboarding`   | `src/app/onboarding.tsx`   | `needsProfile` |
| tabs + baaki    | `src/app/(tabs)/...`       | `ready`        |
| `/edit-profile` | `src/app/edit-profile.tsx` | `ready`        |

**How:** `src/app/_layout.tsx` mein `Stack.Protected guard={...}` (Expo Router ka current tareeka). Guard `false` ho toh wo screens exist hi nahi karti. Logged-out user `/fasal` ka link khole toh bhi seedha `/login` pe jayega (browser mein test kiya hai).

**Splash screen:** jab tak saved session check ho raha hai, splash screen dikhti rehti hai. Isse login screen ek pal ke liye "flash" nahi hoti.

### Mobile-first UX decisions

- **Number field:** `+91` pehle se likha hai, sirf ank type hote hain, aur phone pe number pad khulta hai.
- **OTP:** `autoComplete="sms-otp"` ki wajah se Android SMS se code khud bhar deta hai. 6 ank poore hote hi apne aap submit ho jaata hai.
- **Resend:** 60 second ka timer, kyunki Supabase bhi 60 second mein ek hi OTP deta hai.
- **Role:** dropdown ki jagah do bade card, saath mein samjhaane wali line.
- **Rajya:** full-screen list search ke saath (36 options chhote dropdown mein mushkil hain). State ids Fasal Calendar wali hi hain, taaki aage "mere rajya ki fasal" seedha khul sake.
- **Tablet/laptop:** form beech mein max 480px ka card hai, poori screen pe faila hua nahi.

---

## 5. Tests

```bash
npm test
```

`domain/` ke pure functions ke 9 unit tests hain (Node ka built-in test runner + `tsx`). Test likhte hi ek asli bug pakda gaya tha: OTP check karne wala regex galat ban raha tha aur sahi code ko bhi reject kar deta.

| Command             | Kya check karta hai            |
| ------------------- | ------------------------------ |
| `npm test`          | Phone aur profile ke rules     |
| `npm run typecheck` | TypeScript                     |
| `npm run lint`      | ESLint (React hooks rules bhi) |
| `npx expo-doctor`   | Package versions               |

---

## Is phase mein kya NAHI hua (jaan-boojh kar)

- **Account delete karne ka button:** Play Store ise maangta hai. Iske liye server-side Edge Function chahiye, isliye ye Phase 10 mein aayega.
- **Fauji verification (document upload):** Phase 8.
- **Hindi/English switch:** Phase 9. Saare messages ek jagah hain, isliye translate karna aasaan hoga.
- **Asli SMS (MSG91/Twilio paid):** launch ke time. Tab tak test numbers se kaam chalega.
