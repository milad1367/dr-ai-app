// Utility functions for diagnosis calculations and processing

/**
 * Get the color based on probability value
 * @param {number} probability - Probability value (0-100)
 * @returns {string} - Color code
 */
export const getProbabilityColor = (probability) => {
  if (probability >= 70) {
    return '#F44336'; // High (red)
  } else if (probability >= 40) {
    return '#FFC107'; // Medium (yellow)
  } else {
    return '#4CAF50'; // Low (green)
  }
};

/**
 * Get the severity level label in Persian
 * @param {string} severity - Severity level (LOW, MEDIUM, HIGH)
 * @returns {string} - Persian label
 */
export const getSeverityLabel = (severity) => {
  const severityMap = {
    LOW: 'خفیف',
    MEDIUM: 'متوسط',
    HIGH: 'شدید',
  };
  
  return severityMap[severity] || severityMap.LOW;
};

/**
 * Get the color based on severity level
 * @param {string} severity - Severity level (LOW, MEDIUM, HIGH)
 * @returns {string} - Color code
 */
export const getSeverityColor = (severity) => {
  const colorMap = {
    LOW: '#4CAF50',     // Green
    MEDIUM: '#FFC107',  // Yellow
    HIGH: '#F44336',    // Red
  };
  
  return colorMap[severity] || colorMap.LOW;
};

/**
 * Format number to Persian digits
 * @param {number} num - Number to format
 * @returns {string} - Formatted number in Persian
 */
export const toPersianNumber = (num) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
};

/**
 * Calculate overall diagnosis confidence based on conditions
 * @param {Array} conditions - Array of medical conditions with probabilities
 * @returns {number} - Overall confidence (0-100)
 */
export const calculateOverallConfidence = (conditions) => {
  if (!conditions || conditions.length === 0) return 0;
  
  // Get highest probability condition
  const highestProbability = Math.max(...conditions.map(c => c.probability));
  
  // Calculate weighted average of top 2 conditions if possible
  if (conditions.length > 1) {
    const sortedConditions = [...conditions].sort((a, b) => b.probability - a.probability);
    const topTwo = sortedConditions.slice(0, 2);
    const weightedSum = topTwo.reduce((sum, c) => sum + c.probability, 0);
    const weightFactor = 0.7; // Primary condition is weighted more heavily
    
    return Math.min(
      Math.round(
        highestProbability * weightFactor + 
        (weightedSum - highestProbability) * (1 - weightFactor)
      ),
      100
    );
  }
  
  return highestProbability;
};

/**
 * Filter treatments relevant to a specific condition
 * @param {string} conditionId - ID of the condition
 * @param {Array} allTreatments - All available treatments
 * @returns {Array} - Filtered treatments for the condition
 */
export const getTreatmentsForCondition = (conditionId, allTreatments) => {
  if (!allTreatments) return [];
  
  return allTreatments.filter(treatment => 
    treatment.forConditions && treatment.forConditions.includes(conditionId)
  );
};

/**
 * Get symptoms related to a specific condition
 * @param {string} conditionId - ID of the condition
 * @param {Array} allSymptoms - All identified symptoms
 * @returns {Array} - Filtered symptoms for the condition
 */
export const getSymptomsForCondition = (conditionId, allSymptoms) => {
  if (!allSymptoms) return [];
  
  return allSymptoms.filter(symptom => 
    symptom.relatedConditions && symptom.relatedConditions.includes(conditionId)
  );
}; 