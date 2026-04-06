import { COPYRIGHT } from '@/constants'

const footerQuotes = [
  'Code is poetry.',
  'Less code, more life.',
  'Done is better than perfect.'
]

function Footer() {
  // Daily quote selected by date hash
  const today = new Date().toDateString()
  const hash = today
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const quote = footerQuotes[hash % footerQuotes.length]

  return (
    <footer className="mt-16 sm:mt-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <div className="border-muted-foreground w-full border opacity-10"></div>
        <div className="text-muted-foreground/70 flex h-24 flex-col items-center justify-center gap-1 text-sm">
          <p>{COPYRIGHT}</p>
          <span>{quote}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
