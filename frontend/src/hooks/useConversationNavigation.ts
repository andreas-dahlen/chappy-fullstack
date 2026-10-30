// export function useConversationNavigation() {
//   const navigate = useNavigate()
//   const token = useCredentialStore(s => s.token)

//   const getOrCreateConversation =
//     useConversationsStore(s => s.getOrCreateConversation)

//   const openConversation = async (userId: string) => {
//     if (!token) {
//       void navigate('/sign-in', {
//         state: {
//           reason: 'start-conversation',
//           userId
//         }
//       })
//       return false
//     }

//     const result = await getOrCreateConversation(userId)

//     if (result.state === 'failed') {
//       return false
//     }

//     void navigate(`/conversations/${result.conversationId}`)

//     return true
//   }

//   return openConversation
// }