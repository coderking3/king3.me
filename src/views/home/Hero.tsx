import { Animated } from '@/components'
import { AUTHOR_INFO, SOCIAL_URLS } from '@/constants'
import { getT } from '@/i18n/server'
import { BiliBili, Email, GithubCircle, X, Youtube } from '@/icons'

import Typewriter from './Typewriter'

const TOPICS: string[] = ['#CoderLife', '#OpenSource', '#Photography']

const SOCIALS = [
  { icon: GithubCircle, href: SOCIAL_URLS.github },
  { icon: Youtube, href: SOCIAL_URLS.youtube },
  { icon: BiliBili, href: SOCIAL_URLS.bilibili },
  { icon: X, href: SOCIAL_URLS.x },
  { icon: Email, href: `mailto:${AUTHOR_INFO.email}` }
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

async function Hero() {
  const { t } = await getT('home')

  return (
    <>
      {/* Title */}
      <Animated
        as="h1"
        preset="fadeInUp"
        className="text-primary mb-6 font-mono text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl"
      >
        <span>{t('hero.greeting')} </span>
        <SelectedText text="King3" />
      </Animated>

      {/* Typewriter */}
      <Animated
        as="div"
        preset={{ mode: 'fadeInUp', delay: 0.06 }}
        className="mb-7.5 flex h-16 min-h-16 items-center font-mono"
      >
        <Typewriter
          text1={t('hero.developer')}
          text2={t('hero.storyteller')}
          shortText1={t('hero.devShort')}
          shortText2={t('hero.storytellerShort')}
        />
      </Animated>

      {/* Tags */}
      <Animated
        as="p"
        preset={{ mode: 'fadeInUp', delay: 0.1 }}
        className="text-brand/90 mb-5.5 w-full text-xl font-medium tracking-wide sm:text-2xl"
      >
        {TOPICS.map((tag, index) => (
          <Animated
            as="span"
            key={tag}
            className="mr-3 inline-block"
            animation={{
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: {
                duration: 0.3,
                delay: 0.14 + index * 0.035,
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
        preset={{ mode: 'fadeInUp', delay: 0.18 }}
        className="text-primary/90 max-w-3xl text-lg leading-relaxed"
      >
        {t('hero.description')}
        <br /> {t('hero.descriptionLine2')}
        {/* I'm a frontend developer passionate about open source and crafting my
        own projects.
        <br /> When not coding, I'm capturing moments 📷, traveling ✈️, or lost
        in music 🎵. */}
      </Animated>

      {/* Socials */}
      <Animated
        className="mt-4.5 flex gap-4"
        animation={{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.35, delay: 0.22 }
        }}
      >
        {SOCIALS.map(({ icon: Icon, href }, index) => (
          <Animated
            key={href}
            animation={{
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: {
                duration: 0.25,
                delay: 0.25 + index * 0.03,
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
