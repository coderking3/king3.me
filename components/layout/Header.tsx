'use client'

import { Camera } from 'lucide-react'
import { usePathname } from 'next/navigation'

import Logo from './logo/Logo'
import Navbar from './Navbar'

function Header() {
  const pathname = usePathname()
  const page = pathname.split('/').slice(0, 2).join('/')

  return (
    <header className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
      {/* <header className="border-b-border/50 bg-background/50 flex items-center justify-between border-b px-4 py-2 backdrop-blur-sm transition-colors duration-300 sm:px-6 lg:px-8"> */}
      <Logo size={36}></Logo>
      {/* <Avatar page={page}></Avatar> */}

      <Navbar page={page}></Navbar>

      <div className="flex items-center justify-end gap-2">
        <Camera></Camera>
      </div>
    </header>
  )
}

export default Header
