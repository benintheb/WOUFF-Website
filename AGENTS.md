# 🤖 AGENT OPERATIONAL MANDATES

This document outlines the core behaviors, safety protocols, and technical standards for all AI agents working on the WOUFF-Website project.

---

## 1. Core Behavior & Boundaries

- **User-Centric UX Mindset:** Beyond technical implementation, you must proactively evaluate the user experience. Identify potential interaction clashes (e.g., keybinding conflicts) and ensure a seamless, intuitive interface. If a technical instruction compromises UX, you must report it to the instructor before proceeding.
- **Reporting:** Always summarize a brief report detailing exactly how the instructions were handled and what files were touched after completing a task.
- **Clarification:** If an instruction is ambiguous or lacks necessary context, stop and ask the instructor for clarification rather than guessing.
- **Zero Proactivity** Do not offer "next steps," "would you like me to..." questions, or recommendations for improvements. If an instruction is to "list" or "analyze," provide the data and stop. Any form of proactive suggestion is a violation of this mandate.
- **No Conversational Filler** Eliminate all "I will now..." or "I have finished..." preambles/postambles. Provide the requested information directly.

---

## 2. Safety & Override Protocols

- **CRITICAL Protection:** Do not delete, overwrite, or replace any code or file that the human instructor has created or modified.
- **Conflict Resolution:** If a new instruction directly clashes with existing human-written code or architecture, you must halt execution, alert the instructor of the conflict, and wait for explicit permission to proceed.
- **Sensitive Information:** Never hardcode sensitive information such as API keys, database passwords, or environment secrets. Always utilize environment variables.

---

## 3. Code Quality & Architecture

- **Documentation:** Write efficient, fast, clean, and well-documented code with clear inline comments explaining the "why," not just the "what."
- **Efficiency:** Generate no unnecessary code, boilerplate, or redundant files.
- **Modularity:** Break code into logical modules when appropriate, prioritizing future usage, reusability, and maintainability.
- **Conventions:** Strictly follow the established formatting, styling, and naming conventions already present in the codebase.

---

## 4. Debugging & Error Handling

- **Root Cause Analysis:** When encountering an error or bug, analyze the logs and clearly state the suspected root cause before attempting to write a fix.
- **Explicit Handling:** Do not silently suppress errors or use generic catch blocks without proper logging or handling mechanisms.
- **Failure Cap:** If a proposed fix fails twice, stop iterating and ask the instructor for guidance.

---

## 5. Dependencies & Ecosystem

- **Strict Vanilla CSS:** The project strictly uses Vanilla CSS with CSS Grid and Flexbox. Do not install or suggest any CSS frameworks, utility libraries (e.g., Tailwind CSS, Bootstrap), or CSS-in-JS solutions (e.g., styled-components). Keep styles native, lightweight, and precise.
- **Package Management:** Check `package.json` before suggesting new third-party libraries. If a new dependency is absolutely necessary and approved by the instructor, use the project's established package manager (`npm`, `yarn`, `pnpm`, or `bun`) to install it.
- **TypeScript Compliance:** All new code must be written in TypeScript (`.ts` or `.tsx`). Ensure strict typing is maintained. Do not use any `any` types; define proper interfaces or types for all props, state, and API responses.
- **Type Definitions:** If adding a valid third-party JavaScript library, automatically check for and install its corresponding `@types/` package as a dev dependency.
- **Vite Configuration:** Do not alter `vite.config.ts` or the underlying build process unless explicitly instructed to do so.
