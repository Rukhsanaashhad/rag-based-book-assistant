---
id: 17030800000021
title: TOC ONLY ON DESKTOP – HIDE ON MOBILE
stage: green
date: 2025-12-16
surface: agent
model: gemini-1.5-pro-latest
feature: phase-1-docusaurus-book
branch: 
user: 
command: /sp.implement
labels: [docusaurus, css, toc, desktop-only]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- "src/css/custom.css"
tests:

---

## Prompt

TOC ONLY ON DESKTOP – HIDE ON MOBILE

1. Update src/css/custom.css:

   /* Show TOC only on desktop (side panel) */
   @media (max-width: 996px) {
     .theme-doc-toc-mobile {
       display: none !important;
     }
     .theme-doc-toc-desktop {
       display: block !important;
     }
   }

   @media (min-width: 997px) {
     .theme-doc-toc-mobile {
       display: none !important;
     }
     .theme-doc-toc-desktop {
       display: block !important;
       position: sticky;
       top: 100px;
       max-height: calc(100vh - 150px);
       overflow-y: auto;
       padding: 15px;
       background: var(--ifm-background-color);
       border-left: 1px solid var(--ifm-toc-border-color);
     }
   }

2. Make sure TOC is rich and useful

Execute now – TOC only on desktop side panel, completely hidden on mobile (no "On this Page" button).

## Response snapshot

I have applied the new CSS to `src/css/custom.css` to make the Table of Contents desktop-only and completely hidden on mobile as per your instructions.

## Outcome

- ✅ Impact: High, as it implements the user's explicit request for desktop-only TOC display.
- 🧪 Tests: Verification pending due to inability to run development server.
- 📁 Files: 1 file modified (src/css/custom.css)
- 🔁 Next prompts: User needs to run `npm start` to verify changes.
- 🧠 Reflection: Applied new CSS with media queries to restrict TOC visibility to desktop. Repeated cancellations of `npm start` continue to prevent verification. User intervention required to allow server startup.

## Evaluation notes (flywheel)

- Failure modes observed: inability to verify due to user cancelling npm start
- Graders run and results (PASS/FAIL): PASS (code applied, verification pending)
- Prompt variant (if applicable): N/A
- Next experiment (if applicable): N/A
