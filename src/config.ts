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
    { date: '03/08/2026', type: '<DIR>', name: 'LINKS', id: 'LINKS' },
    { date: '03/24/2026', type: '     ', name: 'LATEST_MEDIA.MOV', id: 'MEDIA' },
    { date: '03/20/2026', type: '     ', name: 'DISCOGRAPHY.EXE', id: 'DISCO' },
    { date: '03/08/2026', type: '     ', name: 'ABOUT_POTEAR.TXT', id: 'ABOUT_P' },
    { date: '03/08/2026', type: '     ', name: 'ABOUT_WOUFF.TXT', id: 'ABOUT_W' },
  ],

  // Sub-page Content Definitions
  PAGES: {
    LINKS: [
      { date: '03/08/2026', type: '     ', name: 'INSTAGRAM.LNK', url: 'https://instagram.com' },
      { date: '03/08/2026', type: '     ', name: 'YOUTUBE.LNK', url: 'https://youtube.com' },
      { date: '03/08/2026', type: '     ', name: 'X_TWITTER.LNK', url: 'https://x.com' },
      { date: '03/08/2026', type: '     ', name: 'TIKTOK.LNK', url: 'https://tiktok.com' },
    ],
    MEDIA: [
      { date: '03/24/2026', type: 'INFO ', name: 'LATEST RELEASE' },
      { date: '03/24/2026', type: 'STAT ', name: '[ STATUS: WORKING ON IT ]' },
    ],
    DISCO: [
      { date: '03/20/2026', type: 'INFO ', name: 'FULL DISCOGRAPHY' },
      { date: '03/20/2026', type: 'STAT ', name: '[ STATUS: WORKING ON IT ]' },
    ],
    ABOUT_P: [
      { date: '03/08/2026', type: 'INFO ', name: 'PROFILE: POTEAR' },
      { date: '03/08/2026', type: 'STAT ', name: '[ STATUS: WORKING ON IT ]' },
    ],
    ABOUT_W: [
      { date: '03/08/2026', type: 'INFO ', name: 'PROFILE: WOUFF' },
      { date: '03/08/2026', type: 'STAT ', name: '[ STATUS: WORKING ON IT ]' },
    ],
  }
} as const;
