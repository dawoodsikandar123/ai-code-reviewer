# Tech Stack - AI Code Reviewer

**Hackathon Project**

---

## Runtime & Server

| Technology  | Version | Purpose                                                         |
| ----------- | ------- | --------------------------------------------------------------- |
| **Node.js** | 24      | Runs the backend and provides the built-in `node:sqlite` module |
| **Express** | 5.2.1   | Handles the server, API routes and frontend files               |
| **dotenv**  | 18.0.3  | Loads the Gemini API key from the `.env` file                   |

---

## Database

| Technology        | Purpose                                                                       |
| ----------------- | ----------------------------------------------------------------------------- |
| **SQLite**        | Stores review history, review scores, complexity information and issues       |
| **`node:sqlite`** | Connects the Node.js backend to SQLite without using another database package |

The database contains two main tables:

* `reviews` for saved review information
* `issues` for issues linked to each review

---

## AI

| Technology            | Purpose                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| **Google Gemini API** | Reviews the submitted code and returns issues, summary, complexity and optimization suggestions |
| **Gemini Flash Lite** | Model used for the code review                                                                  |

The backend sends requests to Gemini using the built-in `fetch` available in Node.js. No Gemini SDK is used.

---

## Frontend

| Technology             | Purpose                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| **HTML5**              | Builds the structure of the application                                                               |
| **CSS3**               | Handles the styling, responsive layout, dark/light theme and animations                               |
| **Vanilla JavaScript** | Handles code submission, validation, API requests, results, history, search, filters, theme and clock |

The frontend does not use a separate framework such as React or Vue.

---

## Browser Features

| Browser API               | Purpose                                         |
| ------------------------- | ----------------------------------------------- |
| **Fetch API**             | Communicates with the backend                   |
| **localStorage**          | Saves the selected theme                        |
| **Clipboard API**         | Copies the review report                        |
| **Intl.DateTimeFormat**   | Detects the user's local timezone for the clock |
| **setInterval**           | Updates the live clock                          |
| **requestAnimationFrame** | Runs score and number animations                |

---

## API Routes

| Route                  | Purpose                               |
| ---------------------- | ------------------------------------- |
| **POST `/review`**     | Validates and reviews submitted code  |
| **GET `/history`**     | Returns saved reviews                 |
| **GET `/history/:id`** | Returns the details of a saved review |

---

## Project Configuration

| File                | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `package.json`      | Project information and dependencies                       |
| `package-lock.json` | Locks installed dependency versions                        |
| `.env`              | Stores the Gemini API key                                  |
| `.gitignore`        | Keeps `.env`, database files and `node_modules` out of Git |

---

## Development Tools

| Tool                       | Purpose                                           |
| -------------------------- | ------------------------------------------------- |
| **IBM Bob**                | AI-assisted development and code changes          |
| **Anthropic Claude**       | AI assistance during development                  |
| **OpenAI ChatGPT**         | AI assistance for development and problem solving |
| **Google Antigravity IDE** | AI-assisted coding and project development        |
| **Git**                    | Tracks project changes                            |
| **GitHub**                 | Stores the project repository and source code     |


---

## Project Approach

The project uses a simple frontend and backend structure.

The frontend sends valid code to the Express server. The server validates the input, sends the request to Gemini, saves the review in SQLite and returns the result to the frontend.

This keeps the Gemini API key on the server and allows users to access their previous reviews through the History section.
