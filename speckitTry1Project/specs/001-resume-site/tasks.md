# Tasks: Public Digital Resume Webpage

**Input**: Design documents from [specs/001-resume-site](.)

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create the Vite React project structure in the repository root for the public resume site
- [x] T002 Initialize the frontend project with React, Vite, and Tailwind CSS dependencies
- [x] T003 [P] Configure base styling and Tailwind setup for responsive layout support

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Create the main application shell and entry files in frontend/src/
- [x] T005 [P] Create a centralized resume content module in frontend/src/data/resumeContent.js
- [x] T006 [P] Add base global styles and Tailwind directives in frontend/src/index.css
- [x] T007 Set up the app layout structure so the page can render sections in a single-page flow

---

## Phase 3: User Story 1 - Present the candidate clearly to recruiters (Priority: P1) 🎯 MVP

**Goal**: Deliver a polished, public-facing resume landing page that immediately communicates the candidate’s identity, summary, and key strengths.

**Independent Test**: A visitor can open the page and see the header, summary, and core skills without needing additional navigation.

### Implementation for User Story 1

- [x] T008 [P] [US1] Build the header section with personal information and contact details in frontend/src/components/Header.jsx
- [x] T009 [US1] Implement the summary and skills presentation in frontend/src/components/Section.jsx
- [x] T010 [US1] Render the candidate profile data from the content module in frontend/src/App.jsx
- [x] T011 [US1] Add responsive spacing, typography, and card-based layout styling for the landing view in frontend/src/index.css
- [x] T011B [US1] Add support for a profile picture in the header and wire it to the shared resume content in frontend/src/components/Header.jsx and frontend/src/data/resumeContent.js

**Checkpoint**: The MVP page should be readable and visually complete on desktop and mobile.

---

## Phase 4: User Story 2 - Show experience and technical background (Priority: P2)

**Goal**: Provide recruiters with an easy-to-scan view of work history, experience highlights, and technologies worked on.

**Independent Test**: A recruiter can review work history and technologies on the page without additional explanation.

### Implementation for User Story 2

- [x] T012 [P] [US2] Build the experience list component in frontend/src/components/ExperienceList.jsx
- [x] T013 [US2] Add work history content rendering for multiple experience entries in frontend/src/App.jsx
- [x] T014 [US2] Add a technologies worked on section and supporting visual grouping in frontend/src/components/Section.jsx
- [x] T015 [US2] Ensure the experience and technology sections are readable and mobile-friendly in frontend/src/index.css

**Checkpoint**: Visitors can browse the candidate’s experience and technologies clearly from the single page.

---

## Phase 5: User Story 3 - Keep the page maintainable for future updates (Priority: P3)

**Goal**: Make resume content easy to update without redesigning the page.

**Independent Test**: A maintainer can update the content in the central data module and see the page reflect the revised information.

### Implementation for User Story 3

- [x] T016 [P] [US3] Organize the resume sections so content changes are isolated to the data module in frontend/src/data/resumeContent.js
- [x] T017 [US3] Add clear component props and structure so new sections can be introduced without major rewrites in frontend/src/components/
- [x] T018 [US3] Document the content update process in frontend/README.md or the project quickstart guide

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T019 [P] Verify the build and fix any issues with the production bundle
- [x] T020 [P] Validate the page in a local preview and confirm the mobile layout behaves correctly
- [x] T021 Prepare deployment instructions for a public static host such as GitHub Pages, Netlify, Vercel, or Azure Static Web Apps

### Notes
- Verified with `npm install` and `npm run build` in the frontend directory.
- Production build output was generated successfully in the `frontend/dist` folder.
