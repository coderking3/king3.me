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
    <section className="font-mono">
      {/* Title */}
      <h1 className="text-primary mb-6 text-6xl font-medium tracking-tight">
        <span>Hi, I&apos;m </span>
        <SelectedText text="King3" />
      </h1>
      <div className="mb-8 flex h-16 items-center">
        <Typewriter text1={'<Developer/>'} text2="<Storyteller/>" />
      </div>
      {/* Tags */}
      <p className="text-brand/90 mb-8 w-fit text-2xl font-medium">
        {TOPICS.map((tag) => (
          <span key={tag}>{tag}&nbsp;</span>
        ))}
      </p>
      {/* Description */}
      <p className="text-primary/90 max-w-3xl text-lg leading-relaxed">
        I’m a frontend developer passionate about open source and crafting my
        own projects. When not coding, I’m capturing moments 📷, traveling ✈️,
        or lost in music 🎵.
      </p>
      {/* Socials */}
      <div className="mt-5 flex gap-4">
        {SOCIALS.map(({ icon: Icon, href }) => (
          <Icon
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-foreground"
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
