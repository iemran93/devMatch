import { Loader2 } from 'lucide-react'

export function Loading() {
  return (
    <section id="projects" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Loading ...
      </h2>
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </section>
  )
}
