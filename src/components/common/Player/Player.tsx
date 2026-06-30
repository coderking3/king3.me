'use client'

import type { Direction, PlayMode } from './PlayerFull'

import { useCallback, useEffect, useRef, useState } from 'react'

import { usePlayerStore } from '@/stores/player'

import { PlayerFull } from './PlayerFull'
import { PlayerMini } from './PlayerMini'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildShuffleOrder(len: number, currentIdx: number): number[] {
  const rest = Array.from({ length: len }, (_, i) => i).filter(
    (i) => i !== currentIdx
  )
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[rest[i], rest[j]] = [rest[j], rest[i]]
  }
  return [currentIdx, ...rest]
}

// ─── Player ───────────────────────────────────────────────────────────────────

export default function Player() {
  const {
    queue,
    currentIndex,
    isVisible,
    isPlaying,
    setPlaying,
    togglePlay,
    setCurrentIndex,
    close
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Always holds latest goNext to avoid stale closure in 'ended' listener
  const goNextRef = useRef<(auto?: boolean) => void>(() => {})

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [mode, setMode] = useState<PlayMode>('order')
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([])
  const [shufflePos, setShufflePos] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [slideDir, setSlideDir] = useState<Direction>(1)

  const currentSong = queue[currentIndex]

  // ── Audio — reinit on track change ────────────────────────────────────────

  useEffect(() => {
    if (!isVisible || !currentSong) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }

    const audio = new Audio(currentSong.url)
    audio.volume = muted ? 0 : volume
    audioRef.current = audio

    const onTime = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration)
    }
    const onDuration = () => setDuration(audio.duration || 0)
    const onEnded = () => goNextRef.current(true)
    // Failed to load (bad url, network error, etc.) — skip to the next
    // track instead of leaving the player stuck silently paused.
    const onError = () => {
      setPlaying(false)
      goNextRef.current(true)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('durationchange', onDuration)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
    setProgress(0)
    setDuration(0)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('durationchange', onDuration)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.pause()
    }
    // eslint-disable-next-line react/exhaustive-deps
  }, [currentIndex, isVisible])

  // ── Sync volume / mute ────────────────────────────────────────────────────

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  // ── Sync audio playback to store isPlaying (for external toggle calls) ──

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(() => setPlaying(false))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, setPlaying])

  // ── Playback controls ─────────────────────────────────────────────────────

  const handleSeek = (ratio: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = ratio * audioRef.current.duration
    setProgress(ratio)
  }

  const handleVolumeChange = (v: number) => {
    setVolume(v)
    if (v > 0) setMuted(false)
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  const goNext = useCallback(
    (auto = false) => {
      setSlideDir(auto ? 0 : 1)

      if (mode === 'repeat' && auto) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play()
          setProgress(0)
        }
        return
      }
      if (mode === 'shuffle') {
        const nextPos = (shufflePos + 1) % queue.length
        setShufflePos(nextPos)
        setCurrentIndex(shuffleOrder[nextPos])
      } else {
        setCurrentIndex((currentIndex + 1) % queue.length)
      }
    },
    [
      mode,
      shufflePos,
      shuffleOrder,
      currentIndex,
      queue.length,
      setCurrentIndex
    ]
  )

  const goPrev = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      setProgress(0)
      return
    }
    setSlideDir(-1)
    if (mode === 'shuffle') {
      const prevPos = Math.max(0, shufflePos - 1)
      setShufflePos(prevPos)
      setCurrentIndex(shuffleOrder[prevPos])
    } else {
      setCurrentIndex((currentIndex - 1 + queue.length) % queue.length)
    }
  }, [
    mode,
    shufflePos,
    shuffleOrder,
    currentIndex,
    queue.length,
    setCurrentIndex
  ])

  // Playlist click — fade in place, no directional slide. Also re-syncs
  // shufflePos so the next auto-advance continues from the picked track
  // instead of jumping based on the stale shuffle position.
  const selectTrack = useCallback(
    (idx: number) => {
      setSlideDir(0)
      setCurrentIndex(idx)
      if (mode === 'shuffle') {
        const pos = shuffleOrder.indexOf(idx)
        if (pos !== -1) setShufflePos(pos)
      }
      setShowPlaylist(false)
    },
    [mode, shuffleOrder, setCurrentIndex]
  )

  // Keep ref current so the 'ended' listener never captures a stale closure
  useEffect(() => {
    goNextRef.current = goNext
  }, [goNext])

  // ── Mode ──────────────────────────────────────────────────────────────────

  const cycleMode = () => {
    setMode((m) => {
      const next: PlayMode =
        m === 'order' ? 'shuffle' : m === 'shuffle' ? 'repeat' : 'order'
      if (next === 'shuffle') {
        setShuffleOrder(buildShuffleOrder(queue.length, currentIndex))
        setShufflePos(0)
      }
      return next
    })
  }

  // ── Close ─────────────────────────────────────────────────────────────────

  const handleClose = () => {
    audioRef.current?.pause()
    setPlaying(false)
    setProgress(0)
    close()
  }

  // ── Render guard ──────────────────────────────────────────────────────────

  if (!isVisible || !currentSong) return null

  // ── Assemble ──────────────────────────────────────────────────────────────

  const sharedProps = {
    currentSong,
    isPlaying,
    onPlayPause: togglePlay,
    onClose: handleClose
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 hidden md:block">
      {!expanded ? (
        <PlayerMini {...sharedProps} onExpand={() => setExpanded(true)} />
      ) : (
        <PlayerFull
          {...sharedProps}
          queue={queue}
          currentIndex={currentIndex}
          progress={progress}
          duration={duration}
          volume={volume}
          muted={muted}
          mode={mode}
          slideDir={slideDir}
          showPlaylist={showPlaylist}
          onMinimize={() => setExpanded(false)}
          onPrev={goPrev}
          onNext={() => goNext()}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={() => setMuted((m) => !m)}
          onCycleMode={cycleMode}
          onTogglePlaylist={() => setShowPlaylist((v) => !v)}
          onSelectTrack={selectTrack}
        />
      )}
    </div>
  )
}
