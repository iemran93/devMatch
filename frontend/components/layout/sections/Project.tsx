import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Timer, CheckCircle2 } from "lucide-react";

interface ProjectProps {
  title: string;
  description: string;
  techStack: string[];
  type: "Personal" | "Hackathon" | "Team" | "Open Source";
  stage: "Idea" | "In Progress" | "Completed";
}

// This will be replaced with API data later
const projectList: ProjectProps[] = [
  {
    title: "DevMatch Platform",
    description: "A platform for connecting developers with exciting projects and opportunities.",
    techStack: ["React", "Node.js", "TypeScript", "MongoDB"],
    type: "Team",
    stage: "In Progress",
  },
  {
    title: "AI Code Assistant",
    description: "An AI-powered code completion and suggestion tool for developers.",
    techStack: ["Python", "TensorFlow", "FastAPI"],
    type: "Personal",
    stage: "Completed",
  },
  {
    title: "Smart Home Hub",
    description: "A centralized platform for managing IoT devices and home automation.",
    techStack: ["React Native", "Firebase", "Node.js"],
    type: "Hackathon",
    stage: "Idea",
  },
  // Add more projects as needed
];

const getTypeColor = (type: ProjectProps["type"]) => {
  const colors = {
    Personal: "bg-blue-500/10",
    Hackathon: "bg-purple-500/10",
    Team: "bg-green-500/10",
    "Open Source": "bg-orange-500/10",
  };
  return colors[type];
};

const getTypeTextColor = (type: ProjectProps["type"]) => {
  const colors = {
    Personal: "text-blue-500",
    Hackathon: "text-purple-500",
    Team: "text-green-500",
    "Open Source": "text-orange-500",
  };
  return colors[type];
};

const getStageIcon = (stage: ProjectProps["stage"]) => {
  const icons = {
    Idea: Lightbulb,
    "In Progress": Timer,
    Completed: CheckCircle2,
  };
  return icons[stage];
};

const getStageColor = (stage: ProjectProps["stage"]) => {
  const colors = {
    Idea: "bg-gray-500/10 text-gray-500",
    "In Progress": "bg-yellow-500/10 text-yellow-500",
    Completed: "bg-green-500/10 text-green-500",
  };
  return colors[stage];
};

export const Projects = () => {
  return (
    <section id="projects" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Projects
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Explore and join latest projects
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectList.map((project, index) => {
          const StageIcon = getStageIcon(project.stage);
          return (
            <Card
              key={index}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all duration-200 flex flex-col relative"
            >
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
                {project.techStack.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </CardContent>

              <CardFooter className={`mt-auto flex flex-col gap-2 w-full ${getTypeColor(project.type)}`}>
                <div className={`w-full flex justify-center items-center py-1.5 ${getTypeTextColor(project.type)}`}>
                  <span className="font-medium">{project.type}</span>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
