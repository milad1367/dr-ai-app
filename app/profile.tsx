import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  StatusBar, 
  ActivityIndicator,
  Animated,
  I18nManager,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, LAYOUT, TEXT } from '../constants';
import { PROFILE_TEXT, PROFILE_ANIMATION, PROFILE_LAYOUT } from '../constants/profileConstants';
import BottomTabBar from '../components/ui/BottomTabBar';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import ProfileInfoCard from '../components/profile/ProfileInfoCard';
import ProfileButton from '../components/profile/ProfileButton';
import { getProfileData } from '../services/profileService';
import { calculateAge } from '../utils/profileUtils';

// Define profile data type for TypeScript
interface ProfileData {
  id: string;
  name: string;
  age: number;
  dateOfBirth: string | null;
  lastCheckupDate: string | null;
  healthStatus: string;
  email: string;
  avatarUrl: string | null;
  medicalHistory: Array<{
    id: string;
    date: string;
    type: string;
    notes: string;
  }>;
}

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Animation references
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user profile data from the service
        const data = await getProfileData();
        setProfileData(data as ProfileData);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
    
    // Start animations in sequence
    Animated.sequence([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: PROFILE_ANIMATION.FADE_IN_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: PROFILE_ANIMATION.FADE_IN_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: PROFILE_ANIMATION.FADE_IN_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleEditProfile = () => {
    // For MVP, we'll just log that this would open a profile edit screen
    console.log('Open profile edit screen');
    // In a complete app, we would navigate to an edit profile screen
    // router.push('/profile/edit');
  };

  const handleViewMedicalHistory = () => {
    // For MVP, we'll just log that this would open a medical history screen
    console.log('Open medical history screen');
    // In a complete app, we would navigate to a medical history screen
    // router.push('/profile/medical-history');
  };

  // Calculate age from date of birth
  const age = profileData?.dateOfBirth ? calculateAge(profileData.dateOfBirth) : null;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>{PROFILE_TEXT.LOADING}</Text>
          </View>
        ) : (
          <>
            {/* Profile Header Section */}
            <Animated.View 
              style={[
                styles.headerContainer,
                { opacity: headerOpacity }
              ]}
            >
              <ProfileAvatar
                name={profileData?.name || ''}
                avatarUrl={profileData?.avatarUrl || null}
                showEditButton={true}
                onEditPress={handleEditProfile}
              />
              
              <Text style={styles.nameText}>
                {profileData?.name}
                {age && (
                  <Text style={styles.ageText}>
                    {" "}
                    <Text style={styles.ageDivider}>|</Text>
                    {" "}
                    {age} {PROFILE_TEXT.YEARS_OLD}
                  </Text>
                )}
              </Text>
            </Animated.View>
            
            {/* Profile Info Section */}
            <Animated.View style={{ opacity: contentOpacity }}>
              <ProfileInfoCard
                dateOfBirth={profileData?.dateOfBirth || null}
                lastCheckupDate={profileData?.lastCheckupDate || null}
                healthStatus={profileData?.healthStatus || 'Normal'}
              />
            </Animated.View>
            
            {/* Action Buttons */}
            <Animated.View 
              style={[
                styles.buttonsContainer,
                { opacity: buttonsOpacity }
              ]}
            >
              <ProfileButton
                text={PROFILE_TEXT.VIEW_MEDICAL_HISTORY}
                icon="notes-medical"
                onPress={handleViewMedicalHistory}
                isPrimary={true}
              />
              
              <ProfileButton
                text={PROFILE_TEXT.EDIT_PROFILE}
                icon="user-edit"
                onPress={handleEditProfile}
                isPrimary={false}
              />
            </Animated.View>
          </>
        )}
        
        {/* Extra space for bottom tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.padding,
    paddingBottom: 80, // Space for bottom tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    fontWeight: '500',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: PROFILE_LAYOUT.AVATAR_TOP_MARGIN,
    marginBottom: PROFILE_LAYOUT.SECTION_MARGIN,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.darkBlue,
    marginTop: 16,
    textAlign: 'center',
    // Support RTL layout
    writingDirection: 'rtl',
  },
  ageText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  ageDivider: {
    color: COLORS.lightText,
  },
  buttonsContainer: {
    marginTop: PROFILE_LAYOUT.SECTION_MARGIN / 2,
  },
  bottomSpacer: {
    height: 20,
  },
}); 