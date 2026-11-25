# Release Guide: v1.0 se Play Store tak

Har step ke aage likha hai ki kaun karega: **[Tum]** = sirf tum kar sakte ho (account, payment, ID), **[Dev]** = code/config ka kaam, is repo mein.

---

## Timeline (personal developer account)

```
Din 0      Play Console account + ID verification shuru          [Tum]
Din 0-3    v1.0 code ready (ye PR)                               [Dev] ✅
Din 1-3    Expo account, pehla build, app Play Console mein banao [Tum + Dev]
Din 3      Closed testing release, 12+ testers opt-in → ⏱ 14 din shuru
Din 3-17   Testers app use karein; hum v1.1 (login) taiyar karein
Din 17+    "Apply for production" → Google review (aksar ≤ 7 din)
Din ~24    🎉 App public
```

Google ka rule: personal accounts (13 Nov 2023 ke baad bane) ko production se pehle **closed test mein kam se kam 12 testers, lagatar 14 din** chahiye. 12 se zyada (15–20) rakho, kyunki koi opt-out kare aur 12 se kam ho jaayein toh ghadi phir se shuru ho sakti hai.

---

## Step 1: Accounts [Tum]

1. **Google Play Console**: <https://play.google.com/console/signup>
   - Account type: **Personal** (Organization ke liye D-U-N-S number aur registered company chahiye)
   - $25 ek baar, aur ID verification (Aadhaar/PAN/Passport). Isme kuch din lag sakte hain.
   - Developer name: jo store par dikhega (jaise `Prakash` ya `FaujiDhara`)
2. **Expo account**: <https://expo.dev/signup> (free). Phir terminal mein:
   ```powershell
   npx eas-cli@latest login
   ```

## Step 2: Contact email + Privacy Policy online [Tum]

1. Ek email chuno jo store par **public** dikhega. Suggestion: ek nayi Gmail, jaise `faujidhara.app@gmail.com`.
2. `docs/privacy-policy.md` aur `docs/store-listing.md` mein `[CONTACT_EMAIL]` badlo. Ya mujhe email batao, main badal dunga.
3. GitHub repo → **Settings → Pages** → Source: _Deploy from a branch_ → Branch: `main`, folder `/docs` → Save.
4. 1–2 minute baad ye khulna chahiye: <https://prakash70428.github.io/FaujiDhara/privacy-policy>

## Step 3: EAS project jodna [Tum chalao, ek baar]

```powershell
npx eas-cli@latest init
```

Ye `app.json` mein `extra.eas.projectId` aur `owner` jod dega. Us change ko commit karna hai.

## Step 4: Pehle phone par test (APK) [Tum]

```powershell
npx eas-cli@latest build --platform android --profile preview
```

- Build Expo ke cloud mein banta hai (~10–20 min). Link aayega, phone par kholke APK install karo.
- **Check:** icon, splash, Fasal list, ek rajya, ek paudha, 3D ghumana, X-Ray, About screen.
- Isi phone se **store ke screenshots** le lo (`docs/store-listing.md` mein list hai).

## Step 5: Production build (AAB) [Tum]

```powershell
npx eas-cli@latest build --platform android --profile production
```

Pehli baar EAS poochega ki Android keystore bana de: **Yes**. Keystore Expo ke paas safe rehta hai.
Build hone par `.aab` file download karo.

## Step 6: Play Console mein app banao [Tum]

1. **Create app**: name `FaujiDhara: Fasal Calendar 3D`, language Hindi (hi-IN) ya English (India), App, Free.
2. **Dashboard → Set up your app**: har section `docs/store-listing.md` ke "App content" table se bharo.
3. **Store listing**: text + icon + feature graphic + screenshots (sab `docs/store-listing.md` mein).

## Step 7: Closed testing release [Tum]

1. **Testing → Closed testing → Create track** (ya default "Closed testing - Alpha").
2. **Testers**: _Email list_ banao aur 15–20 Gmail IDs daalo. Ya ek Google Group banao.
3. **Create new release** → App integrity: **Google-generated key** (Play App Signing) → `.aab` upload karo → release notes (`docs/store-listing.md`) → **Save → Review → Start rollout**.
4. Review ke baad (kuch ghante se 2 din) **opt-in link** milega. Ye link testers ko bhejo:
   - Link kholo → **Become a tester** → Play Store se install karo.
   - 14 din tak uninstall **nahi** karna. Beech-beech mein app kholna.

> Pehli baar ke baad har update ke liye: `eas build -p android --profile production --auto-submit` (iske liye Google service account key chahiye, wo hum baad mein set karenge).

## Step 8: Production [Tum, din ~17]

**Dashboard → Apply for production**. Google kuch sawaal poochta hai (testing kaise hui, kya feedback mila). Sach-sach aur detail mein likho. Testers ke feedback ke baad jo badla, wo bhi batao.

---

## Har release se pehle checklist [Dev + Tum]

- [ ] `npm run check` green, aur GitHub Actions CI green
- [ ] `CHANGELOG.md` updated, `app.json` → `version` badhaya
- [ ] Preview APK asli phone par test kiya
- [ ] Naya data collect ho raha hai? → Privacy policy + Data safety + App access same release mein update
- [ ] Release notes (Hindi + English)
- [ ] Git tag: `git tag v1.0.0` → `git push origin v1.0.0`

## v1.1 (login) se pehle zaroori [Dev]

- [ ] App ke andar **account delete** ka option + web link (Play policy)
- [ ] Privacy policy v1.1 (phone, naam, rajya/zila, Supabase Mumbai region)
- [ ] Supabase se **test phone numbers hatana** ya expiry set karna
- [ ] Asli SMS provider (Twilio/MSG91) + rate limits
- [ ] Data safety form update
- [ ] Review ke liye "App access" mein demo login (test number + OTP)
