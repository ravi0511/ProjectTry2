# Research: Public Digital Resume Webpage

## Decision: Use a lightweight React + Tailwind single-page app

**Decision**: Build the resume as a Vite-based React application styled with Tailwind CSS.

**Rationale**: This approach provides a modern, responsive UI while remaining simple to maintain. React makes the page structure clear and reusable for sections such as summary, skills, and work history, while Tailwind helps ensure the layout adapts well across mobile, tablet, and desktop screens.

**Alternatives considered**:
- Plain HTML/CSS/JavaScript only: Simpler for a static page, but less maintainable for repeated sections and future expansions.
- A framework-heavy setup such as Next.js: More structure than needed for a single public resume page and adds unnecessary complexity.
- A CMS or database-backed site: Overkill for static content and conflicts with the requirement that the page be simple and deployable without dynamic data.

## Decision: Keep content static and editable through source files

**Decision**: Store the resume content in a local JavaScript data module and update it by editing the source before redeploying.

**Rationale**: This satisfies the requirement for static content and avoids any need for a database or backend.

**Alternatives considered**:
- External JSON file fetched at runtime: Adds an extra layer of complexity without benefiting a simple static site.
- Hard-coded JSX content throughout the app: Less maintainable and harder to update consistently.

## Decision: Prioritize semantic structure and accessibility

**Decision**: Use semantic HTML elements, readable typography, strong contrast, and responsive spacing.

**Rationale**: This directly supports recruiter usability and aligns with the constitution’s readability and accessibility requirements.

**Alternatives considered**:
- Highly visual, graphic-heavy layouts: Less readable and may reduce clarity for recruitment purposes.
- Complex navigation patterns: Not needed for a single-page resume and would create friction.
