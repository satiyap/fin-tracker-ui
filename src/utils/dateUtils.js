import moment from 'moment';

/**
 * Format a date string to display format (DD/MM/YYYY)
 * 
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return moment(date).format('DD/MM/YYYY');
};

/**
 * Format a date string to display format with time (DD/MM/YYYY HH:mm)
 * 
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string with time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return moment(date).format('DD/MM/YYYY HH:mm');
};

/**
 * Format a date for API requests (ISO format)
 * 
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string in ISO format
 */
export const formatDateForApi = (date) => {
  if (!date) return null;
  return moment(date).toISOString();
};

/**
 * Get the start of day for a given date
 * 
 * @param {Date} date - The date
 * @returns {Date} Date representing the start of the day
 */
export const getStartOfDay = (date) => {
  return moment(date).startOf('day').toDate();
};

/**
 * Get the end of day for a given date
 * 
 * @param {Date} date - The date
 * @returns {Date} Date representing the end of the day
 */
export const getEndOfDay = (date) => {
  return moment(date).endOf('day').toDate();
};

/**
 * Get the start of month for a given date
 * 
 * @param {Date} date - The date
 * @returns {Date} Date representing the start of the month
 */
export const getStartOfMonth = (date) => {
  return moment(date).startOf('month').toDate();
};

/**
 * Get the end of month for a given date
 * 
 * @param {Date} date - The date
 * @returns {Date} Date representing the end of the month
 */
export const getEndOfMonth = (date) => {
  return moment(date).endOf('month').toDate();
};

/**
 * Get date range for predefined periods
 * 
 * @param {string} period - The period (today, yesterday, thisWeek, thisMonth, lastMonth)
 * @returns {Object} Object with start and end dates
 */
export const getDateRangeForPeriod = (period) => {
  const now = moment();
  
  switch (period) {
    case 'today':
      return {
        start: now.startOf('day').toDate(),
        end: now.endOf('day').toDate()
      };
    case 'yesterday':
      return {
        start: now.subtract(1, 'days').startOf('day').toDate(),
        end: now.endOf('day').toDate()
      };
    case 'thisWeek':
      return {
        start: moment().startOf('week').toDate(),
        end: moment().endOf('week').toDate()
      };
    case 'thisMonth':
      return {
        start: moment().startOf('month').toDate(),
        end: moment().endOf('month').toDate()
      };
    case 'lastMonth':
      return {
        start: moment().subtract(1, 'months').startOf('month').toDate(),
        end: moment().subtract(1, 'months').endOf('month').toDate()
      };
    default:
      return {
        start: null,
        end: null
      };
  }
};