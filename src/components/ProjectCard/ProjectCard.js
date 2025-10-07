import React from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../../api/projectsApi';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { getStatusInfo } from '../../utils/statusUtils';
import './ProjectCard.css';

const ProjectCard = ({ project, onEdit, onDelete, showActions = true }) => {
  const navigate = useNavigate();
  const statusInfo = getStatusInfo(project.status);
  const imageUrl = projectsApi.getProjectImageUrl(project.id);

  const handleCardClick = (e) => {
    // Не переходить при клике на кнопки действий
    if (e.target.closest('.project-card-actions')) {
      return;
    }
    navigate(`/projects/${project.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(project);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Вы уверены, что хотите удалить проект "${project.name}"?`)) {
      onDelete(project.id);
    }
  };

  return (
    <div className="project-card" onClick={handleCardClick}>
      <img
        src={imageUrl}
        alt={project.name}
        className="project-card-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/100?text=No+Image';
        }}
      />

      <div className="project-card-content">
        <div className="project-card-header">
          <h3 className="project-card-title">{project.name}</h3>
          <span
            className="project-card-status"
            style={{ backgroundColor: statusInfo.color }}
          >
            {statusInfo.label}
          </span>
        </div>

        <p className="project-card-description">
          {project.description || 'Нет описания'}
        </p>

        <p className="project-card-address">📍 {project.address}</p>

        <div className="project-card-footer">
          <span className="project-card-date">
            📅 {formatDate(project.start_date)} - {formatDate(project.end_date)}
          </span>
          <span className="project-card-creator">
            👤 Создал: {project.creator.first_name} {project.creator.last_name}
          </span>
        </div>

        {showActions && (
          <div className="project-card-actions">
            <button
              className="project-card-action-btn project-card-edit-btn"
              onClick={handleEdit}
            >
              Редактировать
            </button>
            <button
              className="project-card-action-btn project-card-delete-btn"
              onClick={handleDelete}
            >
              Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;