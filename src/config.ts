/**
 * SYSTEM CONFIGURATION (src/config.ts)
 * ------------------------------------
 * Use this file to adjust the look and behavior of the WOUFF-Website.
 */

export const SYSTEM_CONFIG = {
  // Visual Aesthetics
  COLORS: {
    PRIMARY: '#00FF00', // Classic Terminal Green
    DIMMED: '#00AA00',  // Dimmed Green for secondary info
    BACKGROUND: '#000000', // Absolute Black
  },

  // Timing & Speeds (in milliseconds)
  SPEEDS: {
    BOOT_STEP_MIN: 200,
    BOOT_STEP_MAX: 700,
    BOOT_READY_DELAY: 1000,
    PAGE_LINE_LOAD: 70, // Speed at which sub-page lines appear
  },

  // ASCII Header Configuration
  HEADER: {
    TEXT: `
 ██████╗  ██████╗ ████████╗███████╗ █████╗ ██████╗ 
 ██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝██╔══██╗██╔══██╗
 ██████╔╝██║   ██║   ██║   █████╗  ███████║██████╔╝
 ██╔═══╝ ██║   ██║   ██║   ██╔══╝  ██╔══██║██╔══██╗
 ██║     ╚██████╔╝   ██║   ███████╗██║  ██║██║  ██║
 ╚═╝      ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
`,
  },

  // Footer Information
  FOOTER: {
    COPYRIGHT: '(C) 2026 WOUFF. ALL RIGHTS RESERVED.',
    STATUS: 'STATUS: READY.',
  },

  // Main Directory Commands
  // Format: [Date, Type, Name, ID]
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
