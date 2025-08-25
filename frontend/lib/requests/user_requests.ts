import { useQuery } from '@tanstack/react-query'
import axiosClient from '../axiosClient'
import { User } from '../types/auth_types'

const getUserByUsername = async (username: string): Promise<User> => {
  const res = await axiosClient.get<User>(`/user/${username}`)
  return res.data
}

const useGetUserByUsername = (username: string) => {
  return useQuery({
    queryFn: () => getUserByUsername(username),
    queryKey: ['userByUsername', username],
    enabled: !!username,
  })
}

export { useGetUserByUsername }
