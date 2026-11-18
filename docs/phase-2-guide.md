# Phase 2 Guide: Project Foundation

Is phase mein app ki neev bani. Har cheez ke liye **What** (kya hai), **Why** (kyun chuna) aur **How** (kaise kaam karta hai).

---

## App chalana

```bash
npm install          # pehli baar, ya package.json badalne ke baad
npx expo start       # QR code aayega
```

- **Phone pe:** Play Store se **Expo Go** install karo aur QR code scan karo. Phone aur computer ek hi Wi-Fi pe hone chahiye.
- **Browser mein:** terminal mein `w` dabao, ya `npm run web` chalao.
- Ajeeb error aaye toh cache saaf karke chalao: `npx expo start --clear`

Code check karne ke commands:

| Command             | Kya karta hai                                          |
| ------------------- | ------------------------------------------------------ |
| `npm run typecheck` | TypeScript ki galtiyan pakadta hai                     |
| `npm run lint`      | Code ki common galtiyan pakadta hai (ESLint)           |
| `npm run format`    | Saari files ek jaisi formatting mein                   |
| `npx expo-doctor`   | Package versions SDK ke saath match karte hain ya nahi |

---

## 1. Expo SDK 58 + TypeScript

**What:** Expo React Native ke upar ek toolkit hai: camera, files, build, updates sab ready milta hai. TypeScript JavaScript mein _types_ jodta hai.

**Why:**

- Expo se Android Studio ke bina app ban jaata hai. Expo Go se phone pe turant dekh sakte ho, aur EAS cloud mein Play Store wala build bana deta hai.
- TypeScript galti code _chalne se pehle_ pakad leta hai. Jaise kisi ne `user.distict` likh diya (spelling galat), toh editor wahin laal line dikha dega.

**How:** `tsconfig.json` mein `strict: true` aur `noUncheckedIndexedAccess: true` on hain. Doosra option array/object se nikli value ko "shayad undefined" maanta hai, jisse "undefined is not an object" wale crash kam hote hain.

> **Node 26 kyun install kiya?** Expo 58 / React Native 0.88 ko Node 22.13+ chahiye. Aapke paas 20.9 tha.

---

## 2. Expo Router (navigation)

**What:** File-based navigation: `src/app/` mein har file ek screen hai.

```
src/app/
├── _layout.tsx        → Root: poore app ka wrapper + error boundary
├── +not-found.tsx     → Galat link pe ye screen
└── (tabs)/
    ├── _layout.tsx    → Neeche ka tab bar
    ├── index.tsx      → Feed   (route: /)
    ├── khet.tsx       → Khet   (route: /khet)
    ├── fasal.tsx      → Fasal  (route: /fasal)
    └── profile.tsx    → Profile (route: /profile)
```

**Why:**

- Naya screen = nayi file, alag se route register nahi karna padta.
- Deep links free mein milte hain: `faujidhara://khet` kisi ko WhatsApp pe bhejo toh seedha wo screen khulegi (Phase 5 mein listing share karne ke kaam aayega).
- `typedRoutes: true` se galat route ka link likhoge toh TypeScript pakad lega.

**How:**

- `package.json` mein `"main": "expo-router/entry"`. App yahin se start hota hai, isliye purani `App.tsx` aur `index.ts` hata di.
- `_layout.tsx` = "is folder ki screens kaise dikhengi" (Stack ya Tabs).
- `(tabs)` bracket wala folder ek **group** hai: files ko organize karta hai par URL mein nahi aata. Phase 3 mein `(auth)` group aayega (login screens), aur login na ho toh user wahan bheja jayega.
- **Rule:** `src/app/` mein sirf screens. Baaki sab (components, hooks) `src/features/` ya `src/shared/` mein.

---

## 3. NativeWind (Tailwind styling)

**What:** `className="bg-primary-600 p-4 rounded-xl"` likh ke style karna, jaise web pe Tailwind.

**Why:**

- `StyleSheet.create` mein har style ka naam sochna aur file ke neeche likhna padta hai. Tailwind mein style wahin dikhti hai jahan component hai.
- Theme colors ek jagah define hote hain, toh poore app mein same "fauji green" use hota hai.

