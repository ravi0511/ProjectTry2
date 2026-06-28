# Data Model: Public Digital Resume Webpage

## Core Entities

### CandidateProfile
Represents the person described by the resume.

**Fields**:
- fullName: string
- headline: string
- location: string
- email: string
- phone: string
- summary: string
- skills: array of SkillGroup
- technologies: array of string
- experience: array of ExperienceEntry

**Validation Rules**:
- fullName, headline, summary, and at least one contact method should be present.
- experience should be an array of one or more entries for a meaningful resume.

### ExperienceEntry
Represents a professional role or work history item.

**Fields**:
- role: string
- company: string
- startDate: string
- endDate: string
- location: string
- highlights: array of string

**Validation Rules**:
- role and company are required.
- highlights should be concise and professional.

### SkillGroup
Represents a grouping of related skills or capabilities.

**Fields**:
- title: string
- items: array of string

**Validation Rules**:
- title and at least one skill item are required.

### ResumeSection
Represents a major section rendered on the page.

**Fields**:
- id: string
- title: string
- content: string or structured data

**Validation Rules**:
- id and title should be unique within the page.

## Relationships

- A CandidateProfile contains one or more ExperienceEntry records.
- A CandidateProfile contains one or more SkillGroup records.
- The page renders ResumeSection entries derived from the candidate profile content.

## Notes

The data model is intentionally simple because the site is static and does not require persistence or database storage.
