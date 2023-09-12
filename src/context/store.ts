import { create } from 'zustand'

const useStore = create((set) => ({

// Guarda la lista de conversaciones para mostrar en el sidebar
conversations:[],
setConversations: (newConversation:any) => set({ conversations: newConversation }),

// Guarda la conversacion actual para mostrar info en el header del chat.
currentConversation:null,
setCurrentConversation:(conversation:any) => set({currentConversation: conversation}),

// Guarda los mensajes de la conversacion seleccionada para mostrar en el chat.
messages:[],
setMessages: (newMessages:any) => set({ messages: newMessages }),

// DarkMode
isDarkMode:false,
setIsDarkMode: () => set((state:any) => ({ isDarkMode: !state.isDarkMode })),

// Info del usuario actual logeado, info traida desde firestore, para que se muestre info que el usuario modifica del perfil
currentUser:null,
setCurrentUser: (newUser:any) => set({currentUser: newUser}),

// Todos los usuarios registrados sin en logeado.
allUsers:null,
setAllUsers: (newUsers:any) => set({ allUsers: newUsers }),

}))

export default useStore