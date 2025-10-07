import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import { getDefectStatusInfo, getDefectPriorityInfo } from '../../utils/defectUtils';
import './DefectCard.css';

const DefectCard = ({ defect, onEdit, onDelete, onStatusChange, showActions = true }) => {
  const navigate = useNavigate();
  const statusInfo = getDefectStatusInfo(defect.status);
  const priorityInfo = getDefectPriorityInfo(defect.priority);

  const handleCardClick = (e) => {
    if (e.target.closest('.defect-card-actions')) {
      return;
    }
    navigate(`/defects/${defect.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(defect);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Вы уверены, что хотите удалить дефект "${defect.title}"?`)) {
      onDelete(defect.id);
    }
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    onStatusChange(defect);
  };

  return (
    <div className="defect-card" onClick={handleCardClick}>
      <div className="defect-card-header">
        <div className="defect-card-badges">
          <span
            className="defect-card-badge"
            style={{ backgroundColor: priorityInfo.color }}
          >
            {priorityInfo.label}
          </span>
          <span
            className="defect-card-badge"
            style={{ backgroundColor: statusInfo.color }}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      <h3 className="defect-card-title">{defect.title}</h3>
      <p className="defect-card-description">{defect.description}</p>

      <div className="defect-card-footer">
        <span className="defect-card-project">
          📋 {defect.project_name}
        </span>
        <span className="defect-card-date">
          📅 {formatDate(defect.created_at)}
        </span>
      </div>

      {showActions && (
        <div className="defect-card-actions">
          <button
            className="defect-card-action-btn defect-card-status-btn"
            onClick={handleStatusChange}
          >
            Изменить статус
          </button>
          <button
            className="defect-card-action-btn defect-card-edit-btn"
            onClick={handleEdit}
          >
            Редактировать
          </button>
          <button
            className="defect-card-action-btn defect-card-delete-btn"
            onClick={handleDelete}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
};

export default DefectCard;