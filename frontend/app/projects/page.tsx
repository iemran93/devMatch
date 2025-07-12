"use client"

import { ProjectCard } from "@/components/auth/project/projectCard"
import { Loading } from "@/components/layout/loading"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useProjects } from "@/lib/requests/project_requests"
import { AlignJustify, ArrowRight, Grid2x2 } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function ProjectsPage() {
  const { isAuthenticated } = useAuth()
  const { data: projects, isLoading, error } = useProjects()
  const [gridView, setGridView] = React.useState(true)

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
      {isAuthenticated && (
        <div className="flex justify-center mb-8">
          <Button asChild className="w-5/6 md:w-1/4 font-bold group/arrow">
            <Link href="/projects/create">
              Create Project
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      )}
      <div
        id="options-bar"
        className="flex justify-center mb-8 bg-blue-500 relative"
      >
        <Link
          href="#"
          className="absolute right-0"
          onClick={() => setGridView(!gridView)}
        >
          {gridView ? <AlignJustify /> : <Grid2x2 />}
        </Link>
      </div>
      <div
        className={
          gridView
            ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid grid-cols-1 gap-6"
        }
      >
        {projects?.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </section>
  )
}
