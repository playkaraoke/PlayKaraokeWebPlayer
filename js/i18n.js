/**
 * i18n — sistema de tradução do Play Karaoke.
 *
 * Como funciona:
 *  - Textos ESTÁTICOS do HTML usam o atributo data-i18n="chave" (texto),
 *    data-i18n-title="chave" (tooltip) ou data-i18n-placeholder="chave".
 *    Ao trocar de idioma, applyTranslations() varre o DOM e substitui.
 *  - Textos DINÂMICOS gerados no JS usam window.i18n.t('chave', {vars}).
 *  - Inglês é o idioma padrão (sem detecção de navegador — decisão
 *    deliberada). A escolha da pessoa fica salva em localStorage.
 *  - Se uma chave não existir no idioma atual, cai pro inglês
 *    automaticamente — nunca quebra, nunca mostra a chave crua.
 */

const TRANSLATIONS = {
  en: {
    // Login
    auth_title: 'Restricted Access',
    auth_subtitle: 'Enter the password to continue',
    auth_placeholder: 'Password',
    auth_button: 'Enter',
    auth_error: 'Incorrect password.',

    // Sidebar / tabs
    brand_sub: 'CDG & MP4 PLAYER',
    tab_queue: 'Queue',
    tab_library: 'Library',
    queue_label: 'Queue',
    load_music_btn: 'Load Music',
    dropzone_text: 'Drag files here',
    queue_empty_hint: 'Your queue appears here. Load one or more files to start.',

    // Library
    library_search_placeholder: 'Search by song, artist or code...',
    library_clear_btn: 'CLEAR',
    library_unsupported: "Your browser doesn't support this feature — works on Chrome, Edge and Opera (not on Safari or Firefox yet).",
    library_folders_label: 'Connected folders',
    library_connect_folder_btn: '+ Connect new folder',
    library_no_results: 'Nothing found. Check if the right folder is connected.',

    // Stage / player
    stage_drop_title: 'Drop a karaoke file here',
    stage_drop_desc: 'Drag one or more .ZIP (MP3+G) or .MP4 files — or click to choose files from your computer.',
    no_music_loaded: 'No music loaded',
    meta_song_label: 'SONG',
    loading_file: 'Loading file…',
    fullscreen_btn: 'Fullscreen',

    // Transport / footer
    stop_btn_title: 'Stop (if it freezes, use this button to reset)',
    next_btn_title: 'Next song',
    tom_label: 'PITCH',
    pitch_down_title: 'Decrease one semitone',
    pitch_up_title: 'Increase one semitone',
    pitch_reset_title: 'Reset pitch',
    pill_second_screen: 'Second Screen',
    pill_second_screen_title: 'Open/close the second screen',
    pill_autoplay: 'Autoplay',
    pill_autoplay_title: 'When on, the next song in the queue starts automatically after a wait',
    pill_applause: 'Applause',
    pill_applause_title: "Plays an applause sound automatically in the last seconds of each song — doesn't play right when you turn it on",
    pill_ambient: 'Ambient',
    pill_ambient_title: 'Plays soft background music only when NO song is currently playing (silence between performances)',

    // Settings
    settings_title: 'Settings',
    settings_autoplay_title: 'Autoplay',
    settings_wait: 'Wait',
    settings_seconds_between: 'seconds between songs',
    settings_ambient_title: 'Ambient Music',
    settings_ambient_volume: 'Set background volume',
    settings_idle_image_title: 'Screen Background Image',
    settings_idle_image_desc: 'Shows a background image when no music is playing. <em>Ideal size 1920×1080 px.</em>',
    settings_idle_image_upload: 'Upload Image',
    settings_idle_image_remove: 'Remove image',
    settings_show_mode_title: 'Show Mode',
    settings_show_upcoming: 'Show list of upcoming singers',
    settings_show_titles: 'Show song titles',
    settings_show_counter: 'Show autoplay countdown',
    settings_manage_singers_btn: 'Manage Singers',
    settings_colors_title: 'Change CDG Colors <em>(experimental)</em>',
    settings_colors_desc: 'Change the CDG palette colors for background, lyrics and sync highlight. <em>Only works for CDG (MP3+G) songs — does not affect MP4 videos.</em>',
    color_background: 'BACKGROUND',
    color_text: 'TEXT',
    color_highlight: 'HIGHLIGHT',
    settings_language_title: 'Language',
    settings_language_desc: 'Choose the app language.',
    enabled: 'On',
    disabled: 'Off',

    // Show mode button
    start_show_mode: 'Start Show Mode',
    end_show: 'End Show',

    // Singer picker modal
    singer_picker_title: 'Who is this song for?',
    singer_picker_dropdown_default: 'Select an existing singer...',
    singer_picker_new_placeholder: 'Or type a new singer name...',
    singer_picker_add_btn: 'Add',
    singer_picker_cancel_btn: 'Cancel',

    // Welcome modal
    welcome_title: 'Welcome to Show Mode',
    welcome_intro: 'Instead of a regular song queue, the queue is now organized by <strong>singer</strong> — each with their own queue of up to 5 songs, in automatic rotation.',
    welcome_step1: 'Click <strong>"Load Music"</strong> (or drag a file) — you\'ll be asked which singer this song is for. Type a new name to create the singer on the spot.',
    welcome_step2: "Repeat for each song/singer of the night. The rotation order follows the order you added them.",
    welcome_step3: 'Hit play — the system takes care of moving to the next singer on its own. To edit names, reorder, or add more songs later, use <strong>"Manage Singers"</strong> in Settings.',
    welcome_dont_show_again: "Don't show this explanation again",
    welcome_start_btn: 'Got it, start Show Mode',

    // Singer round view
    no_singers_yet: 'No singers in the rotation yet.',
    no_singers_hint: 'Click "Load Music" above — it will ask which singer it\'s for, and create them on the spot.',
    now_playing_badge: 'PLAYING',
    waiting_for_song: 'Waiting for song selection',
    no_song_in_queue: 'no song in queue',

    // Track modal
    track_modal_code: 'CODE',
    track_modal_artist: 'ARTIST',
    track_modal_format: 'FORMAT',
    tm_pitch_label: 'INITIAL PITCH',
    tm_cancel_btn: 'Cancel',
    tm_apply_btn: 'Apply pitch',
    tm_play_btn: 'Play',

    // Manage singers modal
    manage_singers_title: 'Manage Singers',
    manage_singers_night_list: 'Night list',
    manage_singers_add_new: '+ Add New Singer',
    manage_singers_select_hint: 'Select a singer from the list on the left.',
    manage_singers_tab_queue: 'Waiting Queue',
    manage_singers_tab_history: 'Songs Sung',
    manage_singers_add_song_btn: '+ Add Song',
    manage_singers_search_placeholder: 'Search the Library...',
    detail_upload_btn: '⬆ Upload file(s)',
    manage_singers_queue_empty: "This singer doesn't have any songs in the queue yet.",
    manage_singers_history_empty: "This singer hasn't sung any songs in this session yet.",
    manage_singers_songs_count: 'songs',
    edit_name_title: 'Edit name',

    // End show
    end_show_confirm_title: 'End the show?',
    end_show_confirm_desc: "This will generate the night's report. You'll still be able to view and export the data before clearing everything.",
    end_show_confirm_cancel: 'Cancel',
    end_show_confirm_ok: 'End Show',
    show_report_title: 'Show Report',
    report_duration: 'Duration',
    report_total_songs: 'Songs Sung',
    report_unique_singers: 'Unique Singers',
    report_highlight: 'Highlight of the Night',
    report_col_time: 'Time',
    report_col_singer: 'Singer',
    report_col_song: 'Song',
    report_col_artist: 'Artist',
    report_col_pitch: 'Pitch',
    export_csv_btn: 'Export CSV',
    new_show_btn: 'Start New Show / Exit',

    // Errors / messages
    err_zip_invalid: 'The ZIP must contain a .cdg file and an audio file (.mp3/.wav).',
    err_load_generic: 'Could not load this song.',
    err_singer_name_empty: "Singer name can't be empty.",
    err_singer_name_duplicate: 'A singer with that name already exists.',
    err_singer_not_found: 'Singer not found.',
    err_singer_max_songs: '{name} already has the maximum of {max} songs in queue.',
    err_library_read_fail: "Couldn't read this file — check if the folder/drive is still connected.",
    err_library_scan_fail: 'Could not scan the folder "{name}".',
    err_library_unsupported: "Your browser doesn't support this feature (works on Chrome, Edge and Opera).",
    err_library_picker_fail: 'Could not open the folder picker.',
    err_library_permission_denied: 'Permission not granted — the folder remains disconnected.',
    err_library_reconnect_fail: 'Could not reconnect this folder.',
    cd_label_starts_in: 'The song starts in:',
    cd_label_up_next: 'Up next:',
    cd_label_upcoming: 'Upcoming songs:',
    cd_start_now_btn: 'Start Now',
    second_screen_focus: 'Focus window ↗',
    second_screen_open: 'Open window ↗',
    library_reconnect_needed: 'Reconnection needed',
    pill_autoplay_on_title: 'Autoplay on — waits {delay}s between songs',
    move_up_title: 'Move up',
    move_down_title: 'Move down',
    remove_singer_title: 'Remove singer',
    remove_from_queue_title: 'Remove from queue',
    remove_folder_title: 'Remove folder',
    err_unsupported_files: 'Some files were skipped: only .zip (MP3+G) and .mp4 are supported.',
    err_playback_start_fail: 'Could not start playback: {msg}',
    err_image_read_fail: 'Could not read this image.',
    err_audio_generic: 'Audio error: {msg}',
    err_singer_songs_dropped: '{count} song(s) from singers could not be restored automatically (they were standalone files).',
    err_playlist_songs_dropped: '{count} song(s) from the previous queue could not be restored automatically (they were standalone files, or the Library folder hasn\'t been reconnected yet). Add them again if needed.',
  },

  pt: {
    auth_title: 'Acesso Restrito',
    auth_subtitle: 'Digite a senha pra continuar',
    auth_placeholder: 'Senha',
    auth_button: 'Entrar',
    auth_error: 'Senha incorreta.',

    brand_sub: 'PLAYER CDG & MP4',
    tab_queue: 'Fila',
    tab_library: 'Biblioteca',
    queue_label: 'Fila',
    load_music_btn: 'Carregar Música',
    dropzone_text: 'Arraste arquivos aqui',
    queue_empty_hint: 'Sua fila aparece aqui. Carregue um ou mais arquivos pra começar.',

    library_search_placeholder: 'Buscar por música, artista ou código...',
    library_clear_btn: 'LIMPAR',
    library_unsupported: 'Seu navegador não suporta essa funcionalidade — funciona no Chrome, Edge e Opera (não funciona no Safari ou Firefox por enquanto).',
    library_folders_label: 'Pastas conectadas',
    library_connect_folder_btn: '+ Conectar nova pasta',
    library_no_results: 'Nada encontrado. Confira se a pasta certa está conectada.',

    stage_drop_title: 'Solte um arquivo de karaokê aqui',
    stage_drop_desc: 'Arraste um ou mais .ZIP (MP3+G) ou .MP4 — ou clique pra escolher arquivos do seu computador.',
    no_music_loaded: 'Nenhuma música carregada',
    meta_song_label: 'MÚSICA',
    loading_file: 'Carregando arquivo…',
    fullscreen_btn: 'Tela cheia',

    stop_btn_title: 'Parar (se travar, use esse botão pra resetar)',
    next_btn_title: 'Próxima música',
    tom_label: 'TOM',
    pitch_down_title: 'Diminuir um semitom',
    pitch_up_title: 'Aumentar um semitom',
    pitch_reset_title: 'Resetar tom',
    pill_second_screen: 'Segunda Tela',
    pill_second_screen_title: 'Abrir/fechar a segunda tela',
    pill_autoplay: 'Autoplay',
    pill_autoplay_title: 'Quando ligado, a próxima música da fila começa sozinha depois de um tempo de espera',
    pill_applause: 'Aplausos',
    pill_applause_title: 'Toca um som de aplausos automaticamente nos últimos segundos de cada música — não toca na hora que você liga',
    pill_ambient: 'Ambiente',
    pill_ambient_title: 'Toca uma música de fundo suave só quando NÃO há nenhuma música em reprodução (silêncio entre uma apresentação e outra)',

    settings_title: 'Configurações',
    settings_autoplay_title: 'Autoplay',
    settings_wait: 'Esperar',
    settings_seconds_between: 'segundos nos intervalos entre as músicas',
    settings_ambient_title: 'Música Ambiente',
    settings_ambient_volume: 'Definir volume do fundo musical',
    settings_idle_image_title: 'Imagem de Fundo de Tela',
    settings_idle_image_desc: 'Exibe uma imagem de fundo quando não estiver tocando nenhuma música. <em>Tamanho ideal 1920×1080 px.</em>',
    settings_idle_image_upload: 'Fazer Upload de Imagem',
    settings_idle_image_remove: 'Remover imagem',
    settings_show_mode_title: 'Modo Show',
    settings_show_upcoming: 'Exibir lista dos próximos cantores',
    settings_show_titles: 'Exibir títulos das músicas',
    settings_show_counter: 'Exibir contador regressivo de Autoplay',
    settings_manage_singers_btn: 'Gerenciar Cantores',
    settings_colors_title: 'Alterar Cores de CDG <em>(experimental)</em>',
    settings_colors_desc: 'Alterar cores da paleta do CDG de fundo, letras e sincronização. <em>Só funciona pra músicas em formato CDG (MP3+G) — não afeta vídeos MP4.</em>',
    color_background: 'FUNDO',
    color_text: 'TEXTO',
    color_highlight: 'DESTAQUE',
    settings_language_title: 'Idioma',
    settings_language_desc: 'Escolha o idioma do aplicativo.',
    enabled: 'Ativado',
    disabled: 'Desativado',

    start_show_mode: 'Iniciar Modo Show',
    end_show: 'Encerrar Show',

    singer_picker_title: 'Essa música é de qual cantor?',
    singer_picker_dropdown_default: 'Selecionar cantor existente...',
    singer_picker_new_placeholder: 'Ou digite o nome de um cantor novo...',
    singer_picker_add_btn: 'Adicionar',
    singer_picker_cancel_btn: 'Cancelar',

    welcome_title: 'Bem-vindo ao Modo Show',
    welcome_intro: 'Em vez de uma fila comum de músicas, a fila passa a ser organizada por <strong>cantor</strong> — cada um com sua própria fila de até 5 músicas, em rodízio automático.',
    welcome_step1: 'Clique em <strong>"Carregar Música"</strong> (ou arraste um arquivo) — vai aparecer perguntando de qual cantor é essa música. Digite um nome novo pra criar o cantor na hora.',
    welcome_step2: 'Repita pra cada música/cantor da noite. A ordem de rodízio segue a ordem que você foi adicionando.',
    welcome_step3: 'Dê play — o sistema cuida de avançar pro próximo cantor sozinho. Pra editar nomes, reordenar ou adicionar mais músicas depois, use <strong>"Gerenciar Cantores"</strong> nas Configurações.',
    welcome_dont_show_again: 'Não mostrar essa explicação de novo',
    welcome_start_btn: 'Entendi, iniciar Modo Show',

    no_singers_yet: 'Nenhum cantor na rodada ainda.',
    no_singers_hint: 'Clique em "Carregar Música" acima — vai te perguntar de qual cantor é, e já cria ele na hora.',
    now_playing_badge: 'TOCANDO',
    waiting_for_song: 'Aguardando seleção de música',
    no_song_in_queue: 'sem música na fila',

    track_modal_code: 'CÓDIGO',
    track_modal_artist: 'ARTISTA',
    track_modal_format: 'FORMATO',
    tm_pitch_label: 'TOM INICIAL',
    tm_cancel_btn: 'Cancelar',
    tm_apply_btn: 'Aplicar tom',
    tm_play_btn: 'Tocar',

    manage_singers_title: 'Gerenciar Cantores',
    manage_singers_night_list: 'Lista da noite',
    manage_singers_add_new: '+ Adicionar Novo Cantor',
    manage_singers_select_hint: 'Selecione um cantor na lista à esquerda.',
    manage_singers_tab_queue: 'Fila de Espera',
    manage_singers_tab_history: 'Músicas Cantadas',
    manage_singers_add_song_btn: '+ Adicionar Música',
    manage_singers_search_placeholder: 'Buscar na Biblioteca...',
    detail_upload_btn: '⬆ Enviar arquivo(s)',
    manage_singers_queue_empty: 'Nenhuma música na fila desse cantor ainda.',
    manage_singers_history_empty: 'Esse cantor ainda não cantou nenhuma música nessa sessão.',
    manage_singers_songs_count: 'músicas',
    edit_name_title: 'Editar nome',

    end_show_confirm_title: 'Encerrar o show?',
    end_show_confirm_desc: 'Isso vai gerar o relatório da noite. Você ainda poderá ver e exportar os dados antes de limpar tudo.',
    end_show_confirm_cancel: 'Cancelar',
    end_show_confirm_ok: 'Encerrar Show',
    show_report_title: 'Relatório do Show',
    report_duration: 'Duração',
    report_total_songs: 'Músicas Cantadas',
    report_unique_singers: 'Cantores Únicos',
    report_highlight: 'Destaque da Noite',
    report_col_time: 'Horário',
    report_col_singer: 'Cantor',
    report_col_song: 'Música',
    report_col_artist: 'Artista',
    report_col_pitch: 'Tom',
    export_csv_btn: 'Exportar CSV',
    new_show_btn: 'Iniciar Novo Show / Sair',

    err_zip_invalid: 'O ZIP precisa conter um arquivo .cdg e um arquivo de áudio (.mp3/.wav).',
    err_load_generic: 'Não foi possível carregar essa música.',
    err_singer_name_empty: 'Nome do cantor não pode ser vazio.',
    err_singer_name_duplicate: 'Já existe um cantor com esse nome.',
    err_singer_not_found: 'Cantor não encontrado.',
    err_singer_max_songs: '{name} já tem o máximo de {max} músicas na fila.',
    err_library_read_fail: 'Não foi possível ler esse arquivo — confira se a pasta/HD ainda está conectado.',
    err_library_scan_fail: 'Não foi possível escanear a pasta "{name}".',
    err_library_unsupported: 'Seu navegador não suporta essa funcionalidade (funciona no Chrome, Edge e Opera).',
    err_library_picker_fail: 'Não foi possível abrir o seletor de pasta.',
    err_library_permission_denied: 'Permissão não concedida — a pasta continua desconectada.',
    err_library_reconnect_fail: 'Não foi possível reconectar essa pasta.',
    cd_label_starts_in: 'A música inicia em:',
    cd_label_up_next: 'A seguir:',
    cd_label_upcoming: 'Próximas músicas:',
    cd_start_now_btn: 'Iniciar Agora',
    second_screen_focus: 'Focar janela ↗',
    second_screen_open: 'Abrir janela ↗',
    library_reconnect_needed: 'Reconexão necessária',
    pill_autoplay_on_title: 'Autoplay ligado — aguarda {delay}s entre músicas',
    move_up_title: 'Mover pra cima',
    move_down_title: 'Mover pra baixo',
    remove_singer_title: 'Remover cantor',
    remove_from_queue_title: 'Remover da fila',
    remove_folder_title: 'Remover pasta',
    err_unsupported_files: 'Alguns arquivos foram ignorados: só .zip (MP3+G) e .mp4 são suportados.',
    err_playback_start_fail: 'Não foi possível iniciar a reprodução: {msg}',
    err_image_read_fail: 'Não foi possível ler essa imagem.',
    err_audio_generic: 'Erro de áudio: {msg}',
    err_singer_songs_dropped: '{count} música(s) de cantores não foram restauradas automaticamente (eram arquivos avulsos).',
    err_playlist_songs_dropped: '{count} música(s) da fila anterior não foram restauradas automaticamente (eram arquivos avulsos, ou a pasta da Biblioteca ainda não foi reconectada). Adicione-as de novo se precisar.',
  },
};

