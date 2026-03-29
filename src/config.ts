/**
 * SYSTEM CONFIGURATION (src/config.ts)
 * ------------------------------------
 * Use this file to adjust the look, behavior, and text of the WOUFF-Website.
 */

export const SYSTEM_CONFIG = {
  // Global Website Settings
  METADATA: {
    TITLE: 'WOUFF SYSTEM BIOS',
    DESCRIPTION: 'Official website of WOUFF/Potear',
    FAVICON: '/favicon.ico',
  },

  // Visual Aesthetics & Effects
  COLORS: {
    PRIMARY: '#55D43F',    // Bright Forest Green (Balanced Visibility)
    DIMMED: '#3A912B',     // Muted Forest Green
    BACKGROUND: '#000000', // Absolute Black
  },

  VISUALS: {
    FONT_FAMILY: "'VT323', monospace",
    SCANLINE_OPACITY: 0.25,
    GLOW_INTENSITY: '0 0 10px rgba(85, 212, 63, 0.4)',
    LAYOUT: {
      DATE_COL_WIDTH: '1fr', // Spaced evenly
      TYPE_COL_WIDTH: '1fr', // Spaced evenly
      NAME_COL_WIDTH: '1fr', // Spaced evenly
    }
  },

  // Timing & Speeds (in milliseconds)
  SPEEDS: {
    BOOT_STEP_MIN: 200,
    BOOT_STEP_MAX: 700,
    BOOT_READY_DELAY: 1000,
    PAGE_LINE_LOAD: 50,    // Speed for sequential loading
  },

  // BIOS Boot Sequence Text
  BIOS: {
    TITLE: 'WOUFF SYSTEM BIOS v1.0',
    COPYRIGHT: '(C) 2026 WOUFF. ALL RIGHTS RESERVED.',
    CPU_INFO: 'CPU: POTEAR v0.1 @ 4.2GHz',
    MEMORY_INFO: 'MEMORY: 640KB OK',
    DISK_SEARCH: 'SEARCHING FOR DISK... OK',
    BOOT_MESSAGE: 'BOOTING FROM C:\\WOUFF... DONE',
  },

  // System Environment & Labels
  SYSTEM: {
    VOLUME_LABEL: 'VOLUME IN DRIVE C IS WOUFF_ROOT',
    DRIVE_LETTER: 'C:',
    ROOT_PATH: 'WOUFF',
    PROMPT_SYMBOL: '>',
    BACK_DIR_NAME: '..',
    BACK_DIR_TYPE: '<DIR>',
  },

  // User Interface Text
  UI_TEXT: {
    TABLE_HEADER_DATE: 'DATE',
    TABLE_HEADER_TYPE: 'TYPE',
    TABLE_HEADER_NAME: 'NAME',
    DIRECTORY_OF: 'DIRECTORY OF ',
    ERROR_TEMPLATE: ' : COMMAND OR FILE NOT FOUND', // Will be prefixed by input
  },

  // ASCII Header Configuration
  HEADER: {
    TEXT: `
░▒▓███████▓▒░ ░▒▓██████▓▒░▒▓████████▓▒░▒▓████████▓▒░░▒▓██████▓▒░░▒▓███████▓▒░  
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓██████▓▒░ ░▒▓████████▓▒░▒▓███████▓▒░  
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓█▓▒░       ░▒▓██████▓▒░  ░▒▓█▓▒░   ░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░ 
                                                                               
`,
  },

  // Footer Information
  FOOTER: {
    COPYRIGHT: '(C) 2026 WOUFF. ALL RIGHTS RESERVED.',
    STATUS: 'STATUS: READY.',
  },

  // Main Directory Commands
  COMMANDS: [
    { date: '03/28/2026', type: '<DIR>', name: 'LINKS', id: 'LINKS' },
    { date: '03/28/2026', type: '     ', name: 'LATEST_MEDIA.MOV', id: 'MEDIA' },
    { date: '03/28/2026', type: '     ', name: 'DISCOGRAPHY.EXE', id: 'DISCO' },
    { date: '03/28/2026', type: '     ', name: 'ABOUT_POTEAR.TXT', id: 'ABOUT_P' },
    { date: '03/28/2026', type: '     ', name: 'ABOUT_WOUFF.TXT', id: 'ABOUT_W' },
  ],

  // API Endpoints (Placeholders for Automation)
  API: {
    YOUTUBE_LATEST: 'https://www.googleapis.com/youtube/v3/search', // Requires API Key
    DISCOGRAPHY: 'https://itunes.apple.com/lookup', // Example efficient API
  },

  // Sub-page Content Definitions
  PAGES: {
    LINKS: [
      { date: '03/28/2026', type: '     ', name: 'YOUTUBE_MUSIC.LNK', url: 'https://music.youtube.com/channel/UCq3KuVtwvm-F3250CHpQzrw' },
      { date: '03/28/2026', type: '     ', name: 'SPOTIFY.LNK', url: 'https://open.spotify.com/artist/6I9gKch9kqOG4HI9EJsuST' },
      { date: '03/28/2026', type: '     ', name: 'APPLE_MUSIC.LNK', url: 'https://music.apple.com/us/artist/potear/1804801454' },
      { date: '03/28/2026', type: '     ', name: 'SOUNDCLOUD.LNK', url: 'https://soundcloud.com/potear-music' },
      { date: '03/28/2026', type: '     ', name: 'TIDAL.LNK', url: 'https://tidal.com/artist/55959610' },
      { date: '03/28/2026', type: '     ', name: 'MELON.LNK', url: 'https://www.melon.com/artist/timeline.htm?artistId=4296285' },
      { date: '03/28/2026', type: '     ', name: 'GENIE.LNK', url: 'https://www.genie.co.kr/detail/artistInfo?xxnm=80911522' },
      { date: '03/28/2026', type: '     ', name: 'VIBE.LNK', url: 'https://vibe.naver.com/artist/9658217' },
      { date: '03/28/2026', type: '     ', name: 'BUGS.LNK', url: 'https://music.bugs.co.kr/artist/20236050?wl_ref=list_ar_02_search' },
      { date: '03/28/2026', type: '     ', name: 'INSTAGRAM.LNK', url: 'https://www.instagram.com/potearwouff' },
      { date: '03/28/2026', type: '     ', name: 'YOUTUBE.LNK', url: 'https://www.youtube.com/@PotearWOUFF' },
      { date: '03/28/2026', type: '     ', name: 'X_TWITTER.LNK', url: '#' }, // No action
      { date: '03/28/2026', type: '     ', name: 'TIKTOK.LNK', url: '#' }, // No action
    ],
    MEDIA: [
      { date: '03/28/2026', type: 'INFO ', name: 'FETCHING LATEST VIDEO...' },
      { date: '03/28/2026', type: 'STAT ', name: '[ AUTO-SYNC ACTIVE ]' },
    ],
    DISCO: [
      { date: '03/28/2026', type: 'INFO ', name: 'FETCHING DISCOGRAPHY...' },
      { date: '03/28/2026', type: 'STAT ', name: '[ AUTO-SYNC ACTIVE ]' },
    ],
    ABOUT_P: [
      { date: '03/28/2026', type: '     ', name: 'He is not a product, he is not a trend, he is not a calculation.' },
      { date: '03/28/2026', type: '     ', name: ' ' },
      { date: '03/28/2026', type: '     ', name: 'He is the resonance of the abnormal, the unfiltered pulse of the unorthodox,' },
      { date: '03/28/2026', type: '     ', name: 'and the unprecedented sound of a soul that refuses to stay in line.' },
      { date: '03/28/2026', type: '     ', name: ' ' },
      { date: '03/28/2026', type: '     ', name: 'From the corners of the noise to the peaks of the high,' },
      { date: '03/28/2026', type: '     ', name: 'he translates the struggle into a rhythm of resilience.' },
      { date: '03/28/2026', type: '     ', name: ' ' },
      { date: '03/28/2026', type: '     ', name: 'Man down, man up, he carves his own path through the bullshit,' },
      { date: '03/28/2026', type: '     ', name: 'driven by a commitment to raw truth and elevation that never tires.' },
      { date: '03/28/2026', type: '     ', name: ' ' },
      { date: '03/28/2026', type: '     ', name: 'He reads the world from the back to the front,' },
      { date: '03/28/2026', type: '     ', name: 'searching for the frequency of the real.' },
      { date: '03/28/2026', type: '     ', name: ' ' },
      { date: '03/28/2026', type: '     ', name: 'This is the voice of Potear.' },
    ],
    ABOUT_W: [
      { date: '03/28/2026', type: '     ', name: 'It is not a label, it is not a company, it is not an entity.' },
      { date: '03/28/2026', type: '     ', name: ' ' },
      { date: '03/28/2026', type: '     ', name: 'It is a mindset, parallel vectors of choices,' },
      { date: '03/28/2026', type: '     ', name: 'how we approach the world and each other.' },
      { date: '03/28/2026', type: '     ', name: ' ' },
      { date: '03/28/2026', type: '     ', name: 'Embrace bold, authentic, and intentional choices.' },
      { date: '03/28/2026', type: '     ', name: ' ' },
      { date: '03/28/2026', type: '     ', name: 'Approach the world with fearless creativity, connection,' },
      { date: '03/28/2026', type: '     ', name: 'and a commitment to collective growth.' },
      { date: '03/28/2026', type: '     ', name: ' ' },
      { date: '03/28/2026', type: '     ', name: 'We owe us, friend or foe.' },
      { date: '03/28/2026', type: '     ', name: ' ' },
      { date: '03/28/2026', type: '     ', name: 'We are brought to you by WOUFF.' },
    ],
  }
} as const;
