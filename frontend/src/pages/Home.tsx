import { useCredentialStore } from '../stores/credentialStore.ts'
import '../styles/pages/home.css'

export default function Home() {
  const userName = useCredentialStore(s => s.name)

  return (
    <main className="home">
      <section className="home-welcome">
        <h1>
          {userName ? `Welcome back, ${userName}!` : 'Welcome to Chappy!'}
        </h1>
        <p>Your space for conversations, channels and AI-powered chats.</p>
      </section>
    </main>
  )
}