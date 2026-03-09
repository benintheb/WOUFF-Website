# 🖥️ WOUFF-Website

Official website of **WOUFF** or **Potear**.
A minimal, artistic landing page for contact information, social media links, and a showcase of released musical projects.

---

## 📝 Website Summary
- **Purpose:** Simple information hub and musical portfolio.
- **Visuals:** MS-DOS / Terminal aesthetic with a focus on an "artistic touch."
- **Core Features:**
    - SNS Hyperlinks (Instagram, YouTube, X, TikTok).
    - Latest YouTube video embed.
    - Automated carousel of released music (Spotify/YouTube Music integration).
    - Hover effects for project release dates.
- **Design Constraints:**
    - Main color: `#50852A` (or Terminal Green `#00FF00` for DOS versions).
    - Responsive for mobile and tablets.
    - Clean, efficient code using **Strict Vanilla CSS** and **TypeScript**.

---

# 📜 Daily Logs & Project Plans

## 📅 26.03.10 | ver.04 - Specialized Layouts & Interactive Polish

### **Log:**
> 1. Fix link navigation to work with the `Enter` button.
> 2. Implement specialized layouts for `.MOV` (embedded player), `.TXT` (text app), and `.EXE` (app character).
> 3. Animate ASCII header, directory listings, prompt, and footer in a unified, smooth top-to-bottom sequence on cold boot.
> 4. **Minimal Motion Navigation:** When navigating between standard pages (e.g., MAIN to LINKS and back), only the changing list content undergoes the loading sequence. The header, breadcrumbs, prompt, and footer remain fixed and visible.
> 5. Improve Mobile UX: Disable automatic keyboard pop-up when clicking links.
> 6. Expand `config.ts`: Centralize all new UI text, error templates, and metadata.
> 7. **Refined Error Display:** Show persistent, dimmed, all-caps error messages (`[INPUT] : COMMAND OR FILE NOT FOUND`) without the drive path prefix.
> 8. Unified Selection: Mouse hover and keyboard selection now sync; highlight follows the mouse cursor.
> 9. Smart Enter: Empty prompt `Enter` executes selected item; otherwise executes typed command.
> 10. Interactive Breadcrumbs: Clickable path segments that trigger page reloads with hover feedback.
> 11. **Layout Stability:** Implemented fixed height for the list container and absolute footer positioning to ensure UI elements stay in place during reloading.
> 12. **Context-Aware Reloads:** Clicking the root segment `C:\WOUFF` while on the home page now triggers a full system reload animation.
> 13. **Sync Animation Speeds:** Matched ASCII header loading speed with the directory list speed for a smoother, synchronized boot feel.

---

### **Detailed Project Plan: Version 04**

#### **1. Specialized File Handlers & Sequential Loading**
- **Unified Loading:** Coordinate a single animation timeline from [Header] -> [Info] -> [Content] -> [Prompt] -> [Footer] for the initial site load.
- **State-Aware Transitions:** Implement logic to detect transitions between standard list pages. If the layout remains consistent (e.g., MAIN <-> LINKS), bypass header/footer/prompt animations and only trigger the line-by-line load for the new directory items.
- **Force Reload:** Clicking the breadcrumb segment for the current root path (`C:\WOUFF` on MAIN) triggers a full-page animation reset.
- **Component Loading:** Apply the line-by-line "load" effect to media players and text containers.

#### **2. Unified Interaction Model**
- **Hover Sync:** Map `onMouseEnter` to `setSelectedIndex` for a seamless mouse/keyboard experience.
- **Breadcrumb Navigation:** Interactive segments with hover-state styling; clicking the current segment triggers a page reload animation.
- **Dual-Mode Enter:** Conditional logic for the `Enter` key based on prompt buffer state.

#### **3. Terminal & UX Refinements**
- **Layout Architecture:** Use a dedicated height for the directory listing container and absolute positioning for the footer to prevent jumping during sequential loads.
- **Clean All-Caps Errors:** Display `[INPUT] : COMMAND OR FILE NOT FOUND` in dimmed color; exclude drive prefix to reduce visual noise.
- **Config Synchronization:** Move every hardcoded string and UI setting into `src/config.ts` to ensure project-wide unison.
- **Operational Update:** Update `AGENTS.md` to prioritize user-centric UX thinking and approval-based workflows.

#### **4. Global Metadata Config**
- **Integration:** Sync `index.html` titles and icons with `SYSTEM_CONFIG` values.

---

## 📅 26.03.09 | ver.03 - Modernized Terminal & Navigation

### **Log:**
> 1. The list is to be a vertical list. format: `[Date] [Type] [Name]`.
> 2. Post-boot pages should load line-by-line briefly (simulating old DOS systems).
> 3. Implement actual content sub-pages (Links, Media, etc.). Links page has its own list. Other sub-pages: 'WORKING ON IT' for now.
> 4. **Centralized Configuration:** All key elements (colors, command names, speeds, footer text, ASCII header) must be in a single `config` file for easy adjustment.

---

### **Detailed Project Plan: Version 03**

