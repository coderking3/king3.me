/* eslint-disable no-console */
'use client'

interface NavbarProps {
  page: string
}

function Navbar({ page }: NavbarProps) {
  console.log(`🚀 ~ page:`, page)
  return <div>Navbar</div>
}

export default Navbar
