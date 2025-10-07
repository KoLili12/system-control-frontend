import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '../../api/projectsApi';
import { defectsApi } from '../../api/defectsApi';
import { formatDateTime } from '../../utils/dateUtils';
import { getStatusInfo } from '../../utils/statusUtils';
import './ProjectDetailPage.css';

// Компонент статистики по дефектам
const DefectsStats = ({ projectId }) => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, [projectId]);

  const loadStats = async () => {
    try {
      const data = await defectsApi.getProjectDefectsStats(projectId);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (!stats) return null;

  return (
    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Статистика по дефектам</h3>
        <button
          onClick={() => navigate('/defects')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Посмотреть все
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        <div style={{ background: '#f8f8f8', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#000' }}>{stats.total}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Всего</div>
        </div>
        <div style={{ background: '#fff3e0', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF9800' }}>{stats.registered}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Зарегистрировано</div>
        </div>
        <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196F3' }}>{stats.in_progress}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>В работе</div>
        </div>
        <div style={{ background: '#e8f5e9', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>{stats.completed}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Завершено</div>
        </div>
      </div>
    </div>
  );
};

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

          {/* Добавляем статистику по дефектам */}
          <DefectsStats projectId={project.id} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;