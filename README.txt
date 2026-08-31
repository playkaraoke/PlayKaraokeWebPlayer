========================================================================
 PLAY KARAOKE - USER MANUAL
========================================================================

Play Karaoke is a web-based karaoke player that runs entirely in your
browser. It plays CDG (MP3+G) and MP4 karaoke files, supports a second
screen for performers, and includes an optional "Show Mode" for
managing a rotation of singers at a live event.

This manual explains every feature in detail. For a quick start, read
sections 1-4. For running a full show with multiple singers, read
section 7.

Table of contents:
  1. Logging in
  2. The main screen at a glance
  3. Loading and playing music
  4. Playback controls
  5. The Library (searching a local folder)
  6. The Second Screen
  7. Show Mode (singer rotation)
  8. Settings
  9. Language
  10. Troubleshooting
  11. Technical notes


------------------------------------------------------------------------
1. LOGGING IN
------------------------------------------------------------------------

When you open the app, you'll see a password screen. Enter the
password you were given and click "Enter". Your session stays logged
in until you close the browser tab (it does not persist across browser
restarts).

If you don't have a password, ask whoever is running the show.


------------------------------------------------------------------------
2. THE MAIN SCREEN AT A GLANCE
------------------------------------------------------------------------

The screen is split into two areas:

  - LEFT SIDEBAR: has two tabs, "Queue" and "Library". This is where
    you manage what's queued up to play. At the bottom of the sidebar
    you'll find the settings gear icon, the "Start Show Mode" button,
    and the current version number.

  - MAIN STAGE (right side): shows the karaoke lyrics/video while
    something is playing, or a "drop a file here" prompt when idle.
    Below the stage is the transport bar (play/pause, stop, next,
    pitch, volume) and a row of quick-toggle pills (Second Screen,
    Autoplay, Applause, Ambient).


------------------------------------------------------------------------
3. LOADING AND PLAYING MUSIC
------------------------------------------------------------------------

There are three ways to add a song to the queue:

  a) Click "Load Music" in the sidebar and choose one or more files.
  b) Drag and drop files onto the small dropzone under "Load Music",
     or directly onto the main stage.
  c) Search the Library tab (see section 5) and click a result.

SUPPORTED FORMATS:
  - .ZIP files containing a .cdg file and an audio file (.mp3 or .wav)
    inside — this is the classic "MP3+G" karaoke format.
  - .MP4 video files.

Any other file type will be skipped, with a message telling you which
ones were ignored.

Once a file is loaded, it appears in the Queue list. Click any song in
the queue to open a small dialog where you can:
  - See its code, artist, and format.
  - Set an initial pitch before playing it (optional).
  - Apply the pitch without playing yet ("Apply pitch").
  - Start playing it right away ("Play").

WHEN A SONG FINISHES: in the normal queue (not Show Mode), the song
that just finished is automatically removed from the queue. This keeps
your list showing only what's left to sing. If Autoplay is on, the
next song starts automatically after a short countdown; if it's off,
playback simply stops and waits for you.


------------------------------------------------------------------------
4. PLAYBACK CONTROLS
------------------------------------------------------------------------

TRANSPORT BAR (below the stage):
  - Play/Pause button: toggles playback of the current song.
  - Stop button (square icon): fully stops and resets the player. Use
    this if something freezes or gets stuck — it cancels whatever is
    loading and clears the stage. Safe to use any time.
  - Next button: skips to the next song in the queue.

PITCH:
  Use the +/- buttons to shift the key up or down in semitones, or
  click "RESET" to go back to the original key. Pitch changes apply
  live, without changing the speed of the song. This works for both
  CDG and MP4 (video pitch shifting depends on your browser — Chrome,
  Edge, and Opera support it; if your browser doesn't, the pitch
  buttons will say so).

VOLUME:
  The slider on the left of the pitch controls sets the main playback
  volume (song + video audio). This is separate from ambient music
  volume, which has its own control in Settings.

QUICK-TOGGLE PILLS (row above the transport bar):

  - SECOND SCREEN: opens or closes a separate window meant for a
    projector or a performer-facing monitor. See section 6.

  - AUTOPLAY: when on, the next song in the queue starts automatically
    after a short countdown once the current one ends. You can set how
    many seconds to wait in Settings.

  - APPLAUSE: when on, an applause sound effect plays automatically in
    the last few seconds of every song. It does NOT play immediately
    when you turn the toggle on — it only plays near the end of a song
    that's already in progress.

  - AMBIENT: when on, soft background music plays automatically
    whenever nothing else is playing (silence between performances).
    It does not play over an active song — only during the gaps.

