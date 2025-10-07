import React, { useState } from 'react';
import { DEFECT_STATUSES } from '../../utils/defectUtils';
import './StatusModal.css';

const STATUS_DESCRIPTIONS = {
  registered: 'Дефект только что обнаружен и зарегистрирован в системе',
  in_progress: 'Работы по устранению дефекта ведутся',
  completed: 'Дефект полностью устранен',
};

const StatusModal = ({ defect, onClose, onSubmit }) => {
  const [selectedStatus, setSelectedStatus] = useState(defect.status);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (selectedStatus === defect.status) {
      alert('Выберите новый статус');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(selectedStatus);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Ошибка при изменении статуса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-modal-overlay" onClick={onClose}>
      <div className="status-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="status-modal-header">
          <h2 className="status-modal-title">Изменить статус</h2>
          <p className="status-modal-subtitle">{defect.title}</p>
        </div>

        <div className="status-modal-options">
          {Object.entries(DEFECT_STATUSES).map(([value, { label }]) => (
            <div
              key={value}
              className={`status-option ${selectedStatus === value ? 'selected' : ''}`}
              onClick={() => setSelectedStatus(value)}
            >
              <div className="status-option-indicator" />
              <div className="status-option-content">
                <div className="status-option-label">{label}</div>
                <div className="status-option-description">
                  {STATUS_DESCRIPTIONS[value]}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="status-modal-footer">
          <button
            className="status-modal-btn status-modal-btn-cancel"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="status-modal-btn status-modal-btn-submit"
            onClick={handleSubmit}
            disabled={loading || selectedStatus === defect.status}
          >
            {loading ? 'Сохранение...' : 'Применить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;