const LANG_STORAGE_KEY = 'playkaraoke-language';
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
if (!TRANSLATIONS[currentLang]) currentLang = 'en';

function t(key, vars) {
  let str = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS.en[key] || key;
  if (vars) {
    Object.keys(vars).forEach(k => { str = str.split(`{${k}}`).join(vars[k]); });
  }
  return str;
}

function applyTranslations(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n'));
  });
  scope.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
  scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
}

const languageChangeListeners = [];

/** Registra uma função pra ser chamada toda vez que o idioma mudar.
 * Usado em vez de um evento de DOM (CustomEvent) de propósito — é uma
 * comunicação interna do app, não precisa do mecanismo de eventos do
 * navegador, e assim fica mais simples de testar/reutilizar em
 * qualquer contexto. */
function onLanguageChange(callback) {
  languageChangeListeners.push(callback);
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (err) {}
  applyTranslations();
  languageChangeListeners.forEach(cb => {
    try { cb(lang); } catch (err) { console.error('[i18n] Erro num listener de troca de idioma:', err); }
  });
}

window.i18n = {
  t,
  setLanguage,
  applyTranslations,
  onLanguageChange,
  getCurrentLang: () => currentLang,
  getAvailableLanguages: () => Object.keys(TRANSLATIONS),
};
