# Fasal Calendar + 3D Plant Guide

Roadmap ke Phase 6 (Fasal Calendar) aur Phase 7 (3D Plant Card) pehle bana liye gaye, kyunki app ka pehla maqsad hai **jaankari dekar logon ka bharosa jeetna**.

Har hisse ke liye **What** (kya hai), **Why** (kyun) aur **How** (kaise kaam karta hai).

---

## User kya dekhta hai

1. **Fasal tab:** sabse upar Rabi / Kharif / Zaid ke card, phir search, phir **28 rajya + 8 kendra shasit pradesh**, A se Z.
2. **State screen:** 4 tab (Sabziyan, Phal, Phool, Masale), har ek mein 15 paudhe. "Sirf is mahine boyi jaane wali" filter, aur "Abhi boyein" badge.
3. **Plant screen:**
   - **3D model** jo ungli se ghoomta hai aur do ungli se zoom hota hai
   - Zameen ke upar ki oonchai aur failaav, zameen ke neeche jad ki gehrai aur failaav (CAD jaisi rangeen lines)
   - **Mitti X-Ray**, **Insaan (5.5 ft)** se tulna, aur badhvar ki avastha (1/3/5 saal ya Paudh → Fasal taiyar)
   - Boai ka mahina, katai, paani, dhoop, mitti
   - **Saathi paudhe** (kyun ke saath) aur **inse door rakhein**
   - **Khet ki salah**, aur KVK se milane ki imaandaar salah

---

## Folder structure

```
src/features/
├── crops/                      ← "Kya ugaana hai" ki jaankari
│   ├── domain/                 Pure TypeScript: koi React, koi 3D nahi
│   │   ├── types.ts            Plant, IndianState, PlantForm...
│   │   ├── growth.ts           Badhvar ki avastha → naap
│   │   ├── rules.ts            Pahad vs maidan ke boai ke mahine
│   │   └── format.ts           "2–3 ft", "Oct–Dec" jaisi formatting
│   ├── data/
│   │   ├── plants/             183 paudhon ka catalog (4 files)
│   │   ├── states.ts           36 states/UTs ki lists
│   │   ├── seasons.ts          Rabi/Kharif/Zaid
│   │   └── cropRepository.ts   Data ka akela darwaza
│   ├── hooks/                  Screen ko data dene wale hooks
│   └── components/             Cards, tabs, lists
│
└── plant3d/                    ← "Kaise dikhana hai" (3D)
    ├── domain/                 Camera ka hisaab, scene ka size, random
    ├── hooks/useOrbitGestures  Touch → rotate/zoom
    └── components/
        ├── Plant3DCard.tsx     Poora card (UI state)
        ├── Plant3DViewer.tsx   Canvas + buttons
        └── scene/              Sirf 3D cheezein
            ├── PlantScene.tsx  Light, mitti, paudha, jadein, naap
            ├── PlantBody.tsx   Form → sahi 3D model
            ├── forms/          9 shapes: Tree, Palm, Shrub, Herb, Vine, RootCrop, Bulb, Rhizome, Grass
            ├── Roots.tsx       Jadein (zameen ke neeche)
            ├── SoilBlock.tsx   Mitti ka cut-out block
            ├── DimensionLines.tsx  CAD-style naap
            └── CameraRig.tsx
```

**Dependency ka niyam:** `plant3d` → `crops/domain` (sirf types aur growth). `crops` kabhi `plant3d` ko import nahi karta. Iska matlab, 3D hata do toh bhi Fasal Calendar chalta rahega.

---

## 1. Data model: catalog + state lists

**What:** Har paudhe ki jaankari **ek baar** catalog mein (`data/plants/*.ts`), aur states sirf ID ki list rakhte hain (`states.ts`).

**Why:**

- Tamatar 25+ states mein hai. Agar har state mein uski poori detail copy hoti toh ek galti 25 jagah theek karni padti.
- Ab ek jagah sudhaaro, sab states mein theek.

**How:**

- `definePlants()` (`define.ts`) chhote field names (`h`, `w`, `rd`, `rw`) ko poore `Plant` type mein badalta hai, taaki 183 entries padhne layak rahein.
- Ek paudha doosri category ki list mein bhi aa sakta hai. Jaise methi Haryana mein sabzi hai aur Rajasthan mein masala.

### Naap ka matlab

