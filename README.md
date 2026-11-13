# Chappy

Chappy is a fullstack chat application developed as part of the Fullstack course at Handelsakademin (FED25).

The application allows users to communicate through public channels, private channels and direct messages. It also includes AI-powered conversation summaries.

**Live application:** chappy-ynvl.onrender.com

## Features

- Browse users and channels without an account.
- Register and log in.
- Send and receive messages in public channels.
- Access private channels as an authenticated user.
- Create and delete channels.
- Send direct messages between users.
- Delete your own account.
- Generate AI-powered summaries of channel conversations.
- Receive real-time message updates.

## Technologies

### Frontend
- React
- TypeScript
- React Router
- Zustand
- Immer
- CSS
- Vite

### Backend
- Node.js
- Express
- TypeScript
- REST API
- JSON Web Tokens (JWT)
- bcrypt
- Socket.IO

### Database and integrations
- AWS DynamoDB
- Zod
- Google Gemini API

### Development
- npm workspaces
- Monorepo architecture
- oxlint

## Project structure

The project is organized as an npm workspaces monorepo.

- `backend/` – Express API and backend functionality.
- `frontend/` – React application.
- `shared/` – Shared types and validation schemas.

## Installation

Clone the repository:

```bash
git clone https://github.com/andreas-dahlen/chappy-fullstack.git
cd chappy-fullstack
```

Install dependencies:

```bash
npm install
```

Build the workspaces:

```bash
npm run build
```

## Running locally

Local development requires a `.env` file in the project root. This file is not included in the repository.

Start the frontend development server:

```bash
npm run dev
```

Start the backend in a separate terminal:

```bash
npm run restart-server
```

## Available scripts

| Command | Description |
|---|---|
| `npm run build` | Builds the shared, backend and frontend workspaces. |
| `npm run restart-server` | Restarts the backend server. |
| `npm run start` | Starts the backend server. |
| `npm run dev` | Starts the frontend development server. |
| `npm run seed` | Seeds the database with initial data. |
| `npm run lint` | Runs oxlint. |
| `npm run type` | Runs type checking across workspaces. |

## Database structure

Chappy uses AWS DynamoDB with a single-table design. The `pk` and `sk` attributes identify the different entity types and their relationships.

### Users

| Partition key (`pk`) | Sort key (`sk`) | Attributes |
|---|---|---|
| `USER` | `USER#username` | `name`, `ownerId`, `hashPassword` |

User records contain account information, including the hashed password.

### Channels

| Partition key (`pk`) | Sort key (`sk`) | Attributes |
|---|---|---|
| `CHANNEL` | `CHANNEL#123` | `name`, `ownerId`, `timestamp`, `authRequired` |

Channel records contain the channel name, its owner, creation timestamp and access requirements.

### Channel messages

| Partition key (`pk`) | Sort key (`sk`) | Attributes |
|---|---|---|
| `CHANNEL#123` | `MSG#timestamp#abc` | `ownerId`, `message`, `messageId`, `timestamp` |

Messages belonging to a channel share its partition key. The sort key contains the message timestamp and message ID.

### Conversations

Conversation metadata uses a deterministic UUID v5 generated from the two participants.

| Partition key (`pk`) | Sort key (`sk`) | Attributes |
|---|---|---|
| `CONVERSATION` | `META#UUIDv5` | `participants` |

Conversation messages are stored separately under the conversation ID.

| Partition key (`pk`) | Sort key (`sk`) | Attributes |
|---|---|---|
| `CONVERSATION#UUIDv5` | `MSG#timestamp#abc` | `ownerId`, `message`, `messageId`, `timestamp` |

### AI conversations

AI conversation metadata and messages are associated with the user and AI participant.

| Partition key (`pk`) | Sort key (`sk`) | Attributes |
|---|---|---|
| `USER#userId` | `META#aiId` | `name`, `timestamp` |
| `USER#aiId` | `AI#timestamp#abc` | `message`, `messageId`, `timestamp`, `role` |

AI messages include a `role` attribute to distinguish AI messages from other message types.

## Testing

The application can be tested through the deployed version or by running it locally.

Users can register an account to test authenticated functionality, including private channels and direct messaging.

Public channels can also be browsed without registering.

## Deployment

The application is deployed on Render.

**Live application:** chappy-ynvl.onrender.com