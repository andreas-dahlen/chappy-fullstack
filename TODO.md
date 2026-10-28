

| Behörighet                                       | Gäst |               Inloggad användare              |
| ------------------------------------------------ | :--: | :-------------------------------------------: |
| Se alla användare och kanaler                    |  ✔️  |                       ✔️                      |
| Skapa ny kanal (VG)                              |   ❌  |                       ✔️                      |
| Ta bort kanal (VG)                               |   ❌  |         ✔️ Bara den som skapat kanalen        |
| Öppna kanaler: läsa och skicka meddelanden       |  ✔️  |                       ✔️                      |
| Låsta kanaler: läsa och skicka meddelanden       |   ❌  |                       ✔️                      |
| Skicka DM (meddelande till specifik användare)   |   ❌  |                       ✔️                      |
| Registrera ny användare                          |  ✔️  | ❌ (inloggad behöver inte registrera sig igen) |
| Ta bort användare (VG)                           |   ❌  |       ✔️ Man kan bara ta bort sig själv       |
| AI används för att tillföra värde för användaren |  ✔️  |                       ✔️                      |


## npm packages 
* root: typescript v.6
* backend: typescript v.7,express, aws, dynamodb, jws, Node, bcrypt, gemini API
* frontend: (vite), typescript v.7, react, react-router, zustand, immer, zustand-persist??, 
* shared: zod

socket.io !?!? > giphy developers

## write to users


## write to groups / channels 
* all locked channels are available to logged in people only

## AI summary of channel information


## login

## published

##

spit balling:

need a list of channels. something like this.. 
```js
type Channel = {
  channelId: UUID
  name: string
  authRequired: boolean
  createdBy: UUID
  createdAt: string
}
```

need a user list. something like this.. 
```js
type user = {
  name: string
}

type userWithId = { // non frontend facing type
  userId: UUID
  name: string
  // email: string
}

type login: = {
  userName: string
  password: string
}
```

```js
type Message = {
  messageId: UUID
  conversationId: UUID
  senderId: UUID
  content: string
  createdAt: string
}

backend/src/
├── routes/
│   ├── auth.routes.ts
│   ├── channel.routes.ts
│   └── message.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── channel.service.ts
│   └── message.service.ts
├── repositories/
│   ├── user.repository.ts
│   ├── channel.repository.ts
│   └── message.repository.ts
└── socket/
    └── socket.ts              # Add later


``` 

database:

| pk                  | sk                 | name      | ownerId   | participants | message | messageId | timestamp  | authRequired | hashPassword |
|---------------------|--------------------|-----------|-----------|--------------|---------|-----------|------------|--------------|--------------|
| USER                | USER#username      | Karlsson  | user UUID | x            | x       | x         | x          | x            | ****         |
| USER                | USER#username      | Anna      | user UUID | x            | x       | x         | x          | x            | ****         |
| CHANNEL             | CHANNEL#123        | spaceship | user UUID | x            | x       | x         | timestamp  | boolean      | x            |
| CHANNEL             | CHANNEL#789        | anotherone| user UUID | x            | x       | x         | timestamp  | boolean      | x            |
| CHANNEL#123         | MSG#timestamp#abc  | x         | user UUID | x            | string  | abc       | timestamp  | x            | x            |
| CHANNEL#123         | MSG#timestamp#def  | x         | user UUID | x            | string  | def       | timestamp  | x            | x            |
| CHANNEL#789         | MSG#timestamp#ghi  | x         | user UUID | x            | string  | ghi       | timestamp  | x            | x            |
| USER#123            | CONVERSATION#123   | x         | x         | x            | x       | x         | x          | x            | x            |
| USER#789            | CONVERSATION#123   | x         | x         | x            | x       | x         | x          | x            | x            |
| CONVERSATION#123    | META               | x         | x         | [UUID, UUID] | x       | x         | timestamp  | x            | x            |
| CONVERSATION#123    | MSG#timestamp#abc  | x         | user UUID | x            | string  | abc       | timestamp  | x            | x            |
| CONVERSATION#123    | MSG#timestamp#def  | x         | user UUID | x            | string  | def       | timestamp  | x            | x            |

questions: who can create a public channel - a user becomes an owner....  can one simply English yes!


GET /api/users (NO AUTH REQUIRED)
no body needed, returns a list of all users. 
sends:
```js
type User = {
  name: string
  userId: UUID
}[]
```

POST /api/login (NO AUTH REQUIRED)
BODY:
```js
type Login = {
  username: string
  password: string
}
```
sends:
```js
type UserAuthed = User & {
  token: string
}
```
POST /api/register (NO AUTH REQUIRED)
BODY:
```js
type Registration = Login & {
  name: string
}
```
sends:
```js
type UserAuthed = User & {
  token: string
}
```

//DELETE USER!?!?!??!?!

DELETE /api/users/me (AUTH REQUIRED) no body... and statuscode...



GET /api/channels (NO AUTH REQUIRED)
sends:
```js
type channel = {
  channelId: UUID
  channelName: string
  authRequired: boolean
  createdBy: UUID
  createdAt: string //channel creation timestamp
}[]
```

GET /api/channels/:channelId/messages (BOTH AUTH AND NO AUTH) //returns a list of messages in the channel

 //bearer token in header for auth, obviously error code if not Authed when auth is required...

sends:
```js
type messageData = {
    messageId: UUID
    senderId: UUID
    message: string
    createdAt: string
  }[] //obviously error code if not Authed...
```


POST /api/channels/ (AUTH REQUIRED) creates a new channel
BODY:
```js
type channel = {
  userId: UUID 
  channelName: string
  authRequired: boolean
} //bearer token in header for auth, obviously error code if not Authed...
```
returns ok? potential timestamp maybe...


POST /api/channels/:channelId/messages (BOTH AUTH AND NO AUTH) posts a message to a channel
BODY:
```js
type channel = {
  userId: UUID //wont exist if not authed...
  message: string
} //bearer token in header for auth, obviously error code if not Authed when auth is required...
```
sends:
ok?
<!-- ```js
type messageData = {
    messageId: UUID
    senderId: UUID
    message: string
    createdAt: string //frontend or backend sends this? i am thinking backend API creates this...
  }[] //obviously error code if not Authed... -->
  

//DELETE CHANNEL!?!?!??! if you're owner and authed....


** all conversions are private between two users and requires authentication... no quests can write or read conversations.

GET /api/conversations/:userId
sends:
```js
type conversation = {
  conversationId: UUID
  participants: UUID[]
}[]
```

POST /api/conversations //find or create a conversation (needs some infromation...)

get /api/conversations/:conversationId
sends:
```js
 type message = {
    messageId: UUID
    senderId: UUID
    message: string
    createdAt: string
  }[]
```

POST /api/conversations/:conversationId
BODY:
```js 
type conversation = {
  userId: UUID //should we check the metadata that this userId has access to this conversation? yes, probably obviously...
  message: string
} //bearer token in header for auth, obviously error code if not Authed...
```


//can't delete conversation!? lolz...?



┌─────────────────────────────────┬───────────────────────────────────────────────────┐
│ 💬 PM 👥 GROUP ⚙️ SET ✨ AI   │                                                   │
│---------------------------------│                  main display                     │
│         pm or group view        │                                                   │
│                                 │                                                   │
│                                 │                                                   │
│                                 │                                                   │
└─────────────────────────────────┴───────────────────────────────────────────────────┘