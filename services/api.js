// Mock API service for dr-ai app

/**
 * Mock function to get user information
 * Will be replaced with actual API call in the future
 */
export const getUserInfo = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: '12345',
    name: 'علی',
    profilePicture: null, // Will be replaced with actual image
    lastConsultation: new Date('2023-06-15'),
    hasActiveSubscription: true,
  };
};

/**
 * Mock function to get recommended doctors
 */
export const getRecommendedDoctors = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'doc1',
      name: 'دکتر محمدی',
      specialty: 'قلب و عروق',
      rating: 4.8,
      available: true,
    },
    {
      id: 'doc2',
      name: 'دکتر رضایی',
      specialty: 'داخلی',
      rating: 4.9,
      available: false,
    },
    {
      id: 'doc3',
      name: 'دکتر کریمی',
      specialty: 'پوست',
      rating: 4.7,
      available: true,
    }
  ];
}; 