import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosClient from '../axiosClient'
import { ProjectRoles, ProjectRolesRequest } from '../types/project_types'

const newProjectRole = async (data: ProjectRolesRequest) => {
  const resp = await axiosClient.post<ProjectRoles>('/project/roles', data)
  return resp.data
}

const useNewProjectRole = (projectId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: newProjectRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    },
  })
}

const updateProjectRole = async ({
  roleId,
  data,
}: {
  roleId: string
  data: ProjectRolesRequest
}) => {
  const resp = await axiosClient.put<ProjectRoles>(
    `/project/roles/${roleId}`,
    data,
  )
  return resp.data
}

const useUpdateProjectRole = (projectId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProjectRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    },
  })
}

const deleteProjectRole = async (roleId: string) => {
  const resp = await axiosClient.delete<{ message: string }>(
    `/project/roles/${roleId}`,
  )
  return resp.data
}

const useDelteProjectRole = (projectId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (roleId: string) => deleteProjectRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    },
  })
}

export { useNewProjectRole, useUpdateProjectRole }
