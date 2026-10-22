

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
type channel = {
  id: UUID
  name: string
  authRequired: boolean
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

```dynamodb
|     pk           |         sk          |     name     |  owner    | authRequired  | message     | timestamp   |    participants     | hashPassword | användarnamn
|------------------|---------------------|--------------|-----------|---------------|-------------|-------------|---------------------|
|       USER	     |    USER#123         |   Karlsson   |    x      |       x       |      x      |    x        |          x          |     ****     |    dfgdfg
|       USER	     |    USER#789	       |     Anna	  	|    x      |       x       |      x      |    x        |          x          |     ****      |     dfgdfgfdgf
|------------------|---------------------|--------------|-----------|---------------|-------------|-------------|---------------------|
|     CHANNEL   	 |  CHANNEL#123	       |  spaceship	  | USER#123  |    boolean    |      x      |    x        |          x          |
|     CHANNEL 	   |  CHANNEL#789	       |  anotherone	| USER#789  |    boolean    |      x      |    x        |          x          |
|------------------|---------------------|--------------|-----------|---------------|-------------|-------------|---------------------|
|  CHANNEL#123     | MSG#timestamp#..abc |      x       | USER#789  |       x       |  <string>   | <timestamp> |          x          |
|  CHANNEL#123     | MSG#timestamp#..def |	    x       | USER#789  |       x       |  <string>   | <timestamp> |          x          |
|  CHANNEL#789     | MSG#timestamp#..ghi |	    x       | USER#123  |       x       |  <string>   | <timestamp> |          x          |
|------------------|---------------------|--------------|-----------|---------------|-------------|-------------|---------------------|
|     USER#123	   |  CONVERSATION#123   |      x       |    x      |       x       |      x      |    x        |          x          |
|     USER#789	   |  CONVERSATION#123   |      x  	  	|    x      |       x       |      x      |    x        |          x          |
|------------------|---------------------|--------------|-----------|---------------|-------------|-------------|---------------------|
| CONVERSATION#123 |    META             |      x       |    x      |       x       |     x       |      x      |[USER#123, USER#789] |
| CONVERSATION#123 |    MSG#...          |      x       | USER#123  |       x       |  <string>   | <timestamp> |          x          |
| CONVERSATION#123 |    MSG#...          |      x       | USER#123  |       x       |  <string>   | <timestamp> |          x          |
 
```


questions: who can create a public channel - a user becomes an owner....  can one simply English yes!