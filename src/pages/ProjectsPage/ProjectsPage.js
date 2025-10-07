import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { projectsApi } from '../../api/projectsApi';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import ProjectModal from '../../components/ProjectModal/ProjectModal';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const canManageProjects = user?.role?.code === 'manager';

  useEffect(() => {
    loadProjects();
  }, [pagination.currentPage]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getProjects(pagination.currentPage, 10);
      setProjects(data.projects || []);
      setPagination({
        currentPage: data.pagination.current_page,
        totalPages: data.pagination.total_pages,
        totalItems: data.pagination.total_items,
      });
    } catch (error) {
      console.error('Error loading projects:', error);
      alert('Ошибка при загрузке проектов');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (formData, imageFile) => {
    try {
      const response = await projectsApi.createProject(formData);
      const newProject = response.project;

      // Загрузка изображения, если оно есть
      if (imageFile) {
        await projectsApi.uploadProjectImage(newProject.id, imageFile);
      }

      loadProjects();
      alert('Проект успешно создан');
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const handleUpdateProject = async (formData, imageFile) => {
    try {
      await projectsApi.updateProject(selectedProject.id, formData);

      // Загрузка нового изображения, если оно есть
      if (imageFile) {
        await projectsApi.uploadProjectImage(selectedProject.id, imageFile);
      }

      loadProjects();
      alert('Проект успешно обновлён');
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await projectsApi.deleteProject(projectId);
      loadProjects();
      alert('Проект успешно удалён');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Ошибка при удалении проекта');
    }
  };

  const handleOpenModal = (project = null) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setShowModal(false);
  };

  const handleSubmitModal = async (formData, imageFile) => {
    if (selectedProject) {
      await handleUpdateProject(formData, imageFile);
    } else {
      await handleCreateProject(formData, imageFile);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  if (loading) {
    return (
      <div className="projects-page">
        <div className="projects-loading">Загрузка проектов...</div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div className="projects-header-content">
          <h1 className="projects-title">Список объектов</h1>
          {canManageProjects && (
            <button
              className="projects-add-btn"
              onClick={() => handleOpenModal()}
            >
              + Добавить объект
            </button>
          )}
        </div>
      </div>

      <div className="projects-container">
        {projects.length === 0 ? (
          <div className="projects-empty">
            <h2 className="projects-empty-title">Проектов пока нет</h2>
            <p className="projects-empty-text">
              {canManageProjects
                ? 'Создайте первый проект, нажав на кнопку выше'
                : 'Проекты появятся здесь, когда их создаст менеджер'}
            </p>
          </div>
        ) : (
          <>
            <div className="projects-list">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleOpenModal}
                  onDelete={handleDeleteProject}
                  showActions={canManageProjects}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="projects-pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  ← Назад
                </button>
                <span className="pagination-info">
                  Страница {pagination.currentPage} из {pagination.totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Вперёд →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <ProjectModal
            project={selectedProject}
            onClose={handleCloseModal}
            onSubmit={handleSubmitModal}
        />
      )}
    </div>
  );
};

export default ProjectsPage;