Hover over any pill to see a tooltip explaining exactly what it does
and when.


------------------------------------------------------------------------
5. THE LIBRARY (SEARCHING A LOCAL FOLDER)
------------------------------------------------------------------------

If you have a large local collection of karaoke files (for example, on
an external hard drive), the Library tab lets you search across all of
them instantly, without uploading anything or waiting for a manual
file browser each time.

BROWSER REQUIREMENT: this feature uses the File System Access API,
which currently only works in Chrome, Edge, and Opera. It does not
work in Safari or Firefox — you'll see a message explaining this if
your browser isn't supported.

HOW TO USE IT:
  1. Go to the Library tab.
  2. Click "+ Connect new folder" and choose the folder containing your
     karaoke files (it scans subfolders too).
  3. Wait for it to finish indexing (only filenames are scanned, so
     even folders with thousands of files are indexed quickly).
  4. Type in the search box — search matches song title, artist, or
     code, is not case-sensitive, ignores accents, and matches
     multiple words in any order.
  5. Click a result to add it to the queue (or, in Show Mode, you'll
     be asked which singer it's for).

Connected folders are remembered between sessions. If your browser
asks for permission again next time you open the app (this can happen
for security reasons), just click to reconnect — nothing is lost.


------------------------------------------------------------------------
6. THE SECOND SCREEN
------------------------------------------------------------------------

The Second Screen is a separate browser window meant to be dragged to
a second monitor, TV, or projector — it shows the lyrics/video without
any of the operator's controls, so it's safe to show to an audience or
performer.

Click the "Second Screen" pill to open it. Drag the window to your
second display and put it in fullscreen (most browsers support F11 for
this). It stays in sync with the main screen automatically — song
changes, countdowns, and (in Show Mode) singer information all update
in real time.

Click the pill again to close it.


------------------------------------------------------------------------
7. SHOW MODE (SINGER ROTATION)
------------------------------------------------------------------------

Show Mode replaces the regular flat queue with a rotation organized by
SINGER. Each singer has their own queue of up to 5 songs, and the app
automatically moves to the next singer once a song ends — ideal for
running a full karaoke night with multiple people taking turns.

STARTING SHOW MODE:
  Click "Start Show Mode" in the sidebar footer. The first time you do
  this, a welcome screen explains the basics — you can check "Don't
  show this again" if you don't need to see it every time.

ADDING SINGERS AND SONGS:
  There is no separate "add singer" button — singers are created as
  you add music. Click "Load Music" (or drag a file, or pick one from
  the Library) and you'll be asked which singer this song is for:
    - Pick an existing singer from the dropdown, or
    - Type a new name and click "Add" to create that singer on the
      spot, with this song as their first one.
  Repeat this for every song of the night. The order singers get added
  in becomes their order in the rotation.

HOW THE ROTATION WORKS:
  The sidebar shows every singer as a row, in rotation order, each
  showing their current song (or "no song in queue" if empty). The
  active singer is highlighted, with a "PLAYING" badge once playback
  starts. When a song ends, the app automatically advances to the next
  singer's turn. If a singer has no song queued when it's their turn,
  the app simply waits — add a song for them and it will pick up
  automatically.

REORDERING AND REMOVING SINGERS:
  Each row (except the currently active one) has up/down arrows to
  move it in the rotation, and an X button to remove that singer
  entirely (this also deletes their queued songs — you'll be asked to
  confirm). You can also drag and drop rows to reorder them.
  Double-click any row to jump straight to that singer's detail view
  in "Manage Singers" (see below).

MANAGE SINGERS (detailed panel):
  Open it from Settings > Show Mode > "Manage Singers", or by
  double-clicking a singer in the sidebar. This gives you:
    - A full list of every singer, with reorder arrows and a delete
      button for each.
    - "+ Add New Singer" to create one without adding a song yet.
    - Click a singer to see two tabs:
        WAITING QUEUE: their upcoming songs, with pitch adjustment,
        reorder arrows, and a remove button per song. Use "+ Add Song"
        to add more — you can either search the connected Library or
        upload a file directly from your computer, right there.
        SONGS SUNG: a read-only history of what they've already
        performed this session (title, artist, code, pitch used).
    - An edit-name button (pencil icon) next to the singer's name to
      rename them at any time.

ENDING THE SHOW:
  Once Show Mode is on, the sidebar button changes to "End Show" —
  this is the only way to turn Show Mode off; there's no way to pause
  it without going through this flow. Clicking it asks for
  confirmation, then shows a full report: total duration, number of
  songs sung, number of unique singers, and a "highlight of the night"
  (whoever sang the most). Below that is a full chronological table of
  every performance. You can:
    - Export everything as a CSV file.
    - Click "Start New Show / Exit" to clear everything and go back to
      an empty state, ready for the next event.


------------------------------------------------------------------------
8. SETTINGS
------------------------------------------------------------------------

Click the gear icon in the sidebar footer to open Settings. Each card
covers one feature:

  AUTOPLAY: turn on/off, and set how many seconds to wait between
  songs before the next one starts automatically.

  AMBIENT MUSIC: turn on/off, and set its background volume
  (independent from the main playback volume).

  SCREEN BACKGROUND IMAGE: upload a custom image to show instead of
  the logo whenever nothing is playing (both on the main screen and
  the second screen). Ideal size is 1920x1080px. Remove it to go back
  to the default logo.

  SHOW MODE: three sub-toggles control what appears on the countdown/
  waiting screen — the list of upcoming singers, song titles, and the
  autoplay countdown number. This card also has the "Manage Singers"
  button (see section 7).

  CHANGE CDG COLORS (experimental): lets you override the background,
  text, and sync-highlight colors used when rendering CDG lyrics. This
  only affects CDG (MP3+G) songs — it has no effect on MP4 videos.

  LANGUAGE: choose the app's display language. See section 9.


------------------------------------------------------------------------
9. LANGUAGE
------------------------------------------------------------------------

Play Karaoke currently supports English and Portuguese (Brazil).
English is the default for every new session — the app does not try to
detect your browser's language automatically.

To change it, open Settings and use the Language dropdown. Your choice
is remembered on that device/browser for next time. The second screen
automatically follows the same language as the main screen — you don't
need to set it separately.


------------------------------------------------------------------------
10. TROUBLESHOOTING
------------------------------------------------------------------------

SOMETHING FROZE / STUCK ON "LOADING":
  Click the Stop button (square icon) in the transport bar. This
  cancels whatever was loading and resets the player to an empty
  state. It's always safe to use.

"THE ZIP MUST CONTAIN A .CDG FILE AND AN AUDIO FILE" ERROR:
  This means the .zip you loaded doesn't have a valid .cdg + audio
  pair inside it. Double-check the file — some karaoke packs are
  structured differently than expected, or the file may be corrupted.

LIBRARY SEARCH SHOWS NOTHING:
  Make sure the right folder is still connected (check the "Connected
  folders" list in the Library tab). If your browser asked for folder
  permission again, click to reconnect it.

EVERYTHING FEELS SLOW ON AN OLDER COMPUTER:
  Play Karaoke is optimized to run on modest hardware, but very old
  machines (very little RAM, old CPU) will still feel it, especially
  right when connecting a Library folder with a huge number of files —
  that's a heavier one-time operation. Once a folder finishes indexing,
  things should feel normal again. If lyrics stutter specifically while
  a large folder is being scanned, that's expected and temporary.

SECOND SCREEN WON'T STAY IN SYNC:
  Make sure you haven't blocked pop-ups for this site — the second
  screen is opened as a new browser window, and pop-up blockers can
  prevent that. Try clicking the "Second Screen" pill again.


------------------------------------------------------------------------
11. TECHNICAL NOTES
------------------------------------------------------------------------

Play Karaoke runs entirely in your browser — there is no server
storing your data. Everything (queue, singers, settings, connected
Library folders) is saved locally in your browser (localStorage/
IndexedDB) and does not sync between different devices or browsers.
Clearing your browser data will reset the app to a fresh state.

For a full technical/architecture breakdown (useful for developers),
see ARQUITETURA.md and DOCUMENTACAO.md in the project repository.
