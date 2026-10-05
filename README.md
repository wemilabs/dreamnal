# Dreamnal

A dream journal you can talk to. Record a dream the moment you wake up, Grok
speech-to-text turns it into an entry, and you edit and keep it. You can also
type it.

Live at [dreamnal.vercel.app](https://dreamnal.vercel.app). It installs as a
PWA on iOS, Android and desktop.

The service worker only registers in production, so test offline and install
behavior with `pnpm build && pnpm start`.

Architecture notes and conventions live in [AGENTS.md](./AGENTS.md).
