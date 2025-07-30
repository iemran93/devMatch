import { useProjects } from "@/lib/requests/project_requests"
import { Loading } from "../loading"
import { ProjectCard } from "@/components/auth/project/projectCard"
import Link from "next/link"

export const Projects = () => {
  // get all projects from the API
  const { data: projects, isLoading, error } = useProjects()

  if (isLoading) {
    return <Loading />
  }

  return (
    <section id="projects" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Projects
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Explore and join latest projects
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.slice(0, 3).map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <ProjectCard project={project} />
            </Link>
        ))}
        {/* // button to view all projects */}
        <Link
          href="/projects"
          className="col-span-full mt-4 text-primary underline text-center block font-medium hover:text-primary/80 transition"
        >
          View all projects...
        </Link>
      </div>
    </section>
  )
}
