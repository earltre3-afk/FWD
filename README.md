# FWD

**FWD** is a standalone futuristic GIF, reaction, meme, and short-loop app.

It includes:

- Premium neon liquid-glass interface
- GIF/reaction discovery
- Search and categories
- GIF detail pages
- Favorites and collections
- Upload-to-GIF editor
- Camera-to-GIF recorder with front/back camera support
- Compact `/embed/picker` for host apps
- Message/comment app-drawer demo
- Optional Supabase persistence hooks
- Vercel-ready SPA routing

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Key routes

- `/` landing page
- `/home` main FWD app
- `/search` search/browse
- `/create` upload-to-GIF editor
- `/camera` camera-to-GIF recorder
- `/favorites` saved reaction vault
- `/collections` collections
- `/profile` profile
- `/demo` plus-button app drawer demo
- `/embed/picker` lightweight embeddable GIF picker

## Camera note

Browser camera access requires HTTPS in production or `localhost` during development. If permission is denied, FWD falls back to upload.

## Embedded picker

Open this route from any host app:

```txt
/embed/picker?source=host_app&context=message&mode=compact&theme=dark
```

When a GIF is selected, FWD sends:

```json
{
  "type": "FWD_GIF_SELECTED",
  "provider": "fwd",
  "gif": {
    "id": "unique-gif-id",
    "title": "GIF title",
    "mediaUrl": "gif-or-video-url",
    "previewUrl": "preview-url",
    "thumbnailUrl": "thumbnail-url",
    "width": 480,
    "height": 270,
    "duration": 2.8,
    "format": "gif",
    "altText": "Short description",
    "tags": ["reaction", "funny"]
  },
  "usage": {
    "source": "host_app",
    "context": "message",
    "mode": "compact"
  }
}
```

It also supports:

```json
{ "type": "FWD_PICKER_CLOSED" }
```

## Optional environment variables

FWD works without backend setup for local demos. Add these only when persistent uploads are ready:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Optional SQL lives at `docs/fwd_supabase_schema.sql`.

## Host app integration

See `fwd-integration-kit/` for a clean React modal example and event types.

## Design direction

Keep the FWD identity intact:

- Dark futuristic background
- Liquid-glass panels
- Neon purple, pink, cyan, and electric blue glow
- Double fast-forward logo
- Mobile-first layout
- No white logo boxes
- No fake engagement numbers
