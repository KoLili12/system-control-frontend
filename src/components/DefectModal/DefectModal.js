import React, { useState, useEffect } from 'react';
import { DEFECT_PRIORITIES } from '../../utils/defectUtils';
import './DefectModal.css';

const DefectModal = ({ defect, projects, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    priority: 'medium',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defect) {
      setFormData({
        projectId: defect.project_id || '',
        title: defect.title || '',
        description: defect.description || '',
        priority: defect.priority || 'medium',
      });
    } else if (projects && projects.length > 0) {
      setFormData((prev) => ({
        ...prev,
        projectId: projects[0].id,
      }));
    }
  }, [defect, projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData, imageFiles);
      onClose();
    } catch (error) {
      console.error('Error submitting defect:', error);
      alert('Ошибка при сохранении дефекта');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="defect-modal-overlay" onClick={onClose}>
      <div className="defect-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="defect-modal-header">
          <h2 className="defect-modal-title">
            {defect ? 'Редактировать дефект' : 'Создать дефект'}
          </h2>
          <button className="defect-modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="defect-modal-form" onSubmit={handleSubmit}>
          {/* Project Selection (only for new defects) */}
          {!defect && projects && projects.length > 0 && (
            <div className="form-group">
              <label className="form-label" htmlFor="projectId">
                Проект *
              </label>
              <select
                id="projectId"
                name="projectId"
                className="form-select"
                value={formData.projectId}
                onChange={handleChange}
                required
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Название дефекта *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              placeholder="Краткое описание проблемы"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Подробное описание *
            </label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              placeholder="Детальное описание дефекта"
              value={formData.description}
              onChange={handleChange}
              required
              minLength={10}
              rows={6}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label" htmlFor="priority">
              Приоритет
            </label>
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              {Object.entries(DEFECT_PRIORITIES).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          {!defect && (
            <div className="form-group">
              <label className="form-label" htmlFor="images">
                Фотографии (опционально)
              </label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-input"
                style={{ padding: '10px' }}
              />
              {imageFiles.length > 0 && (
                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                  Выбрано файлов: {imageFiles.length}
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="defect-modal-footer">
            <button
              type="button"
              className="defect-modal-btn defect-modal-btn-cancel"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="defect-modal-btn defect-modal-btn-submit"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DefectModal;