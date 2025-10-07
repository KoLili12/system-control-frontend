import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { defectsApi } from '../../api/defectsApi';
import { projectsApi } from '../../api/projectsApi';
import DefectCard from '../../components/DefectCard/DefectCard';
import DefectModal from '../../components/DefectModal/DefectModal';
import StatusModal from '../../components/StatusModal/StatusModal';
import { DEFECT_STATUSES, DEFECT_PRIORITIES } from '../../utils/defectUtils';
import './DefectsPage.css';

const DefectsPage = () => {
  const { user } = useAuth();
  const [defects, setDefects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDefectModal, setShowDefectModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [filters, setFilters] = useState({
    projectId: '',
    status: '',
    priority: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const canManageDefects = user?.role?.code === 'engineer';

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadDefects();
  }, [pagination.currentPage, filters]);

  const loadProjects = async () => {
    try {
      const data = await projectsApi.getProjects(1, 100);
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadDefects = async () => {
    try {
      setLoading(true);
      const data = await defectsApi.getDefects(
        filters.projectId || null,
        pagination.currentPage,
        20,
        filters.status,
        filters.priority
      );
      setDefects(data.defects || []);
      setPagination({
        currentPage: data.pagination.current_page,
        totalPages: data.pagination.total_pages,
        totalItems: data.pagination.total_items,
      });
    } catch (error) {
      console.error('Error loading defects:', error);
      alert('Ошибка при загрузке дефектов');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDefect = async (formData, imageFiles) => {
    try {
      const response = await defectsApi.createDefect(formData);
      const newDefect = response.defect;

      // Загрузка изображений, если они есть
      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          await defectsApi.uploadDefectImage(newDefect.id, file);
        }
      }

      loadDefects();
      alert('Дефект успешно создан');
    } catch (error) {
      console.error('Error creating defect:', error);
      throw error;
    }
  };

  const handleUpdateDefect = async (formData) => {
    try {
      await defectsApi.updateDefect(selectedDefect.id, formData);
      loadDefects();
      alert('Дефект успешно обновлён');
    } catch (error) {
      console.error('Error updating defect:', error);
      throw error;
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await defectsApi.updateDefectStatus(selectedDefect.id, newStatus);
      loadDefects();
      alert('Статус успешно изменён');
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };

  const handleDeleteDefect = async (defectId) => {
    try {
      await defectsApi.deleteDefect(defectId);
      loadDefects();
      alert('Дефект успешно удалён');
    } catch (error) {
      console.error('Error deleting defect:', error);
      alert('Ошибка при удалении дефекта');
    }
  };

  const handleOpenDefectModal = (defect = null) => {
    setSelectedDefect(defect);
    setShowDefectModal(true);
  };

  const handleCloseDefectModal = () => {
    setSelectedDefect(null);
    setShowDefectModal(false);
  };

  const handleOpenStatusModal = (defect) => {
    setSelectedDefect(defect);
    setShowStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setSelectedDefect(null);
    setShowStatusModal(false);
  };

  const handleSubmitDefectModal = async (formData, imageFiles) => {
    if (selectedDefect) {
      await handleUpdateDefect(formData);
    } else {
      await handleCreateDefect(formData, imageFiles);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  if (loading && defects.length === 0) {
    return (
      <div className="defects-page">
        <div className="defects-loading">Загрузка дефектов...</div>
      </div>
    );
  }

  return (
    <div className="defects-page">
      <div className="defects-header">
        <div className="defects-header-content">
          <h1 className="defects-title">Список дефектов</h1>
          {canManageDefects && (
            <button
              className="defects-add-btn"
              onClick={() => handleOpenDefectModal()}
            >
              + Добавить дефект
            </button>
          )}
        </div>
      </div>

      <div className="defects-container">
        {/* Filters */}
        <div className="defects-filters">
          <div className="defects-filters-row">
            <div className="form-group">
              <label className="form-label" htmlFor="projectId">
                Проект
              </label>
              <select
                id="projectId"
                name="projectId"
                className="form-select"
                value={filters.projectId}
                onChange={handleFilterChange}
              >
                <option value="">Все проекты</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Статус
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Все статусы</option>
                {Object.entries(DEFECT_STATUSES).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="priority">
                Приоритет
              </label>
              <select
                id="priority"
                name="priority"
                className="form-select"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="">Все приоритеты</option>
                {Object.entries(DEFECT_PRIORITIES).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        {defects.length === 0 ? (
          <div className="defects-empty">
            <h2 className="defects-empty-title">Дефектов не найдено</h2>
            <p className="defects-empty-text">
              {canManageDefects
                ? 'Создайте первый дефект, нажав на кнопку выше'
                : 'Дефекты появятся здесь, когда их зарегистрирует инженер'}
            </p>
          </div>
        ) : (
          <>
            <div className="defects-list">
              {defects.map((defect) => (
                <DefectCard
                  key={defect.id}
                  defect={defect}
                  onEdit={handleOpenDefectModal}
                  onDelete={handleDeleteDefect}
                  onStatusChange={handleOpenStatusModal}
                  showActions={canManageDefects}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="defects-pagination">
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

      {/* Modals */}
      {showDefectModal && (
        <DefectModal
          defect={selectedDefect}
          projects={projects}
          onClose={handleCloseDefectModal}
          onSubmit={handleSubmitDefectModal}
        />
      )}

      {showStatusModal && selectedDefect && (
        <StatusModal
          defect={selectedDefect}
          onClose={handleCloseStatusModal}
          onSubmit={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default DefectsPage;