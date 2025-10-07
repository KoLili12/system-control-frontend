import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '../../api/projectsApi';
import { formatDateTime } from '../../utils/dateUtils';
import { getStatusInfo } from '../../utils/statusUtils';
import './ProjectDetailPage.css';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/1200x300?text=No+Image');

  useEffect(() => {
    loadProject();
  }, [id]);

  useEffect(() => {
    if (project) {
      loadImage();
    }
  }, [project]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getProject(id);
      setProject(data.project);
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Не удалось загрузить проект');
    } finally {
      setLoading(false);
    }
  };

  const loadImage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/v1/projects/${id}/image`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      }
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="project-detail-loading">Загрузка проекта...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-page">
        <div className="project-detail-error">
          <h2 className="project-detail-error-title">Ошибка</h2>
          <p className="project-detail-error-text">
            {error || 'Проект не найден'}
          </p>
          <button className="error-back-btn" onClick={() => navigate('/projects')}>
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(project.status);

  return (
    <div className="project-detail-page">
      <div className="project-detail-header">
        <div className="project-detail-header-content">
          <button className="back-btn" onClick={() => navigate('/projects')}>
            ←
          </button>
          <h1 className="project-detail-title">Детали объекта</h1>
        </div>
      </div>

      <div className="project-detail-container">
        <div className="project-detail-card">
          <img
            src={imageUrl}
            alt={project.name}
            className="project-detail-image"
          />

          <div className="project-detail-main">
            <h2 className="project-detail-name">{project.name}</h2>
            <span
              className="project-detail-status"
              style={{ backgroundColor: statusInfo.color }}
            >
              {statusInfo.label}
            </span>
          </div>

          <p className="project-detail-description">
            {project.description || 'Нет описания'}
          </p>

          <div className="project-detail-info">
            {/* Address */}
            <div className="project-info-card">
              <div className="project-info-icon">📍</div>
              <div className="project-info-content">
                <div className="project-info-label">Адрес</div>
                <div className="project-info-value">{project.address}</div>
              </div>
            </div>

            {/* Start Date */}
            <div className="project-info-card">
              <div className="project-info-icon">▶️</div>
              <div className="project-info-content">
                <div className="project-info-label">Начало</div>
                <div className="project-info-value">
                  {formatDateTime(project.start_date)}
                </div>
              </div>
            </div>

            {/* End Date */}
            <div className="project-info-card">
              <div className="project-info-icon">⏹️</div>
              <div className="project-info-content">
                <div className="project-info-label">Окончание</div>
                <div className="project-info-value">
                  {formatDateTime(project.end_date)}
                </div>
              </div>
            </div>

            {/* Creator */}
            <div className="project-info-card">
              <div className="project-info-icon">👤</div>
              <div className="project-info-content">
                <div className="project-info-label">Создал</div>
                <div className="project-info-value">
                  {project.creator.first_name} {project.creator.last_name}
                </div>
              </div>
            </div>

            {/* Created At */}
            <div className="project-info-card">
              <div className="project-info-icon">📅</div>
              <div className="project-info-content">
                <div className="project-info-label">Создан</div>
                <div className="project-info-value">
                  {formatDateTime(project.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;