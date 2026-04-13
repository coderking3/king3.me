'use client'

import Link from 'next/link'

import { Animated } from '@/components'
import { AUTHOR_INFO, SOCIAL_URLS } from '@/constants'
import {
  BiliBiliIcon,
  GithubIcon,
  SinaWeiboIcon,
  XIcon,
  YoutubeIcon,
  ZhihuIcon
} from '@/icons'

const SOCIAL_LINKS = [
  { label: 'GitHub', icon: <GithubIcon size={18} />, href: SOCIAL_URLS.github },
  {
    label: 'Youtube',
    icon: <YoutubeIcon size={18} />,
    href: SOCIAL_URLS.youtube
  },
  {
    label: '哔哩哔哩',
    icon: <BiliBiliIcon size={18} />,
    href: SOCIAL_URLS.bilibili
  },
  { label: 'Twitter', icon: <XIcon size={18} />, href: SOCIAL_URLS.x }
]

const INACTIVE_LINKS = [
  {
    label: '知乎',
    icon: <ZhihuIcon size={18} />,
    href: 'https://www.zhihu.com/people/king-22-36-78'
  },
  {
    label: '微博',
    icon: <SinaWeiboIcon />,
    href: 'https://weibo.com/u/7219364172'
  }
]

const iconLinkClass =
  'border-border hover:border-foreground inline-flex items-center justify-center gap-1.5 border-b pb-0.5 text-base transition-colors duration-200'

function AboutSocial() {
  return (
    <Animated preset={{ mode: 'fadeInUp', delay: 0.4 }}>
      <h2 className="text-muted-foreground mb-6 text-base font-medium">
        Find me on
      </h2>
      <div className="-mt-2 flex flex-wrap gap-2">
        {SOCIAL_LINKS.map(({ icon, label, href }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={iconLinkClass}
          >
            {icon} {label}
          </Link>
        ))}
      </div>

      <p className="text-muted-foreground my-5">
        Or mail me at {AUTHOR_INFO.email}
      </p>

      <div className="text-muted-foreground">
        {'( '}Inactive on&nbsp;&nbsp;
        <span className="text-foreground! inline-flex flex-wrap gap-2">
          {INACTIVE_LINKS.map(({ label, icon, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={iconLinkClass}
            >
              {icon} {label}
            </Link>
          ))}
        </span>
        {' )'}
      </div>
    </Animated>
  )
}

export default AboutSocial
