/* eslint-disable no-console */

import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

/* --- Types --- */

interface AnimationDuration {
  forwardDuration: number
  pauseDuration: number
  backwardDuration: number
  gapDuration: number
}

interface AnimationKeyframes {
  start: number
  forwardEnd: number
  pauseEnd: number
  backwardEnd: number
  end: number
  totalDuration: number
}

interface AnimationStates {
  initial: string
  complete: string
}

interface AnimationElement {
  className: string
  animationName: string
  states: AnimationStates
}

/* --- Constants --- */

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const outputFilePath = resolve(__dirname, 'animation.module.css')

const {
  values: { output: isOutput }
} = parseArgs({
  options: {
    output: {
      type: 'boolean',
      short: 'o',
      default: false
    }
  }
})

// Cycle: forward → pause → backward → gap
const ANIMATION_DURATION: AnimationDuration = {
  forwardDuration: 1.2,
  pauseDuration: 3,
  backwardDuration: 1.2,
  gapDuration: 0.05
} as const

const ANIMATION_ELEMENTS: AnimationElement[] = [
  {
    className: 'arrow-up',
    animationName: 'draw-arrow-up',
    states: {
      initial: 'clip-path: inset(0 100% 0 0);',
      complete: 'clip-path: inset(0 0 0 0);'
    }
  },
  {
    className: 'arrow-down',
    animationName: 'draw-arrow-down',
    states: {
      initial: 'clip-path: inset(0 0 0 100%);',
      complete: 'clip-path: inset(0 0 0 0);'
    }
  },
  {
    className: 'divider-line',
    animationName: 'draw-divider-line',
    states: {
      initial: 'clip-path: inset(0 50% 0 50%);',
      complete: 'clip-path: inset(0 0 0 0);'
    }
  }
]

/* --- Helpers --- */

function roundToDecimal(value: number, decimalPlaces: number): number {
  const multiplier = 10 ** decimalPlaces
  return Math.round(value * multiplier) / multiplier
}

/** Calculate keyframe percentages on the timeline */
function calculateAnimationKeyframes(
  duration: AnimationDuration
): AnimationKeyframes {
  const { forwardDuration, pauseDuration, backwardDuration, gapDuration } =
    duration

  const totalDuration =
    forwardDuration + pauseDuration + backwardDuration + gapDuration

  const forwardEndTime = forwardDuration
  const pauseEndTime = forwardEndTime + pauseDuration
  const backwardEndTime = pauseEndTime + backwardDuration

  return {
    start: 0,
    forwardEnd: roundToDecimal((forwardEndTime / totalDuration) * 100, 2),
    pauseEnd: roundToDecimal((pauseEndTime / totalDuration) * 100, 2),
    backwardEnd: roundToDecimal((backwardEndTime / totalDuration) * 100, 2),
    end: 100,
    totalDuration: roundToDecimal(totalDuration, 2)
  }
}

/* --- CSS generators --- */

function generateKeyframesCSS(
  animationName: string,
  keyframes: AnimationKeyframes,
  states: AnimationStates
): string {
  return `@keyframes ${animationName} {
  ${keyframes.start}% {
    ${states.initial}
  }

  ${keyframes.forwardEnd}% {
    ${states.complete}
  }

  ${keyframes.pauseEnd}% {
    ${states.complete}
  }

  ${keyframes.backwardEnd}% {
    ${states.initial}
  }

  ${keyframes.end}% {
    ${states.initial}
  }
}`
}

function generateAnimationCSS(
  keyframes: AnimationKeyframes,
  elements: AnimationElement[],
  timingFunction: string = 'ease-out'
): string {
  const keyframesCSS = elements
    .map((el) => generateKeyframesCSS(el.animationName, keyframes, el.states))
    .join('\n\n')

  const classCSS = elements
    .map(
      (el) => `.${el.className} {
  ${el.states.initial}
  animation: ${el.animationName} ${keyframes.totalDuration}s ${timingFunction} infinite;
}`
    )
    .join('\n\n')

  return `${keyframesCSS}\n\n${classCSS}`
}

/* --- Entry --- */

function generateStyleModuleCSS() {
  const animationKeyframes = calculateAnimationKeyframes(ANIMATION_DURATION)

  console.log('========== Keyframe Info ==========')
  console.log('Keyframe percentages:', animationKeyframes)
  console.log(`Total duration: ${animationKeyframes.totalDuration}s`)

  const completeCSS = generateAnimationCSS(
    animationKeyframes,
    ANIMATION_ELEMENTS
  )

  console.log('\n========== Generated CSS ==========')
  console.log(completeCSS)

  if (isOutput) {
    try {
      writeFileSync(outputFilePath, completeCSS, 'utf-8')
      console.log('\n========== Write Success ==========')
      console.log(`CSS file generated: ${outputFilePath}`)
    } catch (error) {
      console.error('\n========== Write Failed ==========')
      console.error('Error:', error)
      process.exit(1)
    }
  } else {
    console.log('\nTip: Use --output or -o to write CSS to a file')
  }
}

generateStyleModuleCSS()
