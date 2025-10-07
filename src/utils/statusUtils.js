export const PROJECT_STATUSES = {
    active: { label: 'Активный', color: '#4CAF50' },
    completed: { label: 'Завершён', color: '#2196F3' },
    suspended: { label: 'Приостановлен', color: '#FF9800' },
  };
  
  export const getStatusInfo = (status) => {
    return PROJECT_STATUSES[status] || { label: status, color: '#999' };
  };