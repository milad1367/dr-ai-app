// Profile Utils for dr-ai app
// Contains reusable functions for profile-related operations

/**
 * Formats date from ISO string to localized display format
 * @param {string} dateString - ISO date string
 * @param {boolean} useShortFormat - Whether to use short format (MM/DD/YYYY)
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, useShortFormat = false) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // For Persian display, we would ideally use a proper date library
    // like moment-jalaali to convert to Persian calendar
    // For MVP, we'll use a simple formatter
    
    if (useShortFormat) {
      // Format as MM/DD/YYYY
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    
    // Format with Persian month names (simplified for MVP)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    return `${year}/${month}/${day}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || '';
  }
};

/**
 * Gets initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  const nameParts = name.split(' ');
  
  // Handle single name
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  // Get first character of first and last name
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Calculate age from birthdate
 * @param {string} birthDateString - ISO date string of birth date
 * @returns {number} Age in years
 */
export const calculateAge = (birthDateString) => {
  if (!birthDateString) return null;
  
  try {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
};

/**
 * Format health status with appropriate styling
 * @param {string} status - Health status string
 * @returns {Object} Object with status text and color
 */
export const formatHealthStatus = (status) => {
  const statusMap = {
    'Normal': { text: 'وضعیت نرمال', color: '#4CAF50' },
    'Attention': { text: 'نیاز به توجه', color: '#FFC107' },
    'Critical': { text: 'وضعیت بحرانی', color: '#F44336' },
    'Review': { text: 'نیاز به بررسی', color: '#2196F3' }
  };
  
  return statusMap[status] || { text: status, color: '#757575' };
}; 