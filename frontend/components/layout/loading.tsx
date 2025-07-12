import { Loader2 } from "lucide-react"

export function Loading() {
  return (
    <section id="projects" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Projects
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Explore and join latest projects
      </h3>
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading projects...</span>
      </div>
    </section>
  )
}
