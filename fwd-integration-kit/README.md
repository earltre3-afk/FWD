# FWD integration kit

This folder is for any host app that wants to open FWD from a plus button inside messages or comments.

## Basic flow

1. Add a plus button beside your message/comment input.
2. Open `FwdPickerModal`.
3. Pass your deployed FWD URL, for example `https://fwd.treytv.com`.
4. Listen for `FWD_GIF_SELECTED`.
5. Attach the returned `gif` payload to your message/comment draft.

The FWD app itself stays standalone. The host app only embeds `/embed/picker`.

## Event returned by FWD

```ts
{
  type: 'FWD_GIF_SELECTED',
  provider: 'fwd',
  gif: {
    id, title, mediaUrl, previewUrl, thumbnailUrl,
    width, height, duration, format, altText, tags
  },
  usage: { source, context, userUid, mode }
}
```

## Included files

- `FwdAppDrawerButton.tsx` - plus-button drawer with FWD app option
- `FwdPickerModal.tsx` - bottom-sheet/desktop modal iframe wrapper
- `fwdTypes.ts` - GIF payload and event types

