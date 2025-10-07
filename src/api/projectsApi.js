import axiosClient from './axiosClient';

export const projectsApi = {
  // GET /api/v1/projects
  getProjects: async (page = 1, limit = 10, status = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) {
      params.append('status', status);
    }

    const response = await axiosClient.get(`/projects?${params}`);
    return response.data;
  },

  // GET /api/v1/projects/:id
  getProject: async (id) => {
    const response = await axiosClient.get(`/projects/${id}`);
    return response.data;
  },

  // POST /api/v1/projects
  createProject: async (projectData) => {
    const response = await axiosClient.post('/projects', {
      name: projectData.name,
      description: projectData.description,
      address: projectData.address,
      start_date: projectData.startDate,
      end_date: projectData.endDate,
    });
    return response.data;
  },

  // PUT /api/v1/projects/:id
  updateProject: async (id, projectData) => {
    const response = await axiosClient.put(`/projects/${id}`, {
      name: projectData.name,
      description: projectData.description,
      address: projectData.address,
      status: projectData.status,
      start_date: projectData.startDate,
      end_date: projectData.endDate,
    });
    return response.data;
  },

  // DELETE /api/v1/projects/:id
  deleteProject: async (id) => {
    const response = await axiosClient.delete(`/projects/${id}`);
    return response.data;
  },

  // GET /api/v1/projects/:id/image
  getProjectImageUrl: (id) => {
    return `http://localhost:8080/api/v1/projects/${id}/image`;
  },

  // POST /api/v1/files/upload
  uploadProjectImage: async (projectId, imageFile) => {
    const formData = new FormData();
    formData.append('files', imageFile);
    formData.append('entity_type', 'project');
    formData.append('entity_id', projectId.toString());

    const response = await axiosClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // GET /api/v1/projects/:id/files
  getProjectFiles: async (id) => {
    const response = await axiosClient.get(`/projects/${id}/files`);
    return response.data;
  },
};