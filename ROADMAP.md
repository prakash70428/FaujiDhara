# Fauji Khet — Phase-wise Roadmap

> Faujis (veterans) aur Kisanon ko jodne wala **sirf mobile app**, Expo (React Native) se.
> Har coding phase mein har component ke saath **Why / What / How** samjhaya jayega.

---

## Pehle 3 bade decisions (aur kyun)

### 1. Monorepo ki jagah sirf ek Expo app

**Why:** Gemini wala prompt Web (Next.js) + Mobile + NestJS backend maangta hai. Akele ya chhoti team ke liye ye teen projects ka bojh hai: teen deploy, teen jagah bugs, teen dependency upgrades. MVP ka kaam hai jaldi users tak pahunchna.
**What:** Ek Expo + TypeScript app. Agar baad mein web chahiye toh Expo khud web bhi chala sakta hai (`expo start --web`).
**How:** Clean Architecture ke _ideas_ rakhenge (layers alag, business logic UI se alag), par heavy DDD ceremony nahi. Feature-wise folders.

### 2. Apna NestJS server nahi, Supabase (managed backend)

**Why:** Mobile app ko phir bhi ek backend chahiye: login, database, photos. Apna server banana aur chalana (hosting, security, scaling) MVP stage pe bahut mehnga hai. Supabase deta hai:

- **PostgreSQL**: wahi database jo Gemini ne suggest kiya tha
- **Phone OTP login**: kisanon ke liye email se behtar
- **Storage**: post aur khet ki photos ke liye
- **Row Level Security (RLS)**: database khud check karta hai ki kaun kya padh/likh sakta hai

**Trade-off:** Prisma ORM yahan use nahi hoga, kyunki Prisma server pe chalta hai, phone pe nahi. Schema SQL migrations se banega. Agar kabhi apna backend chahiye toh Postgres wahi rahega, sirf data move karna hoga.

### 3. 3D Plant Card baad mein (Phase 7)

**Why:** 3D (React Three Fiber + expo-gl) sabse bhaari aur risky feature hai, khaas kar mid-range Android pe. Agar core app (login, feed, listings) kaam nahi karta toh 3D ka koi fayda nahi. Pehle core app, phir "wow" feature.

---

## Folder structure (Phase 2 mein bana, poori detail: `docs/phase-2-guide.md`)

```
FaujiDhara/
├── src/
│   ├── app/                # Screens + navigation (expo-router: file = screen)
│   │   ├── (auth)/         # Login, OTP, role select (Phase 3)
│   │   ├── (tabs)/         # Feed, Khet, Fasal Calendar, Profile
│   │   └── _layout.tsx
│   ├── features/           # Har feature apne aap mein poora
│   │   ├── auth/
│   │   │   ├── domain/     # Types + business rules (koi React/Supabase nahi)
│   │   │   ├── data/       # Supabase calls (repository)
│   │   │   ├── hooks/      # UI ko data dene wale hooks
│   │   │   └── components/ # Sirf is feature ke UI pieces
│   │   ├── feed/
│   │   ├── khet/
│   │   ├── crops/          # Fasal calendar data
│   │   └── plant3d/
│   ├── shared/
│   │   ├── ui/             # Button, Card, Input (poore app mein reuse)
│   │   ├── theme/          # Colors, fonts
│   │   └── lib/            # Helpers, error handling
│   └── core/
│       ├── supabase.ts     # Ek hi jagah backend client
│       └── errors.ts       # AppError types
├── supabase/migrations/    # Database schema (SQL)
└── assets/                 # Icons, fonts, .glb models
```

Ye Clean Architecture ka simple version hai: **UI → hooks → data → Supabase**. UI kabhi seedha database ko nahi chhoota.

---

## Phases

### Phase 1 — Planning & Design (koi coding nahi) ✅

**What:**

- MVP features final karna (neeche "MVP scope" dekho)
- Har screen ka rough sketch (paper ya Figma)
- Data model: Users, Profiles, Posts, Khet Listings
- Language: Hindi + English dono? (Recommended: haan, Phase 9 mein)

**Done when:** Screen list aur data model pe sehmati ho jaye.

### Phase 2 — Project Foundation ✅ _(guide: `docs/phase-2-guide.md`)_

