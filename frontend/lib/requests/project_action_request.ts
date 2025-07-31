import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import axiosClient from '../axiosClient'
import { MessageResponse } from '../types/error_types'
import {
  ProjectActionReplyRequest,
  ProjectActionRequest,
  ProjectRequest,
} from '../types/project_action_types'

const BASE_URL = '/project/request'

const getProjectRequests = async (id: string): Promise<ProjectRequest[]> => {
  const resp = await axiosClient.get<ProjectRequest[]>(`${BASE_URL}/${id}`)
  return resp.data
}

const useGetProjectRequests = (id: string) => {
  return useQuery({
    queryKey: ['project_requests', id],
    queryFn: () => getProjectRequests(id),
    enabled: !!id,
  })
}

const applyRole = async (req: ProjectActionRequest) => {
  const resp = await axiosClient.post<MessageResponse>(`${BASE_URL}/apply`, req)
  return resp.data
}

const useApplyRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applyRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] })
    },
  })
}

const cancelRoleRequest = async (req: ProjectActionRequest) => {
  const resp = await axiosClient.delete<MessageResponse>(`${BASE_URL}/cancel`, {
    data: req,
  } as any)
  return resp.data
}

const useCancelRoleRequest = () => {
  return useMutation({
    mutationFn: cancelRoleRequest,
  })
}

const withdrawRoleRequest = async (req: ProjectActionRequest) => {
  const resp = await axiosClient.delete<MessageResponse>(
    `${BASE_URL}/withdraw`,
    {
      data: req,
    } as any,
  )
  return resp.data
}

const useWithdrawRoleRequest = () => {
  return useMutation({
    mutationFn: withdrawRoleRequest,
  })
}

const replyRoleRequest = async (req: ProjectActionReplyRequest) => {
  const resp = await axiosClient.put<MessageResponse>(`${BASE_URL}/reply`, req)
  return resp.data
}

const useReplyRoleRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: replyRoleRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export {
  useApplyRole,
  useCancelRoleRequest,
  useWithdrawRoleRequest,
  useReplyRoleRequest,
  useGetProjectRequests,
}
