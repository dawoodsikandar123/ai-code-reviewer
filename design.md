# Design - AI Code Reviewer

**Project Type: Hackathon Project**

## Design Overview

AI Code Reviewer has a simple and clean interface made for code review.

The design keeps the important information easy to find without making the application feel crowded.

## Main Layout

The application is divided into:

- Navbar
- Code Review section
- Review Results section
- Review History section
- Footer

## Navbar

The navbar includes:

- AI Code Reviewer logo
- Live local date and time
- Dark / Light theme button
- Ready status

## Code Review Section

The main input area includes:

- Language selector
- Code editor
- File upload
- Character count
- Review Code button
- Validation messages

The editor is kept as the main focus of the page so users can quickly submit their code.

## Review Results

After a review, the results section displays:

- Code Health score
- Issue summary
- AI Summary
- Time Complexity
- Space Complexity
- Optimization Suggestion
- Individual issue cards
- Issue filters
- Copy Report option

The results are organized so users can quickly understand the overall review and then look at individual issues.

## Review History

The History section shows previous reviews in a compact format.

Users can:

- Search previous reviews
- Open a previous review
- View more saved reviews
- Refresh the history

Each history item shows useful information such as language, score, issue counts and complexity.

## Theme

### Dark Mode

Dark mode is the default theme.

It uses a dark interface with lighter text and accent colors for important elements.

### Light Mode

Users can switch to Light Mode from the navbar.

The interface remains readable and consistent across both themes.

## Feedback

The application provides clear feedback during user actions.

- A loading state is shown while a review is being processed.
- Toast messages are used for important actions.
- Validation messages are shown when the submitted input is not valid.

## Visual Style

The design uses:

- Clean cards
- Rounded controls
- Simple spacing
- Accent colors for important information
- Subtle hover effects
- Light animations

The overall style is intended to feel like a simple developer tool rather than a large marketing website.

## Responsive Design

The layout adjusts for smaller screens.

On mobile devices:

- Navigation content is rearranged
- Review controls stack vertically
- Summary information uses fewer columns
- History items adjust to fit the available space

The goal is to keep the application simple and usable across different screen sizes.
