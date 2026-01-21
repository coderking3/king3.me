import Typewriter from './Typewriter'

const TOPICS: string[] = ['#CoderLife', '#OpenSource', '#Photography']

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

const ICON_MAP = {
  github: '',
  youtube: '',
  instagram: '',
  bilibili: '',
  x: '',
  email: ''
}

function Hero() {
  return (
    <section className="font-mono">
      {/* Title */}
      <h1 className="text-primary mb-6 text-6xl font-medium tracking-tight">
        <span>Hi, I&apos;m </span>
        <SelectedText text="King3" />
      </h1>
      <div className="mb-10 flex h-16 items-center">
        <Typewriter text1={'<Developer/>'} text2="<Storyteller/>" />
      </div>
      {/* Tags */}
      <p className="text-brand/90 mb-6 w-fit text-2xl font-medium">
        {TOPICS.map((tag) => (
          <span key={tag}>{tag}&nbsp;</span>
        ))}
      </p>
      {/* Description */}
      <p className="text-primary max-w-3xl text-lg leading-relaxed">
        I’m a frontend developer passionate about open source and crafting my
        own projects. When not coding, I’m capturing moments 📷, traveling ✈️,
        or lost in music 🎵.
      </p>
      {/* Socials */}
      <div className="mt-5"></div>
    </section>
  )
}

export default Hero