**Version:** NativeWind **4.2.7** (stable, Tailwind v3). v5 abhi release candidate hai, production ke liye risky.

**How (5 files milke kaam karti hain):**

| File                  | Kaam                                                         |
| --------------------- | ------------------------------------------------------------ |
| `tailwind.config.js`  | Kaun si files scan karni hain + humare colors                |
| `global.css`          | Tailwind ki base styles. Sirf root `_layout.tsx` mein import |
| `babel.config.js`     | `className` prop ko samajhne layak banata hai                |
| `metro.config.js`     | CSS ko native styles mein badalta hai                        |
| `nativewind-env.d.ts` | TypeScript ko batata hai ki `className` valid prop hai       |

> **Ek bug jo fix kiya:** Tailwind ka default `darkMode: 'media'` web pe crash karta tha (white screen). `darkMode: 'class'` set kiya, kyunki dark mode hum khud control karenge (app abhi light-only hai).

---

## 4. Theme (`src/shared/theme/`)

**What:** App ke saare rang ek file mein: `palette.js`.

| Naam         | Rang                  | Matlab                                    |
| ------------ | --------------------- | ----------------------------------------- |
| `primary`    | Olive green `#556B2F` | Fauji ki vardi                            |
| `earth`      | Mitti brown `#8B5E3C` | Khet ki mitti                             |
| `wheat`      | Sunehra `#E0B94A`     | Pakki fasal                               |
| `background` | Cream `#FAF7F0`       | Aankhon pe halka, dhoop mein padhne layak |

**Why `.js` aur `.ts` dono?**

- `palette.js` plain JavaScript hai, kyunki `tailwind.config.js` TypeScript file import nahi kar sakta.
- `colors.ts` usi palette ko TypeScript code ke liye deta hai, un jagah jahan className nahi chalta (tab bar icons, aur aage 3D materials).
- Ek hi source of truth: rang badalna ho toh sirf `palette.js` badlo.

Fonts abhi system ke hain. Custom font ki jagah system font Hindi (Devanagari) bina extra download ke dikha deta hai, aur app halka rehta hai.

---

## 5. Shared UI Kit (`src/shared/ui/`)

Har component poore app mein reuse hoga. Import hamesha ek hi jagah se: `import { Button, Card } from '@/shared/ui'`.

### `Button`

- **What:** Ek button jiske 4 variants (`primary`, `secondary`, `ghost`, `danger`) aur 2 sizes (`md`, `lg`) hain, plus `loading` state.
- **Why:**
  - Har screen pe button ke rang alag-alag na likhne pade. Design badalna ho toh ek file badlo.
  - `lg` = 56px uncha, taaki khet mein mitti wale ya motte haath se bhi aaram se dabe.
  - `loading` ke dauraan button disable ho jaata hai, taaki user do baar dabaa ke do post na bana de.
- **How:** Variant → className ka ek `Record` map. `Record<ButtonVariant, string>` ki wajah se naya variant jodo aur style likhna bhool jao, toh TypeScript error dega. `accessibilityRole="button"` screen reader ko batata hai ki ye button hai.

### `Input`

- **What:** TextInput ke saath label upar aur error neeche.
- **Why:** Phase 3 (login, profile) aur Phase 5 (listing form) mein dozens of fields honge. Har jagah same look aur same error dikhane ka tareeka.
- **How:** `error` prop aaya toh border laal aur message neeche. Validation logic Input ke andar nahi hai, screen/hook decide karta hai. Input sirf dikhata hai (separation of concerns).

### `Card`

- **What:** Safed rounded box.
- **Why:** Post, khet listing aur fasal info sab card mein dikhenge.
- **How:** `className` prop se bahar se extra style jod sakte ho: `<Card className="gap-4">`.

### `Screen`

- **What:** Har screen ka base wrapper: same background aur padding.
- **Why:** Har screen pe `flex-1 bg-background p-4` likhna repeat hota, aur kahin bhool gaye toh UI alag dikhega.
- **How:** `scroll` prop do toh ScrollView banta hai (forms ke liye). Lambi lists ke liye bina scroll ke Screen + `FlatList` use karenge, kyunki ScrollView ke andar FlatList performance kharab karti hai.

### `EmptyState`

