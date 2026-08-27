# Auxiliaire — AI Study Assistant

A responsive AI-powered study workspace for asking questions, summarising uploaded notes, and generating interactive flashcard decks.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Anthropic](https://img.shields.io/badge/AI-Claude%20Haiku-D97757)](https://www.anthropic.com/)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)

**[Try the live application](https://auxiliaire.netlify.app/)**

## Overview

Auxiliaire brings several study tools into one authenticated workspace. Users can hold context-aware conversations with an AI tutor, upload study material for summarisation, turn a topic or note into a reusable flashcard deck, and return to their saved work later.

The frontend is built with React and Vite. Firebase provides authentication and user-scoped persistence, while Anthropic Claude powers chat responses, summaries, and flashcard generation.

## Screenshots

| AI tutor | Smart notes | Flashcards |
| --- | --- | --- |
| ![Auxiliaire AI tutor chat](./public/images/iPhone-chat-screen.png) | ![Auxiliaire smart notes](./public/images/iPhone-notes-screen.png) | ![Auxiliaire flashcards](./public/images/iPhone-flashcards-screen.png) |

## Features

- **AI tutor chat** — ask questions across different subjects and continue multi-message conversations.
- **Persistent sessions** — save chat history in Firestore and resume previous sessions.
- **Smart notes** — extract text from PDF, DOCX, and TXT files directly in the browser and generate concise summaries.
- **AI flashcards** — generate decks of 20–40 cards from either a topic or an uploaded note.
- **Interactive study experience** — tap to flip cards and swipe in either direction to move through a 3D card stack.
- **Rich responses** — render GitHub-flavoured Markdown, syntax-highlighted code, typing indicators, and copy-to-clipboard actions.
- **Authentication** — sign up with email and password, sign in with Google, reset passwords, and protect private routes.
- **Personal dashboard** — view saved notes, sessions, and flashcard decks in one place.
- **Responsive theming** — mobile-friendly layouts with persistent light and dark modes.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React 19, React Router 7, Tailwind CSS 4, Material UI, Emotion |
| Build and quality | Vite 6, ESLint 9, Prettier |
| AI | Anthropic SDK, Claude Haiku 4.5 |
| Authentication and data | Firebase Authentication, Cloud Firestore |
| Document processing | PDF.js, Mammoth, browser FileReader API |
| Interaction and content | Framer Motion, React Markdown, Remark GFM, Rehype Highlight |
| Hosting | Netlify |

## How it works

1. Firebase Authentication establishes the signed-in user's identity.
2. The application sends chat, note, or flashcard prompts to Claude.
3. Responses are rendered as Markdown or converted into structured flashcards.
4. Sessions, summaries, and decks are saved beneath that user's Firestore document.
5. The dashboard retrieves the saved resources in parallel for future study sessions.

## Firestore structure

```text
users/{uid}
├── sessions/{sessionId}
│   ├── messages[]
│   └── metadata
├── notes/{noteId}
│   ├── summary[]
│   └── metadata
└── flashcards/{deckId}
    ├── deck[]
    └── metadata
```

Application access should be protected with Firestore Security Rules that restrict each path to its authenticated owner.

## Getting started

### Prerequisites

- Node.js and npm
- A Firebase project with a registered web application
- An Anthropic API key

### Installation

```bash
git clone https://github.com/bryanwaine/AI-Study-Assistaant.git
cd AI-Study-Assistaant
npm install
```

Create a `.env` file in the project root:

```dotenv
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

In Firebase:

1. Enable **Email/Password** and **Google** in Authentication.
2. Create a Cloud Firestore database.
3. Add `localhost` and any deployed hostname to Authentication's authorised domains.
4. Apply owner-only Firestore Security Rules for the user-scoped collections shown above.

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Project structure

```text
src/
├── components/    # Reusable UI and interaction components
├── context/       # Authentication and toast providers
├── hooks/         # Authentication, toast, and animation hooks
├── pages/         # Public and protected route screens
├── routes/        # Private-route guard
├── utils/         # Firestore services, validation, sorting, and errors
├── anthropic.js   # AI prompts and Anthropic requests
├── firebase.js    # Firebase application configuration
└── App.jsx        # Route definitions and theme initialisation
```

## Deployment

The live application is deployed on Netlify. For another Netlify deployment:

- Use `npm run build` as the build command.
- Publish the `dist` directory.
- Configure every required environment variable in the Netlify project.
- Keep `public/_redirects` so client-side routes resolve to `index.html`.

## Security note

> Vite exposes variables prefixed with `VITE_` to client-side code. The current implementation calls Anthropic directly from the browser using `dangerouslyAllowBrowser`, so an Anthropic key included in a public build can be discovered by users. Before deploying your own public instance, route AI requests through a trusted backend or serverless function and keep the API key server-side.

Firebase web configuration values identify the Firebase project but are not a substitute for access control. Enforce authorisation through Authentication and properly scoped Firestore Security Rules.

## Current status and roadmap

The core chat, note-summary, and flashcard workflows are implemented. Quiz routes and screens are scaffolded but quiz generation is still in progress.

Planned improvements:

- Move Anthropic requests behind a server-side API.
- Complete quiz generation and persistence.
- Add automated unit, integration, and end-to-end tests.
- Add CI checks for linting, tests, and production builds.
- Add an example environment file and version-controlled Firestore rules.

## Author

Built by [Bryan Waine](https://github.com/bryanwaine).

Portfolio: [bryanwaine.vercel.app](https://bryanwaine.vercel.app/)
