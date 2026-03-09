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
> 3. Animate the ASCII "POTEAR" header line-by-line at startup.
> 4. Improve Mobile UX: Disable automatic keyboard pop-up when clicking links.
> 5. Expand `config.ts`: Include favicon, website name, and SEO metadata.
> 6. Enhance Prompt: Add command history (up arrow to recall) and show the last command above the prompt in dimmed color.
> 7. Interactive Hover: Selection highlight follows mouse cursor and highlights items on hover.

---

### **Detailed Project Plan: Version 04**

#### **1. Specialized File Handlers**
- **Media (`.MOV`):** Create a terminal-styled video container. Layout: [Video Player] -> [Prompt] -> [Footer]. (Note: ASCII header is hidden for this view).
- **Text (`.TXT`):** Create a "DOS Edit" style viewer for content-heavy pages. Layout: [Text Viewer] -> [Prompt] -> [Footer]. (Note: ASCII header is hidden for this view).
- **Apps (`.EXE`):** Unique interactive layout for the discography. Layout: [App Interface] -> [Prompt] -> [Footer]. (Note: ASCII header is hidden for this view).

#### **2. Advanced Terminal Logic**
- **Command Buffer:** Store the last executed command.
- **Visual History:** Render the previous command line above the active prompt using `var(--terminal-dim)`.
- **Recall:** Map `ArrowUp` to restore the last command string to the input.
- **Header Animation:** Split the ASCII header into lines and stagger their appearance using the `PAGE_LINE_LOAD` speed.

#### **3. UX & Mobile Optimization**
- **Input Management:** Ensure `inputMode="none"` or similar logic for non-text interactions to prevent keyboard intrusion on mobile links.
- **Mouse Sync:** Bridge the gap between `selectedIndex` (keyboard) and `hoverIndex` (mouse) for a unified highlight effect.

#### **4. Global Metadata Config**
- **Integration:** Sync `index.html` titles and icons with `SYSTEM_CONFIG` values via a script or React Helmet-style effect.

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
