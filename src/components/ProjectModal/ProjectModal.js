import React, { useState, useEffect } from 'react';
import { formatDateForInput } from '../../utils/dateUtils';
import { PROJECT_STATUSES } from '../../utils/statusUtils';
import './ProjectModal.css';

const ProjectModal = ({ project, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    status: 'active',
    startDate: '',
    endDate: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        address: project.address || '',
        status: project.status || 'active',
        startDate: formatDateForInput(project.start_date) || '',
        endDate: formatDateForInput(project.end_date) || '',
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData, imageFile);
      onClose();
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Ошибка при сохранении проекта');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {project ? 'Редактировать проект' : 'Создать проект'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div
            className="image-upload-container"
            onClick={() => document.getElementById('image-input').click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="image-upload-preview"
              />
            ) : (
              <div className="image-upload-text">
                📷 Нажмите для выбора фото
              </div>
            )}
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload-input"
            />
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Название *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="Название проекта"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              placeholder="Описание проекта"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="address">
              Адрес
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-input"
              placeholder="Адрес объекта"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          {project && (
            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Статус
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {Object.entries(PROJECT_STATUSES).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Start Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="startDate">
              Дата начала
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="form-input"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          {/* End Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="endDate">
              Дата окончания
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="form-input"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-submit"
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

export default ProjectModal;