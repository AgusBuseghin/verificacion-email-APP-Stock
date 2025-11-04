import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(persist(
  (set) => ({
    user: {
      id: null, 
      email: null,
      full_name: null,
      token: null
    },
    
    setUser: (newuser) => set({ user: newuser })
  }), 
  {
    name: "token_login_web"
  }
))