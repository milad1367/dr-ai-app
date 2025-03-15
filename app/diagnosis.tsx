import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  SafeAreaView,
  SectionList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, LAYOUT } from '../constants';
import { DIAGNOSIS_TEXT } from '../constants/diagnosisConstants';
import DiagnosisHeader from '../components/diagnosis/DiagnosisHeader';
import CircularProgress from '../components/diagnosis/CircularProgress';
import ConditionCard from '../components/diagnosis/ConditionCard';
import SymptomItem from '../components/diagnosis/SymptomItem';
import TreatmentCard from '../components/diagnosis/TreatmentCard';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import { getDiagnosisResults, scheduleDoctorAppointment } from '../services/diagnosisService';
import { toPersianNumber } from '../utils/diagnosisUtils';
import * as Haptics from 'expo-haptics';

// Add type interfaces for the data
interface Symptom {
  id: string;
  name: string;
  severity: string;
  duration: string;
  relatedConditions: string[];
}

interface Condition {
  id: string;
  name: string;
  probability: number;
  severity: string;
  description: string;
  urgency: string;
  color: string;
}

interface Treatment {
  id: string;
  name: string;
  description: string;
  forConditions: string[];
}

interface DiagnosisData {
  diagnosisId: string;
  timestamp: string;
  overallConfidence: number;
  conditions: Condition[];
  symptoms: Symptom[];
  treatments: Treatment[];
}

export default function DiagnosisScreen() {
  const [loading, setLoading] = useState(true);
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Fetch diagnosis data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get data from mock API
        const data = await getDiagnosisResults();
        setDiagnosisData(data);
        
        // Provide haptic feedback when results are ready
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Animate the content in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
        
        // Set loading state to false
        setLoading(false);
      } catch (error) {
        console.error('Error fetching diagnosis data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };
  
  // Handle talk to doctor button press
  const handleTalkToDoctor = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Schedule a mock appointment
      const appointment = await scheduleDoctorAppointment();
      console.log('Appointment scheduled:', appointment);
      
      // Navigate to a placeholder screen (would be implemented in a real app)
      router.push('/chat');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    }
  };
  
  // Handle condition card press
  const handleConditionPress = (id: string) => {
    // This would navigate to a condition details screen in a complete app
    console.log('Condition pressed:', id);
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Render loading state
  if (loading || !diagnosisData) {
    return (
      <SafeAreaView style={styles.container}>
        <DiagnosisHeader onBackPress={handleBackPress} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            در حال آماده سازی نتایج...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <View style={styles.container}>
      <DiagnosisHeader onBackPress={handleBackPress} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated content container */}
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Confidence Circle */}
          <View style={styles.confidenceContainer}>
            <CircularProgress
              percentage={diagnosisData.overallConfidence}
              size={140}
              strokeWidth={12}
              color={COLORS.primary}
              label={DIAGNOSIS_TEXT.DIAGNOSIS_CONFIDENCE}
            />
            <Text style={styles.confidenceExplanation}>
              {DIAGNOSIS_TEXT.CONFIDENCE_EXPLANATION}
            </Text>
          </View>
          
          {/* Conditions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {DIAGNOSIS_TEXT.POSSIBLE_CONDITIONS}
            </Text>
            
            {diagnosisData.conditions.map((condition: Condition, index: number) => (
              <ConditionCard
                key={condition.id}
                condition={condition}
                isTopCondition={index === 0}
                onPress={handleConditionPress}
              />
            ))}
          </View>
          
          {/* Symptoms Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {DIAGNOSIS_TEXT.SYMPTOMS}
            </Text>
            
            {diagnosisData.symptoms.map((symptom: Symptom) => (
              <SymptomItem key={symptom.id} symptom={symptom} />
            ))}
          </View>
          
          {/* Treatments Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {DIAGNOSIS_TEXT.RECOMMENDED_TREATMENTS}
            </Text>
            
            {diagnosisData.treatments
              .filter((_: Treatment, index: number) => index < 3)  // Limit to top 3 treatments
              .map((treatment: Treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
            ))}
          </View>
          
          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            {DIAGNOSIS_TEXT.DISCLAIMER}
          </Text>
        </Animated.View>
      </ScrollView>
      
      {/* Talk to Doctor Floating Button */}
      <FloatingActionButton
        label={DIAGNOSIS_TEXT.TALK_TO_DOCTOR}
        icon="user-md"
        onPress={handleTalkToDoctor}
        position="bottom-center"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.padding,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for the floating button
  },
  animatedContainer: {
    padding: LAYOUT.padding,
  },
  confidenceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  confidenceExplanation: {
    marginTop: 12,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.lightText,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
}); 