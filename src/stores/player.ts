import type { Song } from '@/types'

import { create } from 'zustand'

interface PlayerState {
  queue: Song[]
  currentIndex: number
  isVisible: boolean
  isPlaying: boolean

  setQueue: (songs: Song[]) => void
  /** Play a song by queue index. If already active, resumes playback. */
  play: (index: number) => void
  /** Toggle play/pause for the current track. No-op when player not visible. */
  togglePlay: () => void
  /** Called by the Player component to sync audio playback state. */
  setPlaying: (v: boolean) => void
  setCurrentIndex: (index: number) => void
  /** Close the player: hide it and stop playback. */
  close: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  queue: [],
  currentIndex: 0,
  isVisible: false,
  isPlaying: false,

  setQueue: (songs) => set({ queue: songs }),

  play: (index) =>
    set({ currentIndex: index, isVisible: true, isPlaying: true }),

  togglePlay: () =>
    set((s) => (s.isVisible ? { isPlaying: !s.isPlaying } : {})),

  setPlaying: (v) => set({ isPlaying: v }),

  setCurrentIndex: (index) => set({ currentIndex: index }),

  close: () => set({ isVisible: false, isPlaying: false })
}))
