# 💡 WOUFF Project Ideas & Automations

## Automated Tidal Discography Integration
*Current State:* The discography entries are hardcoded inside `src/config.ts`.
*Goal:* Automatically sync the website with the artist's Tidal page when a new album or single is released.

### Proposed Architecture

#### 1. JSON Data Structure
Instead of managing a TypeScript hardcoded array, the site should eventually load data from a static JSON file (e.g. `src/data/discography.json`). This makes programmatic modification via a script significantly safer and easier than regexing a TypeScript `.ts` file.

#### 2. Headless Node.js Scraper (`scripts/syncTidal.js`)
Tidal is a Single Page Application that dynamically populates data from private APIs. Standard HTTP fetching (`curl` or `fetch`) will only return an empty HTML shell.
- Create a scraping script utilizing `puppeteer` (or tracking internal tidal undocumented API endpoints).
- The script acts as an automated browser, navigating to `https://tidal.com/artist/55959610`.
- Once the `<div id="wimp">` DOM fully hydrates with albums under the "EP & Singles" or "Albums" tabs, the script extracts:
  - Album Title
  - Release Year
  - High-res Image URL (`resources.tidal.com/.../1280x1280.jpg`)
  - Direct Album Link
- The script cross-references the extracted IDs against the current `discography.json` file.
- If a novel release is detected, it overwrites/updates the JSON structure.

#### 3. Continuous Integration via GitHub Actions
- A CI/CD pipeline file (e.g., `.github/workflows/tidal-sync.yml`) is generated.
- The pipeline executes the `syncTidal.js` scraping script periodically via a CRON schedule (e.g. every 24 hours at midnight UTC).
- If the script modifies `src/data/discography.json`, the GitHub Action automatically performs a `git add`, `git commit`, and pushes back into the repository main branch.
- This push automatically triggers the site's hosting provider (Vercel, Netlify, Cloudflare, etc.) to rebuild and deploy the updated static website globally with zero manual human labor.