**What:** Expo + TypeScript project, expo-router (navigation), NativeWind (Tailwind styling), folder structure, ESLint + Prettier, theme (colors/fonts), shared UI components (Button, Card, Input), global error boundary.
**Why:** Neev mazboot ho toh har agla feature same pattern pe banta hai, aur code bikharta nahi.
**Done when:** App phone pe Expo Go mein khule, tabs ke beech navigate ho, aur shared Button/Card dikhe.

### Phase 3 — Backend + Auth

**What:**

- Supabase project, `profiles` table, roles: `FAUJI`, `KISAN`, `ADMIN`
- Phone OTP login, role chunna, profile banana (naam, state, district)
- RLS policies, session yaad rakhna (app band karke kholo toh login bana rahe)

**Why:** Har feature "ye user kaun hai" pe tika hai, isliye auth sabse pehle.
**Done when:** Naya user OTP se login kare, role chune, aur profile save ho.

### Phase 4 — Community Feed

**What:** Posts (text + photo), feed list (pagination), like/comment (optional), photo upload (compress karke).
**Why:** Community hi Fauji–Kisan connection ka dil hai, aur ye users ko app pe wapas laata hai.
**Done when:** Post banao, photo ke saath feed mein dikhe, scroll smooth ho.

### Phase 5 — Khet Listings

**What:** Zameen ki listing (area, location, soil, paani ka source), fasal, deal type (bechna / theke pe / batai / partnership), price, photos. State/district filter aur search, "Contact" button.
**Why:** Ye app ka asli business value hai, yahin Fauji aur Kisan milte hain.
**Done when:** Listing banao, filter karke dhoondo, aur owner se contact karo.

### Phase 6 — Fasal Calendar (Crop Guide)

**What:** Rabi/Kharif/Zaid ki jaankari, aur state + mahine ke hisab se sabzi, phal, phool. Ye data Gemini chat se aayega, par **pehle galtiyan theek karni hongi** (Makhana, Mahua, Walnut wagairah) aur chhoote states jodne honge.
**Why:** Offline kaam karne wala useful content, bina internet ke bhi value deta hai.
**How:** Data app ke andar JSON file mein, typed TypeScript ke saath. Server ki zaroorat nahi.
**Done when:** Apna state aur mahina chuno, aur sahi list dikhe.

### Phase 7 — 3D Plant Card

**What:** Aapka doosra prompt: `Plant3DViewer.tsx` (scene), `DimensionLines.tsx` (CAD-style naap), `PlantCard.tsx` (UI wrapper), soil plane, root/canopy measurements, X-Ray toggle, growth-stage slider.
**Why yahan:** Ab tak core app stable hoga. 3D ko Fasal Calendar se jodenge (fasal pe tap karo toh 3D dikhe).
**Risk:** Mid-range Android pe performance. Halke `.glb` models (draco compressed), low-poly fallback, aur purane phones pe 3D band karne ka option.
**Done when:** Kam se kam ek mid-range Android pe ~30fps pe ghoome, zoom ho, aur slider se naap badle.

### Phase 8 — Verification & Admin

**What:** Fauji verification (document upload → admin approve), verified badge, report/block, content moderation.
**Why:** Bharosa: zameen aur paise ke deal mein fake profiles sabse bada khatra hain.
**How:** Shuru mein admin ka kaam Supabase dashboard se, alag admin app nahi.

### Phase 9 — Polish

**What:** Hindi/English (i18n), offline caching, loading/empty/error states, accessibility (bade font, contrast), performance check, basic tests.

### Phase 10 — Release

**What:** EAS Build, app icon + splash, Privacy Policy (phone number aur documents lete hain, toh zaroori hai), Play Store listing, crash reporting (Sentry).

---

## MVP scope (pehli release)

Phase 2 → 3 → 4 → 5 → 6, plus Phase 10 ka minimum. 3D, verification badge aur Hindi pehle update mein aa sakte hain.

## Abhi khule sawaal

1. App ka naam: **Fauji Khet** ya **FaujiDhara** (folder ka naam)?
2. Backend: **Supabase** (recommended) ya apna server?
3. Pehle sirf Android, ya iOS bhi? (Recommended: Android pehle, kyunki zyada users wahi hain)
