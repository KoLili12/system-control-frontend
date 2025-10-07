import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { defectsApi } from '../../api/defectsApi';
import { formatDateTime } from '../../utils/dateUtils';
import { getDefectStatusInfo, getDefectPriorityInfo } from '../../utils/defectUtils';
import './DefectDetailPage.css';

const DefectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [defect, setDefect] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDefect();
    loadFiles();
  }, [id]);

  const loadDefect = async () => {
    try {
      setLoading(true);
      const data = await defectsApi.getDefect(id);
      setDefect(data.defect);
    } catch (error) {
      console.error('Error loading defect:', error);
      setError('Не удалось загрузить дефект');
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async () => {
    try {
      const data = await defectsApi.getDefectFiles(id);
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  if (loading) {
    return (
      <div className="defect-detail-page">
        <div className="defect-detail-loading">Загрузка дефекта...</div>
      </div>
    );
  }

  if (error || !defect) {
    return (
      <div className="defect-detail-page">
        <div className="defect-detail-error">
          <h2 className="defect-detail-error-title">Ошибка</h2>
          <p className="defect-detail-error-text">
            {error || 'Дефект не найден'}
          </p>
          <button className="error-back-btn" onClick={() => navigate('/defects')}>
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getDefectStatusInfo(defect.status);
  const priorityInfo = getDefectPriorityInfo(defect.priority);

  return (
    <div className="defect-detail-page">
      <div className="defect-detail-header">
        <div className="defect-detail-header-content">
          <button className="back-btn" onClick={() => navigate('/defects')}>
            ←
          </button>
          <h1 className="project-detail-title">Детали дефекта</h1>
        </div>
      </div>

      <div className="defect-detail-container">
        <div className="defect-detail-card">
          <div className="defect-detail-main">
            <h2 className="defect-detail-title">{defect.title}</h2>
            <div className="defect-detail-badges">
              <span
                className="defect-detail-badge"
                style={{ backgroundColor: priorityInfo.color }}
              >
                {priorityInfo.label}
              </span>
              <span
                className="defect-detail-badge"
                style={{ backgroundColor: statusInfo.color }}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>

          <p className="defect-detail-description">{defect.description}</p>

          <div className="defect-detail-info">
            {/* Project */}
            <div className="defect-info-card">
              <div className="defect-info-icon">📋</div>
              <div className="defect-info-content">
                <div className="defect-info-label">Проект</div>
                <div className="defect-info-value">{defect.project_name}</div>
              </div>
            </div>

            {/* Creator */}
            <div className="defect-info-card">
              <div className="defect-info-icon">👤</div>
              <div className="defect-info-content">
                <div className="defect-info-label">Создал</div>
                <div className="defect-info-value">
                  {defect.creator.first_name} {defect.creator.last_name}
                </div>
              </div>
            </div>

            {/* Created At */}
            <div className="defect-info-card">
              <div className="defect-info-icon">📅</div>
              <div className="defect-info-content">
                <div className="defect-info-label">Дата создания</div>
                <div className="defect-info-value">
                  {formatDateTime(defect.created_at)}
                </div>
              </div>
            </div>

            {/* Updated At */}
            <div className="defect-info-card">
              <div className="defect-info-icon">🔄</div>
              <div className="defect-info-content">
                <div className="defect-info-label">Последнее обновление</div>
                <div className="defect-info-value">
                  {formatDateTime(defect.updated_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          {files.length > 0 && (
            <div className="defect-detail-images">
              <h3 className="defect-detail-images-title">Фотографии ({files.length})</h3>
              <div className="defect-images-grid">
                {files.map((file) => (
                  <img
                    key={file.id}
                    src={`http://localhost:8080${file.url}`}
                    alt={file.original_name}
                    className="defect-image-item"
                    onClick={() => window.open(`http://localhost:8080${file.url}`, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefectDetailPage;