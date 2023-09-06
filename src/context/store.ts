import { create } from 'zustand'

const useStore = create((set) => ({
conversations:[],
setConversations: (newConversation:any) => set({ conversations: newConversation }),
currentConversation:null,
setCurrentConversation:(conversation:any) => set({currentConversation: conversation}),
messages:[],
setMessages: (newMessages:any) => set({ messages: newMessages })

}))

export default useStore