import axiosClient from './axiosClient';

export const defectsApi = {
  // GET /api/v1/defects
  getDefects: async (projectId, page = 1, limit = 20, status = '', priority = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (projectId) {
      params.append('project_id', projectId.toString());
    }
    if (status) {
      params.append('status', status);
    }
    if (priority) {
      params.append('priority', priority);
    }

    const response = await axiosClient.get(`/defects?${params}`);
    return response.data;
  },

  // GET /api/v1/defects/:id
  getDefect: async (id) => {
    const response = await axiosClient.get(`/defects/${id}`);
    return response.data;
  },

  // POST /api/v1/defects
  createDefect: async (defectData) => {
    const response = await axiosClient.post('/defects', {
      project_id: defectData.projectId,
      title: defectData.title,
      description: defectData.description,
      priority: defectData.priority || 'medium',
    });
    return response.data;
  },

  // PUT /api/v1/defects/:id
  updateDefect: async (id, defectData) => {
    const response = await axiosClient.put(`/defects/${id}`, {
      title: defectData.title,
      description: defectData.description,
      priority: defectData.priority,
    });
    return response.data;
  },

  // PATCH /api/v1/defects/:id/status
  updateDefectStatus: async (id, status) => {
    const response = await axiosClient.patch(`/defects/${id}/status`, {
      status: status,
    });
    return response.data;
  },

  // DELETE /api/v1/defects/:id
  deleteDefect: async (id) => {
    const response = await axiosClient.delete(`/defects/${id}`);
    return response.data;
  },

  // GET /api/v1/projects/:id/defects/stats
  getProjectDefectsStats: async (projectId) => {
    const response = await axiosClient.get(`/projects/${projectId}/defects/stats`);
    return response.data;
  },

  // POST /api/v1/files/upload для дефектов
  uploadDefectImage: async (defectId, imageFile) => {
    const formData = new FormData();
    formData.append('files', imageFile);
    formData.append('entity_type', 'defect');
    formData.append('entity_id', defectId.toString());

    const response = await axiosClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // GET /api/v1/files?entity_type=defect&entity_id=X
  getDefectFiles: async (defectId) => {
    const response = await axiosClient.get(
      `/files?entity_type=defect&entity_id=${defectId}`
    );
    return response.data;
  },
};