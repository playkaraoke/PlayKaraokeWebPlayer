<p align="center">
  <img src="assets/logo.svg" alt="PlayKaraoke" width="220"/>
</p>

<p align="center">
  <strong>PlayKaraoke Player: a browser-based karaoke player for hosts.</strong><br/>
  CDG (MP3+G) and MP4 · real-time key change · second screen · singer rotation · YouTube search · sound pads.<br/>
  No install, no server: it runs 100% in the browser.
</p>

<p align="center">
  <a href="https://playkaraoke.github.io/PlayKaraokeWebPlayer/"><strong>▶ Open the player</strong></a> ·
  <a href="https://playkaraoke.github.io/PlayKaraokeWebPlayer/help.html">Help &amp; manual</a> ·
  <a href="docs/USER_MANUAL.md">User manual (Markdown)</a> ·
  <a href="#license">License</a>
</p>

---

## Features

| | |
|---|---|
| **Formats** | `.zip` with `.cdg` + audio (MP3+G) and `.mp4` video |
| **Key change** | ±12 semitones in real time, without changing speed, for CDG **and** MP4 |
| **Queue** | Drop files anywhere, drag to reorder, per-song key preset, autoplay with countdown, restart button. The next song is always preloaded |
| **Show Mode** | Singer rotation (up to 5 songs each) with a searchable singer picker, "Change song" for the singer up next, "Manage singers" panel, end-of-night report and CSV export |
| **Second screen** | Clean lyrics/video window for a TV or projector. While open, it becomes the main video player, halving the work on the operator's computer |
| **Search** | One search box for your **devices** (index local folders or external drives, accent-insensitive, instant) and **YouTube** |
| **Pads** | Six sound-effect buttons (applause, laughter, drum roll, horn…), with your own sounds and names |
| **Atmosphere** | Automatic applause at the end of each song, ambient music between performances (included tracks or your own folder), custom idle image |
| **Comfort** | Dark and light themes, optional keyboard shortcuts, performance mode for older computers |
| **Languages** | English and Portuguese (Brazil) |

## Quick start

1. Open **https://playkaraoke.github.io/PlayKaraokeWebPlayer/** in Chrome or Edge.
2. Drop karaoke files anywhere on the screen (or click the drop area) and press **Play**.
3. Optional: click **Second Screen** and drag the new window to your TV or projector.
4. Hosting a night with several singers? Click **Start Show Mode**.
5. To search your karaoke drive, connect it once in **Settings › Library**.

Full walkthrough: **Settings › Help & manual** in the app, or the [user manual](docs/USER_MANUAL.md).

## Keyboard shortcuts

Off by default; turn them on in **Settings › Shortcuts**. They never fire while typing or with a window open.

| Action | Mac | Windows |
|---|---|---|
| Play / pause | `Space` | `Space` |
| Restart song | `⌘ ←` | `Ctrl ←` |
| Next song / end performance | `⌘ →` | `Ctrl →` |
| Stop | `⌘ .` | `Ctrl .` |
| Pitch up / down / reset | `⌘ ↑` `⌘ ↓` `⌘ 0` | `Ctrl ↑` `Ctrl ↓` `Ctrl 0` |
| Volume up / down | `⌘ ⇧ ↑` `⌘ ⇧ ↓` | `Ctrl ⇧ ↑` `Ctrl ⇧ ↓` |
| Pads 1–6 | `1`…`6` | `1`…`6` |
| Search | `/` | `/` |

## Browser support

| Feature | Chrome / Edge / Opera | Safari | Firefox |
|---|:-:|:-:|:-:|
| Playback, queue, Show Mode, second screen, pads | ✅ | ✅ | ✅ |
| Key change on MP4 | ✅ | ⚠️ | ⚠️ |
| Device search (local folders) | ✅ | ❌ | ❌ |
| YouTube search | ✅ | ✅ | ✅ |

⚠️ depends on the browser version. If it's unavailable, the video plays normally and the pitch buttons say so.
**Chrome or Edge is recommended.** Device search relies on the File System Access API, which only Chromium-based browsers support.

## File naming

Song info is read from the file name, using the format `Code - Artist - Title`:

```
EJBg-0020 - Kansas - Play the Game Tonight.zip   → code, artist, title
Queen - Bohemian Rhapsody.mp4                     → artist, title
```

## Good to know

- **Your files stay on your computer.** They are read locally and never uploaded. Only YouTube searches and videos go over the internet. Queue, singers, pads and settings are saved in your browser only, so they don't sync between devices.
- **Surviving a page reload:** songs from connected folders and YouTube are restored automatically. Files added by drag & drop or the file picker can't be reopened by the browser after a reload and have to be added again.

## Support

PlayKaraoke Player is free. If it makes your nights better, you can [buy me a coffee](https://www.paypal.com/donate/?business=jorge.domecildes%40gmail.com&no_recurring=0&item_name=Support+PlayKaraoke). More from PlayKaraoke on [YouTube](https://www.youtube.com/@playkaraoke).

## License

© 2015–2026 Jorge Domecildes · PlayKaraoke. Licensed under [PolyForm Noncommercial 1.0.0](LICENSE): personal, noncommercial use only. Copying, redistributing or reusing this code in commercial products is not permitted without written authorization.
