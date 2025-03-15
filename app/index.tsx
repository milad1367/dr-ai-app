import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Animated, 
  I18nManager,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, LAYOUT, TEXT } from '../constants';
import GradientButton from '../components/ui/GradientButton';
import BackgroundAnimation from '../components/ui/BackgroundAnimation';
import BottomTabBar from '../components/ui/BottomTabBar';
import * as Haptics from 'expo-haptics';
import { getUserInfo } from '../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const buttonScale = useRef(new Animated.Value(1)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  
  // Ensuring RTL support for Persian language
  useEffect(() => {
    if (!I18nManager.isRTL) {
      // This would normally change the app's direction, but for demo we'll keep it LTR
      // I18nManager.forceRTL(true);
    }
    
    // Animate the welcome message and button in sequence
    Animated.sequence([
      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const userData = await getUserInfo();
        // We could use the user data here if needed
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleStartConsultation = () => {
    // Provide haptic feedback for button press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Navigate to chat screen
    router.push('/chat');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Background animation */}
      <BackgroundAnimation />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome message with RTL support */}
        <View style={styles.welcomeContainer}>
          <Animated.Text 
            style={[
              styles.welcomeText, 
              { opacity: welcomeOpacity, transform: [{ translateY: welcomeOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}] }
            ]}
          >
            {TEXT.WELCOME_MESSAGE}
          </Animated.Text>
        </View>
        
        {/* Start consultation button */}
        <Animated.View 
          style={[
            styles.buttonContainer, 
            { 
              opacity: buttonOpacity, 
              transform: [{ 
                translateY: buttonOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0]
                }) 
              }] 
            }
          ]}
        >
          <GradientButton 
            text={TEXT.START_CONSULTATION}
            onPress={handleStartConsultation}
            isGlowing={true}
          />
        </Animated.View>
        
        {/* Space for future content */}
        <View style={styles.spacer} />
      </ScrollView>
      
      {/* Bottom Tab Navigation */}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: LAYOUT.padding,
    paddingBottom: 100, // Extra space for bottom tab bar
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.darkBlue,
    textAlign: 'center',
    lineHeight: 40,
    // Direction for RTL languages
    writingDirection: 'rtl',
  },
  buttonContainer: {
    paddingHorizontal: LAYOUT.padding,
    marginBottom: 40,
  },
  spacer: {
    flex: 1,
    minHeight: 100,
  },
});
