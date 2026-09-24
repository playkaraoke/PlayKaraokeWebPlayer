<p align="center">
  <img src="assets/logo.svg" alt="Play Karaoke" width="220"/>
</p>

<p align="center">
  <strong>Browser-based karaoke player for professional hosts.</strong><br/>
  CDG (MP3+G) and MP4 · real-time key change · second screen · singer rotation · YouTube search.<br/>
  No install, no server — runs 100% in the browser.
</p>

<p align="center">
  <a href="https://playkaraoke.github.io/PlayKaraokeWebPlayer/"><strong>▶ Open the player</strong></a> ·
  <a href="docs/USER_MANUAL.md">User manual</a> ·
  <a href="#license">License</a>
</p>

---

## Features

| | |
|---|---|
| **Formats** | `.zip` with `.cdg` + audio (MP3+G) and `.mp4` video |
| **Key change** | ±12 semitones in real time, without changing speed — works for CDG **and** MP4 |
| **Queue** | Drag & drop to reorder, per-song key preset, autoplay with countdown. The next song is always preloaded |
| **Show Mode** | Singer rotation (up to 5 songs each), "Manage Singers" panel, end-of-night report and CSV export |
| **Second screen** | Clean lyrics/video window for a TV or projector. While open, it becomes the main video player, halving the work on the operator's computer |
| **Library** | Index local folders or external drives and search instantly by song, artist or code (accent-insensitive) |
| **YouTube search** | Find karaoke videos on YouTube and queue them next to your files. YouTube songs have no key change and may show YouTube ads |
| **Atmosphere** | Automatic applause at the end of each song, ambient music between performances (included tracks or your own folder), custom idle image |
| **Older computers** | Light mode for CDG, library index saved between sessions (no rescanning on startup) |
| **Languages** | English and Portuguese (Brazil) |

## Quick start

1. Open **https://playkaraoke.github.io/PlayKaraokeWebPlayer/** in Chrome or Edge.
2. Enter your access password.
3. Click **Load Music** (or drag files onto the screen) and press **Play**.
4. Optional: click **Second Screen** and drag the new window to your TV or projector.
5. Hosting a night with several singers? Click **Start Show Mode**.

Full walkthrough: [User manual](docs/USER_MANUAL.md).

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Space` | Play / pause |
| `Ctrl` / `⌘` + `→` | Next song. In Show Mode, ends the current performance and moves to the next singer (after a confirmation) |

## Browser support

| Feature | Chrome / Edge / Opera | Safari | Firefox |
|---|:-:|:-:|:-:|
| Playback, queue, Show Mode, second screen | ✅ | ✅ | ✅ |
| Key change on MP4 | ✅ | ⚠️ | ⚠️ |
| Library (local folder search) | ✅ | ❌ | ❌ |
| YouTube search | ✅ | ✅ | ✅ |

⚠️ depends on the browser version. If it's unavailable, the video plays normally and the key buttons say so.
**Chrome or Edge is recommended.** The Library relies on the File System Access API, which only Chromium-based browsers support.

## File naming

Song info is read from the file name, using the format `Code - Artist - Title`:

```
EJBg-0020 - Kansas - Play the Game Tonight.zip   → code, artist, title
Queen - Bohemian Rhapsody.mp4                     → artist, title
```

## Good to know

- **Your files stay on your computer.** They are read locally and never uploaded. Only YouTube searches and videos go over the internet. Queue, singers and settings are saved in your browser only, so they don't sync between devices.
- **Surviving a page reload:** songs added from the **Library** are restored automatically. Files added by drag & drop or the file picker can't be reopened by the browser after a reload and have to be added again.
- **The access password is a casual filter, not security.** The site is fully static.

## License

© 2026 Play Karaoke. Licensed under [PolyForm Noncommercial 1.0.0](LICENSE): personal, noncommercial use only. Copying, redistributing or reusing this code in commercial products is not permitted without written authorization.
