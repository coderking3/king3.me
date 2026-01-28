'use client'

import type { TimeoutHandle } from '@/types'

import { useEffect, useState } from 'react'

interface TypewriterProps {
  text1: string
  text2: string
  speed?: number
}

function Typewriter(props: TypewriterProps) {
  const { text1, text2, speed = 100 } = props

  const [displayText, setDisplayText] = useState(text1)
  const [currentIndex, setCurrentIndex] = useState(text1.length)
  const [typeStatus, setTypeStatus] = useState('typing') // To track typing vs deleting
  const [isText1, setIsText1] = useState(true) // Display text1 vs text2
  const [showCursor, setShowCursor] = useState(true) // For blinking cursor

  useEffect(() => {
    let timeDeleting: TimeoutHandle, timeTyping: TimeoutHandle
    const timeout = setTimeout(() => {
      if (
        typeStatus === 'typing' &&
        currentIndex < (isText1 ? text1.length : text2.length)
      ) {
        // Typing forward
        setDisplayText(
          (prev) => prev + (isText1 ? text1[currentIndex] : text2[currentIndex])
        )
        setCurrentIndex((prev) => prev + 1)
      } else if (typeStatus === 'deleting' && currentIndex > 0) {
        // Deleting backward
        setDisplayText((prev) => prev.slice(0, -1))
        setCurrentIndex((prev) => prev - 1)
      } else if (
        typeStatus === 'typing' &&
        currentIndex === (isText1 ? text1.length : text2.length)
      ) {
        // Switch to deleting mode
        // setTypeStatus("waiting");
        timeDeleting = setTimeout(() => {
          setTypeStatus('deleting')
        }, 2000) // Pause before deleting
      } else if (typeStatus === 'deleting' && currentIndex === 0) {
        // Switch to typing mode
        // setTypeStatus("waiting");
        timeTyping = setTimeout(() => {
          setIsText1((isText1) => !isText1)
          setTypeStatus('typing')
        }, 500)
      }
    }, speed)

    return () => {
      clearTimeout(timeout) // Cleanup timeout
      clearTimeout(timeDeleting) // Cleanup timeout
      clearTimeout(timeTyping) // Cleanup timeout
    }
  }, [currentIndex, typeStatus, text1, text2, speed, isText1])

  // Cursor blinking effect
  useEffect(() => {
    // if (typeStatus !== "waiting") return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [typeStatus])

  return (
    <p className="text-5xl">
      <span className="text-primary font-medium">{displayText}</span>

      <span className={`${showCursor ? 'text-muted-foreground' : 'hidden'}`}>
        |
      </span>
    </p>
  )
}

export default Typewriter
