import { Animated } from '@/components'

const TECH_GROUPS = [
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Prisma', 'PostgreSQL']
  },
  {
    label: 'Tools',
    items: ['VS Code', 'Git', 'Figma', 'Vercel']
  }
]

function TechStack() {
  return (
    <div className="space-y-4">
      {TECH_GROUPS.map((group, gi) => (
        <Animated
          key={group.label}
          preset={{ mode: 'fadeInUp', delay: 0.2 + gi * 0.08 }}
        >
          <h3 className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
            {group.label}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item}
                className="bg-primary/5 text-primary border-primary/10 rounded-md border px-2.5 py-1 text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </Animated>
      ))}
    </div>
  )
}

export default TechStack