- **What:** Icon + title + message, jab list khaali ho.
- **Why:** Khaali safed screen dekh ke user sochta hai app toot gaya. Empty state batata hai ki "abhi kuch nahi hai, aur yahan kya aayega".

### `ErrorFallback`

- **What:** Crash ki jagah dikhne wali screen, "Dobara try karein" button ke saath. Dev mode mein asli error bhi dikhta hai.

### `cn()` helper (`src/shared/lib/cn.ts`)

- **What:** Conditions ke saath classNames jodna: `cn('p-4', active && 'bg-primary-600')`.
- **Why:** Bina iske `${active ? 'bg-primary-600' : ''}` jaise template strings padhne mein mushkil hote hain.
- **Limitation:** Conflicts resolve nahi karta (`px-2` + `px-4` dono rahenge), isliye override hamesha aakhir mein do.

---

## 6. Error handling (`src/core/errors.ts` + Error Boundary)

**What:** Do level ka safety net.

1. **`AppError`:** Poore app ki ek error type, jiske codes hain: `NETWORK`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION`, `UNKNOWN`.
2. **Error Boundary:** Agar koi screen render karte waqt crash ho, toh `src/app/_layout.tsx` ka `ErrorBoundary` use pakad ke `ErrorFallback` dikha deta hai.

**Why:**

- Supabase, network aur hamari validation sab alag-alag shape ke errors dete hain. Agar UI ko har shape samajhni pade toh code bikhar jayega.
- Rule: **data layer har error ko `toAppError()` se `AppError` mein badlega**. UI sirf `code` dekhega aur `getUserMessage()` se user-friendly message dikhayega.
- Messages ek jagah hain, toh Phase 9 mein Hindi translation aasaan hogi.

**How:** Expo Router mein kisi bhi `_layout.tsx` se `export function ErrorBoundary` karo toh wo us layout ke andar ki saari screens ko protect karta hai.

---

## 7. Path alias `@/`

**What:** `import { Button } from '@/shared/ui'` likhna, `'../../../shared/ui'` ki jagah.
**Why:** File move karo toh imports nahi tootte, aur padhne mein saaf.
**How:** `tsconfig.json` mein `"paths": { "@/*": ["./src/*"] }`. Expo ka Metro isse automatically samajhta hai.

---

## 8. ESLint + Prettier

| Tool                          | Kaam                                                              | Config                                       |
| ----------------------------- | ----------------------------------------------------------------- | -------------------------------------------- |
| **ESLint**                    | Galtiyan pakadta hai: unused variables, galat hooks, missing keys | `eslint.config.js` (Expo ka official config) |
| **Prettier**                  | Formatting: quotes, spacing, line length                          | `.prettierrc`                                |
| `prettier-plugin-tailwindcss` | className ke andar classes ko ek fixed order mein sort karta hai  |                                              |

**Why:** Code hamesha ek jaisa dikhe, chahe koi bhi likhe. Review mein formatting pe behas nahi, sirf logic pe.

---

## 9. Feature folders (`src/features/`)

Abhi khaali hai, sirf `README.md` hai. Har feature ka folder usi phase mein banega jab wo feature banega (Phase 3 mein `auth/`). Har feature ke andar 4 layers:

```
domain/  →  data/  →  hooks/  →  components/ + screen
(types)    (Supabase)  (state)    (UI)
```

**Why khaali folders pehle se nahi banaye:** Khaali folders confuse karte hain ("isme kya daalna hai?"), aur git unhe track bhi nahi karta.

---

## Kya verify hua

- `npm run typecheck`: 0 errors
- `npm run lint`: 0 errors
- `npx expo-doctor`: 20/20 checks pass
- Android bundle aur web build dono bane
- Web pe (mobile size) chalaya: 4 tabs, theme colors, Profile pe UI kit, aur 1 akshar type karne pe error message aaya

**Abhi baaki:** Asli Android phone pe Expo Go se test. Ye aap kar sakte ho: `npx expo start` → QR scan.

## Phase 2 ke kuch chhote faisle

- App ka naam abhi `FaujiDhara` hai (`app.json` mein `name`), aur deep link scheme `faujidhara` hai. Naam final hone pe ye 2 jagah badalni hongi.
- App abhi sirf light mode mein hai (`userInterfaceStyle: "light"`).