- **Oonchai/failaav:** poore bade paudhe ka aam naap, ek range mein (jaise 2–6 ft), kyunki kism aur dekhbhaal se badalta hai.
- **Jad ki gehrai/failaav:** "effective root zone", yaani jahan zyadatar khurak lene wali jadein hoti hain. Sinchai aur khaad isi gehrai tak pahunchni chahiye. Pedon ki mukhya jad isse bhi gehri ja sakti hai.

### Data ki imaandaari

- Ladakh (phal 14, masale 8) aur Lakshadweep (phal 11, masale 9) mein **15 se kam** hain. Thandi registaan aur moonge ki mitti mein sach mein itna hi ugta hai. Galat bharti karne se bharosa tootta, isliye har aisi state mein `note` likha hai.
- Har plant page pe likha hai: "anumaan hain, KVK se milayein".

---

## 2. Data validation: `npm run validate:crops`

**What:** `scripts/validate-crops.ts` ek script hai jo data ki galtiyan pakadti hai.

**Why:** 183 paudhe × 36 states = hazaron IDs. Ek spelling galti (`tomatoo`) se app crash ho sakta hai.

**How:** Ye sab check karti hai:

- Har ID catalog mein hai ya nahi
- Har list mein 15 hain (ya `note` ke saath 8–14)
- Koi duplicate nahi
- Naap ki range sahi hai (min ≤ max)
- Saathi paudhe asli IDs hain
- Koi paudha saathi aur dushman dono nahi hai
- Exactly 28 + 8 states/UTs hain

**Data badalne ke baad hamesha ise chalayein.**

---

## 3. Repository + hooks

**What:** `cropRepository` hi data ka akela darwaza hai. Hooks (`useStateCrops`, `usePlantDetail`) screen ke liye data taiyar karte hain.

**Why:** Aaj data app ke andar hai, aur ye **offline bhi chalta hai** (gaon mein network kam hota hai). Kal Supabase se aaye toh sirf repository badlegi, ek bhi screen nahi.

**How:** ID na mile toh repository `AppError('NOT_FOUND')` throw karti hai. Route ka error boundary use pakad ke "Dobara try karein" screen dikhata hai.

---

## 4. Growth stages: `domain/growth.ts`

**What:** Badhvar ki avastha → naap.

**How:**

- **Bahu-varshiya (ped):** 1 / 3 / 5 saal / Poora. Factor = `(saal ÷ poora hone ke saal)^0.75`, yaani shuru mein tez badhvar, baad mein dheemi, jaise asli ped.
- **Mausami fasal:** Paudh (18%) → Badhvar (55%) → Phool (85%) → Fasal taiyar (100%).
- **Jadein shuru mein aage rehti hain:** `rootFactor` zyada hai, kyunki paudha pehle jad banata hai.

**Why chips, slider nahi:** React Native mein built-in slider nahi hai (extra library chahiye), aur khet mein bade button dabana patli slider kheenchne se aasan hai.

---

## 5. 3D: kyun procedural (code se bana)

**What:** 3D model koi `.glb` file nahi hai. Code paudhe ke **form + naap** se khud model banata hai.

**Why:**

- 183 paudhon ke asli 3D models kharidna ya banwana mehnga hai, aur app ka size 100+ MB ho jaata.
- Procedural model **asli naap (feet) pe** banta hai, isliye 3D aur legend ke numbers hamesha mel khaate hain.
- Har stage pe paudha sach mein bada hota dikhta hai.

**Imaandaar seema:** Ye "premium low-poly" style hai, car configurator jaisa photorealistic nahi. Asli models baad mein jodne ki jagah taiyar hai: `PlantBody.tsx` mein pehle `.glb` check karo, nahi mila toh procedural form.

### 9 forms

| Form    | Paudhe                   | Kya banta hai                             |
| ------- | ------------------------ | ----------------------------------------- |
| tree    | aam, amrood, imli        | Tana, shakhayein, gol chhatri, phal       |
| palm    | nariyal, kela, papita    | Lamba tana, jhuke patte, guchha           |
| shrub   | gulab, mirch, anar       | Kai tane, jhaadi                          |
| herb    | palak, genda, surajmukhi | Rosette ya lamba danthal + phool          |
| vine    | lauki, angoor, kaddu     | Khamba / machaan / zameen pe bel          |
| root    | gajar, mooli             | Patte upar, **khane wali jad mitti mein** |
| bulb    | pyaz, lahsun, tulip      | Nali jaise patte, gaanth                  |
| rhizome | adrak, haldi             | Patte + mitti mein aadi gaanth            |
| grass   | lemongrass, makka, baans | Patton ka guchha / baans                  |

