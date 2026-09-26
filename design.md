# Design - AI Code Reviewer

**Project Type: Hackathon Project**

## Overview

AI Code Reviewer uses a simple and clean interface focused on making code review easy to understand.

The application uses a dark theme by default and also provides a light theme. The layout is designed to work well on desktop and smaller screens without making the interface too complicated.

## Page Layout

The application has three main areas:

1. Navbar
2. Code Review Section
3. Review History Section

A small footer is shown at the bottom of the page.

## Navbar

The navbar contains:

- AI Code Reviewer logo and name
- Live local date and time
- Dark / Light theme button
- Application status

The clock stays centered in the navbar and shows the user's local time and timezone.

## Code Review Section

The main review area contains:

- Language selector
- File upload option
- Code editor
- Character count
- Review Code button
- Validation messages

The editor is the main input area where users paste or upload their code.

The interface keeps the review button easy to find and gives feedback when the input is invalid or the review is being processed.

## Results Section

After a successful review, the results section shows:

- Code Health score
- Total issues
- Security issues
- Performance issues
- Quality issues
- AI Summary
- Time Complexity
- Space Complexity
- Optimization Suggestion
- Individual issue cards

Issues can be filtered by:

- All
- Bug
- Security
- Performance
- Quality

The results also include a Copy Report option.

## Review History

The History section shows previously saved reviews.

Each history item includes useful information such as:

- Programming language
- Date and time
- Issue counts
- Time complexity
- Space complexity
- Score

Users can search their history, open previous reviews and use View More / Show Less to see additional reviews.

A refresh button is also available to reload the history.

## Themes

### Dark Theme

Dark mode is the default theme of the application.

It uses a dark background with lighter text and a cyan accent for important controls and information.

### Light Theme

Users can switch to a light theme from the navbar.

The light theme changes the background, cards, text, inputs and other interface elements so the application remains easy to read.

The selected theme is saved and restored when the user opens the application again.

## Feedback and Loading States

The application gives visual feedback during important actions.

### Loading

A loading skeleton is shown while the AI review is being processed.

The Review Code button is disabled during the request to prevent duplicate submissions.

### Toast Notifications

Small toast messages are used for actions such as:

- Review saved
- Report copied
- Review failed
- Unsupported file type

### Validation Messages

Invalid input is shown with an inline message below the Review Code button.

This keeps errors visible without using browser alert popups.

## Visual Style

The design uses:

- Clean cards
- Rounded controls
- Simple spacing
- Cyan and blue accents
- Subtle hover effects
- Light animations

The interface is designed to feel like a small developer tool rather than a large marketing website.

## Responsive Design

The layout adapts to smaller screen sizes.

On smaller screens:

- Navbar content is rearranged
- Review controls stack vertically
- Summary cards use fewer columns
- History information adjusts to fit the screen
- The main content uses more available width

The goal is to keep the application usable on both desktop and mobile screens.

## Design Principles

The main design goals are:

- Keep the interface simple
- Make important information easy to find
- Avoid unnecessary visual elements
- Give clear feedback after user actions
- Keep the application consistent in both themes
- Use animations only where they improve the experience
