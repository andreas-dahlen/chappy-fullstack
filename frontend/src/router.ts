import type { RouteObject } from 'react-router'

import App from './App.tsx'
import Home from './pages/Home.tsx'
import SignIn from './pages/SignIn.tsx'
import Conversation from './pages/Conversation.tsx'
import Channel from './pages/Channel.tsx'
import Register from './pages/Register.tsx'

const routerConfig: RouteObject[] = [
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'sign-in',
        Component: SignIn
      },
      {
        path: 'register',
        Component: Register
      },
      {
        path: 'conversations/:conversationId',
        Component: Conversation
      },
      {
        path: 'channels/:channelId',
        Component: Channel
      }
    ]
  }
]

export { routerConfig }
