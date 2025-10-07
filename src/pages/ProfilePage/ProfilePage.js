import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/dateUtils';
import './ProfilePage.css';

const ROLE_DESCRIPTIONS = {
  manager: {
    title: 'Менеджер',
    description: 'Полный доступ к управлению проектами: создание, редактирование и удаление объектов. Назначение задач, контроль сроков, формирование отчётов.',
    color: '#2196F3',
  },
  engineer: {
    title: 'Инженер',
    description: 'Регистрация дефектов на объектах, обновление информации о дефектах, изменение статусов работ.',
    color: '#4CAF50',
  },
  observer: {
    title: 'Наблюдатель',
    description: 'Просмотр прогресса работ и отчётности по проектам. Доступ только для чтения.',
    color: '#FF9800',
  },
};

const ProfilePage = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      logout();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Загрузка профиля...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2 className="profile-error-title">Ошибка</h2>
          <p className="profile-error-text">Не удалось загрузить данные профиля</p>
        </div>
      </div>
    );
  }

  const roleInfo = ROLE_DESCRIPTIONS[user.role.code] || ROLE_DESCRIPTIONS.observer;
  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-content">
          <h1 className="profile-title">Профиль</h1>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <div className="profile-avatar">{initials}</div>
            <h2 className="profile-name">
              {user.first_name} {user.last_name}
            </h2>
            <span
              className="profile-role-badge"
              style={{ backgroundColor: roleInfo.color }}
            >
              {roleInfo.title}
            </span>
          </div>

          {/* Role Description */}
          <div className="profile-role-description">
            <div className="profile-role-description-title">
              Права доступа
            </div>
            <div className="profile-role-description-text">
              {roleInfo.description}
            </div>
          </div>

          {/* Info Section */}
          <div className="profile-info-section">
            {/* Email */}
            <div className="profile-info-item">
              <div className="profile-info-icon">📧</div>
              <div className="profile-info-content">
                <div className="profile-info-label">Email</div>
                <div className="profile-info-value">{user.email}</div>
              </div>
            </div>

            {/* Phone */}
            {user.phone && (
              <div className="profile-info-item">
                <div className="profile-info-icon">📱</div>
                <div className="profile-info-content">
                  <div className="profile-info-label">Телефон</div>
                  <div className="profile-info-value">{user.phone}</div>
                </div>
              </div>
            )}

            {/* User ID */}
            <div className="profile-info-item">
              <div className="profile-info-icon">🆔</div>
              <div className="profile-info-content">
                <div className="profile-info-label">ID пользователя</div>
                <div className="profile-info-value">#{user.id}</div>
              </div>
            </div>

            {/* Account Status */}
            <div className="profile-info-item">
              <div className="profile-info-icon">
                {user.is_active ? '✅' : '❌'}
              </div>
              <div className="profile-info-content">
                <div className="profile-info-label">Статус аккаунта</div>
                <div className="profile-info-value">
                  {user.is_active ? 'Активен' : 'Неактивен'}
                </div>
              </div>
            </div>

            {/* Created At */}
            <div className="profile-info-item">
              <div className="profile-info-icon">📅</div>
              <div className="profile-info-content">
                <div className="profile-info-label">Дата регистрации</div>
                <div className="profile-info-value">
                  {formatDateTime(user.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <button className="profile-action-btn profile-logout-btn" onClick={handleLogout}>
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;