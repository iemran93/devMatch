import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectResponse } from "@/lib/types/project_types"
import {
  getStageColor,
  getStageIcon,
  getTypeTextColor,
  getTypeColor,
} from "@/components/layout/components_helper"

export const ProjectCard = ({ project }: { project: ProjectResponse }) => {
  const StageIcon = getStageIcon(project.stage)
  const primaryType = project.category.name

  return (
    <Card className="bg-muted/50 dark:bg-card hover:bg-background transition-all duration-200 flex flex-col relative">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">{project.title}</CardTitle>
          <div
            className={`${getStageColor(project.stage)} p-1.5 rounded-full`}
            title={project.stage}
          >
            <StageIcon size={14} />
          </div>
        </div>
        <CardContent className="p-0 pt-2">
          <p className="text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </CardContent>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2">
        {project.technologies?.map((tech, index) => (
          <Badge key={index} variant="secondary">
            {tech.name}
          </Badge>
        ))}
      </CardContent>

      <CardFooter
        className={`mt-auto flex flex-col gap-2 w-full ${getTypeColor(
          primaryType
        )}`}
      >
        <div
          className={`w-full flex justify-center items-center py-1.5 ${getTypeTextColor(
            primaryType
          )}`}
        >
          <span className="font-medium">{primaryType}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