#### **1. Architecture: The Config Module**
- **Goal:** Consolidate all "knobs" into a single, well-annotated file.
- **File:** `src/config.ts` (or `src/system.config.ts`).
- **Adjustables:**
  - `COLOR_THEME`: Primary, Dimmed, and Background colors.
  - `COMMAND_LIST`: Names, dates, and associated "file types" (DIR, EXE, TXT).
  - `SPEED_SETTINGS`: BIOS boot speed, page line-load speed.
  - `FOOTER_TEXT`: Copyright and status tags.
  - `ASCII_HEADER`: The large "POTEAR" string.

#### **2. Visual UI Updates**
- **List Format:** Navigation list will emulate a true DOS directory listing:
  ```text
  03/08/2026  <DIR>       LINKS
  03/24/2026              LATEST_MEDIA.MOV
  03/20/2026              DISCOGRAPHY.EXE
  ...
  ```
- **Sequential Loading:** Content sub-pages will not appear instantly; they will render line-by-line using a staggered animation for a vintage "loading" feel.

#### **3. Navigation & Content Sub-pages**
- **State Management:** Implement a `currentPage` state to switch between `MAIN`, `LINKS`, `MEDIA`, etc.
- **Back Navigation (`..`):**
  - All sub-pages will include a `..` entry at the top of their list.
  - Users can select `..` via **Arrow Keys**, **Clicking**, or by typing `..` (or `CD ..`) into the prompt to return to the root.
- **`DIR LINKS` Page:**
  - A new list of social media links (Instagram, YouTube, X, TikTok).
- **Placeholder Pages:** Other commands load a simple page displaying `[ STATUS: WORKING ON IT ]`.

#### **4. Interactive Logic**
- **Refined Selection:** Update the command prompt and arrow key logic to handle nested navigation (going into a folder, back to root).
- **Tab Completion:** Sync with the new centralized command list in the config.

---

## 📅 26.03.09 | ver.02 - Interactive Monitor Experience

### **Log:**
> NO flickering of letters. Just like left and right spaces, there needs to be space on top and bottom. Like a small monitor. (*In mobile environment: rid of left and right space, keep top and bottom.*)
>
> At startup, only the Boot-up sequence should be visible on the monitor. 
> After boot up: A big 'POTEAR' header in MS-DOS aesthetics covers the upper portion.
> Lower portion: A list including `DIR /LINKS`, `VIEW LATEST_MEDIA.MP4`, `LOAD DISCOGRAPHY.EXE`, `ABOUT POTEAR`, `ABOUT WOUFF`.
>
> Interactive Prompt: User can select with **Arrow Keys** or via the **Command Prompt**.
> Features: TAB autocompletion with dimmed suggestions; exact command naming required for execution; error shown for invalid commands.

---

### **Detailed Project Plan: Version 02**

#### **1. Visual Concept & Atmosphere**
- **"The Monitor":** A centered container simulating a small CRT screen.
- **Spacing:** Fixed aspect-ratio feel with internal padding. Mobile adaptive (edge-to-edge width, retained vertical padding).
- **Effects:** Static CRT scanlines; removal of text flicker.
- **Header:** Large ASCII-art "POTEAR" header post-boot.

#### **2. Structure & Navigation**
- **Initialization:** Only the BIOS sequence shows during the boot phase.
- **Navigation List:** Vertical list of options selectable via arrow keys or mouse.
- **Interactive Command Prompt:** 
  - Real-time command feedback.
  - **TAB Autocomplete:** Dimmed suggestions for commands (e.g., 'D' -> 'DIR /LINKS').
  - **Execution:** ENTER key triggered; validation check with "BAD COMMAND" fallback.
- **Content Routing:** Selecting an option clears the monitor to load specific sub-pages.

#### **3. Technical Mandates**
- **Vanilla CSS:** Strict Grid/Flexbox layout.
- **TypeScript:** Typed state management for navigation and input.
- **Keyboard listeners:** Implementation for `ArrowUp`, `ArrowDown`, `Tab`, and `Enter`.

---

## 📅 26.03.08 | ver.01 - MS-DOS Terminal Aesthetic

### **Log:**
> A MS-DOS type design with every information needed. The previous design/colorway colorway can be ignored in this version.

---

### **Detailed Project Plan: Version 01**

#### **1. Visual Concept & Atmosphere**
- **Style:** Late 80s/early 90s command-line emulation.
- **Typography:** `VT323` pixel-perfect monospace.
- **Palette:** `#00FF00` (Classic Green) on `#000000` (Black).
- **Effects:** Typewriter text-entry and blinking cursor.

#### **2. Structure & Sections**
- **Header (BIOS):** Simulated boot-up sequence.
- **Navigation:** Clickable command prompt items.
- **Content Blocks:**
  - `DIR /LINKS`: SNS directory listing.
  - `VIEW LATEST_MEDIA.MP4`: Framed YouTube embed.
  - `LOAD DISCOGRAPHY.EXE`: Music listing with hover-reveal dates.
- **Footer:** System status (READY) and copyright tag.

#### **3. Technical Details**
- **Framework:** React (Vite + TypeScript).
- **Styling:** Vanilla CSS.
- **Responsiveness:** Grid-based terminal scaling.
