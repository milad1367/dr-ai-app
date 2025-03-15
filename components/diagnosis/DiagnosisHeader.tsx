import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, LAYOUT } from '../../constants';
import { DIAGNOSIS_TEXT } from '../../constants/diagnosisConstants';
import { LinearGradient } from 'expo-linear-gradient';

interface DiagnosisHeaderProps {
  onBackPress: () => void;
}

const DiagnosisHeader: React.FC<DiagnosisHeaderProps> = ({ onBackPress }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.primary}
          translucent={false}
        />
        
        <View style={styles.container}>
          {/* Left side with back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome5
              name="arrow-right"
              size={18}
              color={COLORS.white}
            />
          </TouchableOpacity>
          
          {/* Title */}
          <Text style={styles.title}>
            {DIAGNOSIS_TEXT.RESULTS_TITLE}
          </Text>
          
          {/* Right side spacer for balance */}
          <View style={styles.rightSpacer} />
        </View>
        
        {/* Medical icon pattern for visual interest */}
        <View style={styles.patternContainer}>
          {['heartbeat', 'pills', 'stethoscope', 'prescription'].map((icon, index) => (
            <FontAwesome5
              key={index}
              name={icon}
              size={16}
              color="rgba(255, 255, 255, 0.1)"
              style={[
                styles.patternIcon,
                { 
                  top: 10 + (index * 15) % 30,
                  right: 10 + (index * 25) % 100,
                }
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primary,
  },
  gradient: {
    paddingBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.padding,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  rightSpacer: {
    width: 40,
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  patternIcon: {
    position: 'absolute',
  },
});

export default DiagnosisHeader; 