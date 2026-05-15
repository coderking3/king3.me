import { create } from 'zustand'

interface AuthStore {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false })
}))
