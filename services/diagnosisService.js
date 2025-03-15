// Mock API service for diagnosis data
import { 
  MEDICAL_CONDITIONS, 
  IDENTIFIED_SYMPTOMS, 
  RECOMMENDED_TREATMENTS 
} from '../constants/diagnosisConstants';
import { calculateOverallConfidence } from '../utils/diagnosisUtils';

// Simulated network delay
const MOCK_API_DELAY = 1500;

/**
 * Get diagnosis results (mock API call)
 * @returns {Promise} - Promise that resolves with diagnosis data
 */
export const getDiagnosisResults = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  // Calculate overall confidence based on the conditions
  const overallConfidence = calculateOverallConfidence(MEDICAL_CONDITIONS);
  
  // Return mock diagnosis data
  return {
    diagnosisId: 'diag_' + Date.now(),
    timestamp: new Date().toISOString(),
    overallConfidence,
    conditions: MEDICAL_CONDITIONS,
    symptoms: IDENTIFIED_SYMPTOMS,
    treatments: RECOMMENDED_TREATMENTS,
  };
};

/**
 * Get condition details (mock API call)
 * @param {string} conditionId - ID of the condition to retrieve
 * @returns {Promise} - Promise that resolves with condition details
 */
export const getConditionDetails = async (conditionId) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  
  // Find the requested condition
  const condition = MEDICAL_CONDITIONS.find(c => c.id === conditionId);
  
  if (!condition) {
    throw new Error('Condition not found');
  }
  
  // Find related symptoms
  const relatedSymptoms = IDENTIFIED_SYMPTOMS.filter(
    symptom => symptom.relatedConditions.includes(conditionId)
  );
  
  // Find recommended treatments
  const recommendedTreatments = RECOMMENDED_TREATMENTS.filter(
    treatment => treatment.forConditions.includes(conditionId)
  );
  
  return {
    ...condition,
    relatedSymptoms,
    recommendedTreatments,
    // Add more detailed data for this specific condition
    additionalInfo: {
      prevalence: condition.probability > 70 ? 'شایع' : 'نسبتاً شایع',
      typicalDuration: condition.severity === 'LOW' ? '۵-۷ روز' : '۷-۱۴ روز',
      contagious: condition.id === 'condition_1' || condition.id === 'condition_2',
      recommendedTests: [
        'معاینه فیزیکی',
        condition.probability > 50 ? 'آزمایش خون' : null,
        condition.id === 'condition_4' ? 'تصویربرداری سینوس' : null,
      ].filter(Boolean),
    }
  };
};

/**
 * Schedule a doctor appointment (mock API call)
 * @param {string} specialtyId - ID of medical specialty
 * @returns {Promise} - Promise that resolves with appointment details
 */
export const scheduleDoctorAppointment = async (specialtyId = 'general') => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  // Mock appointment details
  return {
    appointmentId: 'appt_' + Date.now(),
    doctor: {
      name: 'دکتر علی محمدی',
      specialty: 'پزشک عمومی',
      rating: 4.8,
    },
    scheduledTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    location: 'مطب دکتر محمدی، خیابان ولیعصر',
    virtualOption: true,
    preparationNotes: 'لطفاً ۱۵ دقیقه قبل از وقت مقرر در محل حاضر شوید.',
  };
}; 