# Play Karaoke — User Manual

> Applies to **v2.2**. For a short overview, see the [README](../README.md).

**Contents**
1. [Logging in](#1-logging-in)
2. [The screen at a glance](#2-the-screen-at-a-glance)
3. [Loading music](#3-loading-music)
4. [Playback controls](#4-playback-controls)
5. [The Library](#5-the-library)
6. [The second screen](#6-the-second-screen)
7. [Show Mode (singer rotation)](#7-show-mode-singer-rotation)
8. [Settings](#8-settings)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Logging in

Enter the password you were given. You stay logged in until you close the browser tab.

## 2. The screen at a glance

- **Left sidebar:** **Queue** and **Library** tabs. At the bottom: the settings gear, **Start Show Mode** / **End Show**, and the version number.
- **Stage (right):** lyrics or video while playing. When nothing is playing it shows the logo, or your custom image.
- **Bottom bar:** transport (Play/Pause, Stop, Next), quick toggles (Second Screen, Autoplay, Applause, Ambient), volume and key.

## 3. Loading music

| Way to add a song | How |
|---|---|
| Button | **Load Music**, then pick one or more files |
| Drag & drop | Onto the sidebar dropzone or the stage |
| Library | Search, then click a result ([section 5](#5-the-library)) |

**Supported:** `.zip` containing a `.cdg` + audio file (`.mp3`, `.wav`, `.ogg`, `.m4a`), and `.mp4`. Other files are skipped, with a warning.

**Song info** comes from the file name, in the format `Code - Artist - Title` (the code is optional).

**Clicking a song in the queue** opens a dialog with its details. From there you can:
- set its key in advance: **Apply pitch** saves it without interrupting what's playing;
- start it right away: **Play**.

**When a song ends** it leaves the queue, and the **next song is loaded and paused**, ready to go. It only starts by itself if **Autoplay** is on, after the countdown.

## 4. Playback controls

| Control | What it does |
|---|---|
| **Play/Pause** (`Space`) | Toggles playback |
| **Stop** | Fully stops and clears the stage. Use it if anything gets stuck; it's always safe |
| **Next** (`Ctrl/⌘ + →`) | Plays the next song in the queue. In Show Mode, ends the current performance ([section 7](#7-show-mode-singer-rotation)) |
| **Key − / + / RESET** | Changes the key by semitones (±12) without changing speed, for CDG and MP4 |
| **Volume** | Main volume (songs and videos). Ambient music has its own volume in Settings |

**Quick toggles**

| Toggle | When on |
|---|---|
| **Second Screen** | Opens or closes the second screen window |
| **Autoplay** | After a song ends, the next one starts on its own after a countdown (the wait time is set in Settings) |
| **Applause** | Applause plays automatically in the last seconds of each song, or earlier if the song goes silent near the end |
| **Ambient** | Background music plays only while no song is playing |

## 5. The Library

Search a large local collection, such as an external drive, without browsing folders every time. **Chrome, Edge or Opera only.**

1. Open the **Library** tab and click **+ Connect new folder**. Subfolders are included.
2. Wait for indexing. Only file names are read, so it's fast even with thousands of files.
3. Type in the search box. It matches title, artist or code, in any order, and ignores case and accents: `avioes` finds *Aviões*.
4. Click a result to add it to the queue. In Show Mode, you'll be asked which singer it's for.

Connected folders are remembered. If the browser asks for permission again, click **Reconnect**.

## 6. The second screen

A controls-free window for a TV, projector or singer-facing monitor.

1. Click the **Second Screen** toggle. If nothing opens, allow pop-ups for this site.
2. Drag the window to the other display and make it fullscreen (hover for the fullscreen button, or press `F11`).
3. It stays in sync: lyrics, video, countdown, upcoming singers, and the idle image.

Click the toggle again to close it.

## 7. Show Mode (singer rotation)

The queue becomes a rotation of **singers**, each with up to **5 songs**. When a song ends, the turn moves to the next singer, and after the last singer it goes back to the first.

**Starting:** click **Start Show Mode**. The show's duration is counted from this moment.

**Adding singers and songs:** load music as usual and you'll be asked who it's for. Pick an existing singer, or type a new name to create one. Singers join the rotation in the order they're added.

**During the show**
- The sidebar lists every singer, with their next song and a count (`2/5`). The one whose turn it is is highlighted.
- Reorder singers with the arrows or by dragging. Remove one with **×**; that also removes their queued songs. If you remove the singer whose turn it is, the turn goes to the **next** singer.
- **Double-click** a singer to open **Manage Singers**.
- When a performance ends, the next singer's song is **loaded and paused**. The waiting screen shows who's up next. Click **Start Now**, or turn on Autoplay to start after the countdown.
- A singer with no song in queue simply waits. Add a song and they're ready.
- **Ending a performance early:** press **Next** (or `Ctrl/⌘ + →`) and confirm. The song counts as sung, with the time actually sung, and the turn moves on. The button unlocks once the performance has started.

**Manage Singers** (sidebar button, or Settings → Show Mode)
- Add, rename, reorder or remove singers.
- **Waiting Queue:** reorder songs, set each song's key, remove songs, or **+ Add Song** from the Library or from your computer.
- **Songs Sung:** the singer's history for the night.

It's safe to edit the queue of the singer who's performing. The current song is tracked on its own, so nothing is skipped or counted twice.

**Ending the show:** click **End Show** and confirm. The report shows total duration, songs sung, unique singers, the highlight of the night, and a full timeline.
- **Export CSV:** the full history, opens correctly in Excel.
- **Start New Show / Exit:** clears everything and logs out.

## 8. Settings

Click the gear icon at the bottom of the sidebar.

| Card | Options |
|---|---|
| **Autoplay** | On/off, seconds to wait between songs |
| **Ambient Music** | On/off, background volume |
| **Screen Background Image** | Image shown when nothing is playing (ideal 1920×1080). Lasts for the current session |
| **Show Mode** | What the waiting screen shows (upcoming singers, song titles, countdown), plus **Manage Singers** |
| **Change CDG Colors** | Override background, text and highlight colors (CDG only, experimental) |
| **Language** | English or Português (Brasil). The second screen follows automatically |

## 9. Troubleshooting

| Problem | Solution |
|---|---|
| Stuck on "Loading" or not responding | Press **Stop**. It cancels any loading and resets the player |
| "The ZIP must contain a .cdg file and an audio file" | The zip doesn't have a valid `.cdg` + audio pair. Check the file |
| Library shows nothing | Check that the right folder is connected, and click **Reconnect** if asked |
| Second screen doesn't open | Allow pop-ups for this site |
| No key change on a video | Your browser doesn't support it for video. Use Chrome or Edge |
| Queue gone after reloading the page | Only Library songs are restored after a reload. Re-add songs that were loaded manually |

All data (queue, singers, settings, folders) is stored locally in your browser. Clearing the browser data resets the app.
