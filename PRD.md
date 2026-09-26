# PRD

## AI Code Reviewer

**Project Type: Hackathon Project**

## Project Overview

AI Code Reviewer is a simple web application that helps users review their code with the help of Google Gemini.

Users can paste their code or upload a code file. They can then select the programming language and get a review of their code.

**The project was built as a beginner level hackathon project with the goal of making basic code review simple and easy to use.**

## Problem

Finding problems in code can take time. Beginners can also find it difficult to understand bugs or performance problems on their own.

This project helps by giving quick feedback about the code and explaining the problems that may need attention.

## Goal

The main goal is to create a simple tool that can review code and give useful feedback in one place.

The user should be able to submit code and quickly see what may need to be fixed or improved.

## Supported Languages

The application currently supports:

1. JavaScript
2. TypeScript
3. Python
4. Java
5. C
6. C++

Other languages are not supported at the moment.

## Main Features

1. Users can paste code into the editor.

2. Users can upload supported code files.

3. The application can detect the language from a supported file.

4. Invalid input and unsupported files are rejected before the AI review.

5. The application checks if the selected language matches the submitted code.

6. Google Gemini reviews valid code.

7. The review can find bugs, security problems, performance problems and code quality issues.

8. The application gives a Code Health score.

9. The review includes Time Complexity and Space Complexity.

10. The application gives an optimization suggestion.

11. The AI provides a short summary of the review.

12. Users can filter issues by type.

13. Users can copy the review report.

14. Reviews are saved in SQLite.

15. Users can view and search previous reviews.

16. Users can load an old review again.

17. Users can use Dark or Light mode.

18. The application shows the user's local date and time.

19. Loading states and toast messages provide feedback during different actions.

## Target Users

The project is mainly aimed at:

1. Students learning programming

2. Beginner developers

3. Developers who want quick feedback on their code

## How It Works

The basic flow of the application is:

1. The user enters or uploads code.

2. The user selects a supported language.

3. The application validates the input.

4. Valid code is sent to Google Gemini.

5. Gemini returns the review information.

6. The application displays the results.

7. The review is saved in the local database.

8. The user can open the review again from History.

## Expected Result

The application should give users a quick and simple way to understand possible problems in their code.

It should also help users understand the complexity of their code and give suggestions that may help improve it.

## Project Scope

This is a small hackathon project focused on basic AI powered code review.

It is not intended to replace a full IDE or professional static analysis tool.

The current version focuses on the six supported languages and the features included in the application.

## Future Ideas

Some features could be added later such as better code fixing and more advanced analysis.

These are not part of the current version of the project.
