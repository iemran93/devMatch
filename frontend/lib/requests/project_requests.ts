import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../axiosClient";
import type { Category, CreateProjectRequest, Language, ProjectResponse, Technology, Types } from "../types/project_types";

const getProjects = async (): Promise<ProjectResponse[]> => {
    const response = await axiosClient.get<ProjectResponse[]>('/projects');
    return response.data;
}

export const useProjects = () => {
return useQuery({
  queryKey: ["projects"],
  queryFn: getProjects,
});
}

const getProjectById = async (id: string): Promise<ProjectResponse> => {
    const response = await axiosClient.get<ProjectResponse>(`/projects/${id}`);
    return response.data;
}

export const useGetProjectById = (id: string) => {
return useQuery({
  queryKey: ["project", id],
  queryFn: () => getProjectById(id),
  enabled: !!id,
});
}

const getCategory = async (): Promise<Category[]> => {
    const response = await axiosClient.get<Category[]>('/projects/category');
    return response.data;
}

export const useGetCategory = () => {
return useQuery({
  queryKey: ["category"],
  queryFn: getCategory,
});
}

const getTechnology = async (): Promise<Technology[]> => {
    const response = await axiosClient.get<Technology[]>('/projects/technology');
    return response.data;
}

export const useGetTechnology = () => {
return useQuery({
  queryKey: ["technology"],
  queryFn: getTechnology,
});
}

const getLanguage = async (): Promise<Language[]> => {
    const response = await axiosClient.get<Language[]>('/projects/language');
    return response.data;
}

export const useGetLanguage = () => {
return useQuery({
  queryKey: ["language"],
  queryFn: getLanguage,
});
}

const getType = async (): Promise<Types[]> => {
    const response = await axiosClient.get<Types[]>('/projects/type');
    return response.data;
}

export const useGetType = () => {
return useQuery({
  queryKey: ["type"],
  queryFn: getType,
});
}

export const useGetAllProjectData = () => {
  const { data: categories, isLoading: categoriesLoading } = useGetCategory();
  const { data: technologies, isLoading: technologiesLoading } = useGetTechnology();
  const { data: languages, isLoading: languagesLoading } = useGetLanguage();
  const { data: types, isLoading: typesLoading } = useGetType();

  return {
    categories,
    technologies,
    languages,
    types,
    isLoading: categoriesLoading || technologiesLoading || languagesLoading || typesLoading,
  };
}

export const createProject = async (projectData: CreateProjectRequest) => {
    const response = await axiosClient.post<ProjectResponse>('/projects', projectData);
    return response.data;
}

export const useCreateProject = () => {
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // query client
    },
  });
}

const updateProject = async (id: string, projectData: CreateProjectRequest) => {
    const response = await axiosClient.put<ProjectResponse>(`/projects/${id}`, projectData);
    return response.data;
}

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectData: CreateProjectRequest) => updateProject(id, projectData),
    onSuccess: () => {
      // Invalidate and refetch the specific project and projects list
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

const deleteProject = async (id: string) => {
    const response = await axiosClient.delete(`/projects/${id}`);
    return response.data;
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      // Invalidate projects list when a project is deleted
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}



