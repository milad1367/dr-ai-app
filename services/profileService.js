// Profile Service for dr-ai app
// Handles fetching, updating, and managing user profile data

/**
 * Mock user profile data for MVP
 * In a real app, this would be fetched from an API or local storage
 */
const mockProfileData = {
  id: 'user123',
  name: 'علی رضایی',
  age: 32,
  dateOfBirth: '1990-05-15',
  lastCheckupDate: '2023-10-25',
  healthStatus: 'Normal',
  email: 'ali@example.com',
  avatarUrl: null, // Will be null for MVP, we'll show initials instead
  medicalHistory: [
    { id: 'hist1', date: '2023-10-25', type: 'General Checkup', notes: 'All vitals normal' },
    { id: 'hist2', date: '2023-08-12', type: 'Blood Test', notes: 'Cholesterol slightly elevated' },
    { id: 'hist3', date: '2023-03-04', type: 'Vaccination', notes: 'Flu vaccine administered' },
  ]
};

/**
 * Get user profile data
 * @returns {Promise} Promise that resolves to user profile data
 */
export const getProfileData = async () => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProfileData);
    }, 300);
  });
};

/**
 * Update user profile data
 * @param {Object} updatedData - Object containing updated profile fields
 * @returns {Promise} Promise that resolves to updated user profile
 */
export const updateProfileData = async (updatedData) => {
  // In a real app, this would send the updated data to an API
  // For MVP, we'll just merge the updates with our mock data
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedProfile = { ...mockProfileData, ...updatedData };
      resolve(updatedProfile);
    }, 500);
  });
};

/**
 * Upload profile picture
 * @param {Object} imageData - Image data to upload
 * @returns {Promise} Promise that resolves to updated avatar URL
 */
export const uploadProfilePicture = async (imageData) => {
  // This would normally upload the image to storage and return the URL
  // For MVP, we'll just simulate the process
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a URL being returned
      const fakeAvatarUrl = 'https://example.com/avatar.jpg';
      resolve({ avatarUrl: fakeAvatarUrl });
    }, 1000);
  });
};

/**
 * Get user medical history
 * @returns {Promise} Promise that resolves to user medical history
 */
export const getMedicalHistory = async () => {
  // For MVP, we'll just return the mock medical history
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProfileData.medicalHistory);
    }, 300);
  });
}; 