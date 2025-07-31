export type ProjectRequest = {
  id: number
  project_id: number
  user_id: number
  role_id: number
  status: string
  created_at: string
  updated_at: string
}

export type ProjectActionRequest = {
  project_id: number
  user_id?: number
  role_id: number
  status?: string
}

export type ProjectActionReplyRequest = {
  request_id: number
  accepted: boolean
}
