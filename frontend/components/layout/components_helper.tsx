import { CheckCircle2, Lightbulb, Timer } from "lucide-react"

export const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    Idea: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    "In Progress": "bg-blue-500/10 text-blue-600 border-blue-200",
    Completed: "bg-green-500/10 text-green-600 border-green-200",
  }
  return colors[stage] || "bg-gray-500/10 text-gray-600 border-gray-200"
}

export const getStageIcon = (stage: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    Idea: Lightbulb,
    "In Progress": Timer,
    Completed: CheckCircle2,
  }
  return icons[stage] || Lightbulb
}

export const getExperienceLevelText = (level: number) => {
  const levels: Record<number, string> = {
    1: "Beginner",
    2: "Basic",
    3: "Intermediate",
    4: "Advanced",
    5: "Expert",
  }
  return levels[level] || "Unknown"
}

export const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    personal: "bg-blue-500/10",
    hackathon: "bg-purple-500/10",
    team: "bg-green-500/10",
    "Open Source": "bg-orange-500/10",
  }
  return colors[type] || "bg-gray-500/10"
}

export const getTypeTextColor = (type: string) => {
  const colors: Record<string, string> = {
    personal: "text-blue-500",
    hackathon: "text-purple-500",
    team: "text-green-500",
    "Open Source": "text-orange-500",
  }
  return colors[type] || "text-gray-500"
}
