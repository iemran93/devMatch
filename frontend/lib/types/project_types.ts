import { User } from './auth_types'
import { z } from 'zod'

export interface ProjectRolesRequest {
  title: string
  project_id?: number
  description?: string
  required_experience_level: number
  is_filled?: boolean
}

export interface ProjectRoles {
  id: number
  project_id: number
  title: string
  description: string
  required_experience_level: string
  is_filled: boolean
}

export interface Category {
  id: number
  name: string
}

export interface Types {
  id: number
  name: string
}

export interface Technology {
  id: number
  name: string
}

export interface Language {
  id: number
  name: string
}

export interface ProjectResponse {
  id: number
  title: string
  description: string
  goals?: string | null
  stage: string
  created_at: string // ISO date string
  updated_at: string // ISO date string
  creator: User
  category: Category
  types: Types[]
  technologies: Technology[]
  languages: Language[]
  project_roles: ProjectRoles[]
}

export interface UpdateProjectRequest {
  id: number
  title: string
  description: string
  goals?: string | null
  stage: string
  category: Category
  types: Types[]
  technologies: Technology[]
  languages: Language[]
}

export interface CreateProjectRequest {
  title: string
  description: string
  goals?: string | null
  category_id: number
  stage: 'Idea' | 'In Progress' | 'Completed'
  project_type: number[]
  technologies?: number[]
  languages?: number[]
  project_roles: ProjectRolesRequest[]
}

// Zod schema for project creation form validation
export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  goals: z.string().optional().nullable(),
  category_id: z.number().min(1, 'Category is required'),
  stage: z.enum(['Idea', 'In Progress', 'Completed'], {
    errorMap: () => ({ message: 'Please select a valid stage' }),
  }),
  project_type: z
    .array(z.number())
    .min(1, 'At least one project type is required'),
  technologies: z.array(z.number()).optional(),
  languages: z.array(z.number()).optional(),
  project_roles: z
    .array(
      z.object({
        title: z.string().min(1, 'Role title is required'),
        description: z.string().optional(),
        required_experience_level: z
          .number()
          .min(1, 'Experience level must be between 1 and 5')
          .max(5, 'Experience level must be between 1 and 5'),
      }),
    )
    .min(1, 'At least one project role is required'),
})

export type CreateProjectFormData = z.infer<typeof createProjectSchema>
