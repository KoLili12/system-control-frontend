export const DEFECT_STATUSES = {
    registered: { label: 'Зарегистрирован', color: '#FF9800' },
    in_progress: { label: 'В работе', color: '#2196F3' },
    completed: { label: 'Завершен', color: '#4CAF50' },
  };
  
  export const DEFECT_PRIORITIES = {
    low: { label: 'Низкий', color: '#9E9E9E' },
    medium: { label: 'Средний', color: '#FFC107' },
    high: { label: 'Высокий', color: '#FF9800' },
    critical: { label: 'Критический', color: '#F44336' },
  };
  
  export const getDefectStatusInfo = (status) => {
    return DEFECT_STATUSES[status] || { label: status, color: '#999' };
  };
  
  export const getDefectPriorityInfo = (priority) => {
    return DEFECT_PRIORITIES[priority] || { label: priority, color: '#999' };
  };