# features/

Each app feature gets its own folder, created in the phase that builds it:

| Folder     | Phase                    |
| ---------- | ------------------------ |
| `auth/`    | 3: login, roles, profile |
| `feed/`    | 4: community posts       |
| `khet/`    | 5: land listings         |
| `crops/`   | 6: Fasal Calendar data   |
| `plant3d/` | 7: 3D plant card         |

Inside every feature, the same four layers:

```
feed/
├── domain/      # Types and pure rules. No React, no Supabase. Easy to test.
├── data/        # Talks to Supabase. Converts errors to AppError.
├── hooks/       # Connects data to screens (loading / error / data).
└── components/  # UI used only by this feature.
```

Rule: arrows only point one way. **screen → hooks → data → Supabase.**
A screen never imports Supabase directly, and `domain/` never imports from the other layers.
Shared things go in `src/shared/`, not in another feature.
