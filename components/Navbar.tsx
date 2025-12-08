'use client'

interface NavbarProps {
  page: string
}

function Navbar({ page }: NavbarProps) {
  return <div>Navbar: {page}</div>
}

export default Navbar