**Same seed = same model:** `random.ts` mein seeded random hai, isliye paudha har baar ek jaisa dikhta hai aur stage badalne pe "kood" nahi karta.

---

## 6. Mid-range Android ke liye performance

| Tareeka                                   | Kahan           | Fayda                                                                  |
| ----------------------------------------- | --------------- | ---------------------------------------------------------------------- |
| `frameloop="demand"`                      | Viewer          | Kuch hil nahi raha toh GPU bilkul kaam nahi karta (battery bachti hai) |
| Shared geometry + material                | `kit.tsx`       | 50 patte = 1 geometry + 1 material                                     |
| Saari jadein ek geometry mein merge       | `Roots.tsx`     | 25 jadein = 1 draw call                                                |
| `dpr={[1, 1.5]}`                          | Viewer          | High-res sasta phone 3× pixel nahi khichta                             |
| Koi shadow nahi                           | Scene           | Shadows mobile GPU pe sabse mehngi cheez hain                          |
| List mein 2D card, 3D sirf detail page pe | `PlantListCard` | 15 canvas ek saath = garam phone                                       |
| `ErrorBoundary`                           | `Plant3DCard`   | GPU fail ho toh sirf 3D chhupta hai, baaki page chalta hai             |

---

## 7. Touch gestures: `OrbitController`

**What:** Camera ka saara hisaab ek plain class mein (`domain/orbit.ts`).

**Why class, React state nahi:** Drag karte waqt ~60 events per second aate hain. Har event pe React re-render ho toh phone atakta hai. Class numbers badalti hai aur sirf canvas se "naya frame" maangti hai.

**How:**

- `useOrbitGestures`: React Native `PanResponder` se ek ungli = ghumana/jhukaana, do ungli = zoom. Koi extra library nahi, aur Android, iOS, web teeno pe chalta hai.
- Jab tak user chhoota nahi, paudha dheere-dheere ghoomta hai (ye dikhane ke liye ki ye 3D hai).
- `step()` camera ko smooth (easing) target tak le jaata hai.

---

## 8. CAD-style naap: `DimensionLines.tsx`

| Rang     | Naap                              |
| -------- | --------------------------------- |
| Hara     | Oonchai (zameen ke upar)          |
| Narangi  | Failaav/chaudai (zameen ke upar)  |
| Neela    | Jad ki gehrai (zameen ke neeche)  |
| Baingani | Jad ka failaav (zameen ke neeche) |

- Lines mitti ke **upar** dikhti hain (`depthTest: false`), jaise CAD drawing mein annotation.
- Legend mein **wahi rang**, taaki line aur number turant mil jaayein.
- 3D mein text nahi hai, sirf legend mein. Mobile pe 3D text ke liye bhaari font library chahiye hoti.

---

## 9. Ek chhoti seekh: NativeWind aur lists

NativeWind v4 `SectionList`/`FlatList` ke `className` aur `contentContainerClassName` ko style mein nahi badalta. Isliye in lists pe seedha `style` aur `contentContainerStyle` diya hai. Baaki jagah className hi chalta hai.

---

## Kya verify hua

- `npm run typecheck`, `npm run lint`: saaf
- `npm run validate:crops`: 183 paudhe, 28 + 8 states/UTs, saari IDs sahi
- Android bundle (`expo export`) bana, 3D ke saath
- Web (mobile size) pe dekha:
  - Fasal list aur Punjab ki state screen
  - Aam (ped + X-Ray mein jadein), gajar (mitti mein jad), lauki (machaan + insaan)
  - Stage badalne pe naap badalna

**Abhi baaki:** Asli Android phone (Expo Go) pe 3D ki speed check karni hai. Web pe pehla frame screenshot mein kabhi-kabhi der se aata tha, par asli browser mein turant render hota hai.

## Agle kadam (sujhav)

- Naap aur salah kisi krishi visheshagya/KVK se review karwana. Ye data bharosa jeetne ka aadhar hai.
- Mashhoor paudhon (aam, gehun, tamatar) ke liye asli `.glb` models.
- Hindi (Devanagari) mein naam: Phase 9.
