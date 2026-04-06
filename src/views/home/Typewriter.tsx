'use client'

import type { TimeoutHandle } from '@/types'

import { useEffect, useState } from 'react'

import { useIsMobile } from '@/hooks'

interface TypewriterProps {
  text1: string
  text2: string
  shortText1?: string
  shortText2?: string
  speed?: number
}

function TypewriterInner({
  text1,
  text2,
  speed = 100
}: {
  text1: string
  text2: string
  speed: number
}) {
  const [displayText, setDisplayText] = useState(text1)
  const [currentIndex, setCurrentIndex] = useState(text1.length)
  const [typeStatus, setTypeStatus] = useState('typing')
  const [isText1, setIsText1] = useState(true)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let timeDeleting: TimeoutHandle, timeTyping: TimeoutHandle
    const timeout = setTimeout(() => {
      if (
        typeStatus === 'typing' &&
        currentIndex < (isText1 ? text1.length : text2.length)
      ) {
        setDisplayText(
          (prev) => prev + (isText1 ? text1[currentIndex] : text2[currentIndex])
        )
        setCurrentIndex((prev) => prev + 1)
      } else if (typeStatus === 'deleting' && currentIndex > 0) {
        setDisplayText((prev) => prev.slice(0, -1))
        setCurrentIndex((prev) => prev - 1)
      } else if (
        typeStatus === 'typing' &&
        currentIndex === (isText1 ? text1.length : text2.length)
      ) {
        timeDeleting = setTimeout(() => {
          setTypeStatus('deleting')
        }, 2000)
      } else if (typeStatus === 'deleting' && currentIndex === 0) {
        timeTyping = setTimeout(() => {
          setIsText1((isText1) => !isText1)
          setTypeStatus('typing')
        }, 500)
      }
    }, speed)

    return () => {
      clearTimeout(timeout)
      clearTimeout(timeDeleting)
      clearTimeout(timeTyping)
    }
  }, [currentIndex, typeStatus, text1, text2, speed, isText1])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [typeStatus])

  return (
    <p className="text-3xl md:text-5xl">
      <span className="text-primary font-medium">{displayText}</span>

      <span className={`${showCursor ? 'text-muted-foreground' : 'hidden'}`}>
        |
      </span>
    </p>
  )
}

function Typewriter(props: TypewriterProps) {
  const { text1, text2, shortText1, shortText2, speed = 100 } = props
  const isMobile = useIsMobile()

  const activeText1 = isMobile ? (shortText1 ?? text1) : text1
  const activeText2 = isMobile ? (shortText2 ?? text2) : text2

  // Remount on breakpoint change to reset animation state
  return (
    <TypewriterInner
      key={isMobile ? 'sm' : 'md'}
      text1={activeText1}
      text2={activeText2}
      speed={speed}
    />
  )
}

export default Typewriter
