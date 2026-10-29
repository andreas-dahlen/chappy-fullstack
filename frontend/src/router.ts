import type { RouteObject } from 'react-router'

import App from './App.tsx'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Conversation from './pages/Conversation.tsx'
import Channel from './pages/Channel.tsx'

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
        path: 'login',
        Component: Login
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
