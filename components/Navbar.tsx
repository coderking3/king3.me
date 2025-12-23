'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { navigationItems } from '@/config/nav'
import { cn } from '@/lib/utils'

interface NavbarProps {
  page: string
  className?: string
}

function Navbar({ page, className }: NavbarProps) {
  return (
    <nav
      className={cn(
        // 玻璃拟态基础
        'relative h-11 rounded-full shadow-xl/5',
        'bg-accent/30 bg-linear-to-b backdrop-blur-xs backdrop-saturate-150',
        'ring-ring/10 ring-1',
        className
      )}
    >
      <ul className="text-primary flex items-center justify-center bg-transparent px-3 text-sm font-medium">
        {navigationItems.map(({ href, name }) => {
          const isActive =
            (page.includes(href) && href !== '/') || page === href
          return (
            <motion.li key={name} className="relative px-3 py-2.5">
              <Link href={href}>
                {isActive && (
                  <motion.div
                    className="border-primary/15 absolute bottom-1 left-1/4 z-10 mx-auto w-1/2 rounded-full border-b-[3px]"
                    layoutId="underline"
                  ></motion.div>
                )}
                <motion.div className={`rounded-full text-sm font-bold`}>
                  {name}
                </motion.div>
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navbar
