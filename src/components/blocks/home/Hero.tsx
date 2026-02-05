import Animated from '@/components/Animated'
import { BiliBili, Email, GithubCircle, X, Youtube } from '@/icons'

import Typewriter from './Typewriter'

const TOPICS: string[] = ['#CoderLife', '#OpenSource', '#Photography']

const SOCIALS = [
  {
    icon: GithubCircle,
    href: 'https://www.github.com/coderking3'
  },
  {
    icon: Youtube,
    href: 'https://www.youtube.com/@KingCoder-mp1hd'
  },
  {
    icon: BiliBili,
    href: 'https://space.bilibili.com/627872080'
  },
  {
    icon: X,
    href: 'https://x.com/coderking_3'
  },
  {
    icon: Email,
    href: 'mailto:king3.em@gmail.com'
  }
]

function SelectedText({ text }: { text: string }) {
  return (
    <span className="group relative bg-black/5 p-1 dark:bg-white/5">
      <span className="border-brand/90 dark:border-brand/90 pointer-events-none absolute inset-0 border opacity-70 group-hover:border-dashed group-hover:opacity-100">
        <span className="border-brand absolute -top-[3.5px] -left-[3.5px] size-1.5 border bg-zinc-50" />
        <span className="border-brand absolute -right-[3.5px] -bottom-[3.5px] size-1.5 border bg-zinc-50" />
        <span className="border-brand absolute -bottom-[3.5px] -left-[3.5px] size-1.5 border bg-zinc-50" />
        <span className="border-brand absolute -top-[3.5px] -right-[3.5px] size-1.5 border bg-zinc-50" />
      </span>
      {text}
    </span>
  )
}

function Hero() {
  return (
    <>
      {/* Title */}
      <Animated
        as="h1"
        preset="fadeIn"
        className="text-primary mb-6 font-mono text-6xl font-medium tracking-tight"
      >
        <span>Hi, I&apos;m </span>
        <SelectedText text="King3" />
      </Animated>

      {/* Typewriter */}
      <Animated
        as="div"
        preset="fadeIn"
        delay={0.1}
        className="mb-7.5 flex h-16 min-h-16 items-center font-mono"
      >
        <Typewriter text1={'<Developer/>'} text2="<Storyteller/>" />
      </Animated>

      {/* Tags */}
      <Animated
        as="p"
        preset="fadeIn"
        delay={0.2}
        className="text-brand/90 mb-5.5 w-full text-2xl font-medium tracking-wide"
      >
        {TOPICS.map((tag, index) => (
          <Animated
            as="span"
            key={tag}
            className="mr-3 inline-block"
            animation={{
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: {
                duration: 0.4,
                delay: 0.3 + index * 0.06,
                ease: [0.22, 1, 0.36, 1]
              }
            }}
          >
            {tag}
          </Animated>
        ))}
      </Animated>

      {/* Description */}
      <Animated
        as="p"
        preset="fadeIn"
        delay={0.35}
        className="text-primary/90 max-w-3xl text-lg leading-relaxed"
      >
        I'm a frontend developer passionate about open source and crafting my
        own projects. When not coding, I'm capturing moments 📷, traveling ✈️,
        or lost in music 🎵.
      </Animated>

      {/* Socials */}
      <Animated
        className="mt-4.5 flex gap-4"
        animation={{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5, delay: 0.45 }
        }}
      >
        {SOCIALS.map(({ icon: Icon, href }, index) => (
          <Animated
            key={href}
            animation={{
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: {
                duration: 0.35,
                delay: 0.5 + index * 0.05,
                ease: [0.34, 1.56, 0.64, 1]
              }
            }}
          >
            <Icon
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/80 hover:text-foreground"
            />
          </Animated>
        ))}
      </Animated>
    </>
  )
}

export default Hero
