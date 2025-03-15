import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Platform,
} from 'react-native';
import { COLORS } from '../../constants';
import { CHAT_TEXT } from '../../constants/chatConstants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_STYLES, getShadow } from './ChatStyles';
import * as Haptics from 'expo-haptics';

interface ChatHeaderProps {
  onBackPress?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onBackPress }) => {
  // Animated values for status pulse effect
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const statusOpacity = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.98)).current;
  
  // Start the pulse animation
  useEffect(() => {
    // Subtle scale animation for header
    Animated.spring(headerScale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    const animate = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200, // Faster pulse
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    
    // Fade in the status elements
    Animated.timing(statusOpacity, {
      toValue: 1,
      duration: CHAT_STYLES.ANIMATION_DURATION_SLOW,
      delay: 300,
      useNativeDriver: true,
    }).start();
    
    animate();
    
    return () => {
      pulseAnim.stopAnimation();
      statusOpacity.stopAnimation();
    };
  }, []);
  
  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Stronger feedback
    if (onBackPress) onBackPress();
  };
  
  const handleMenuPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Menu functionality would go here
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={{
        transform: [{ scale: headerScale }],
        width: '100%',
      }}>
        <LinearGradient
          colors={['#3C78F0', '#1A4DBF']} // Richer blue gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {/* Header background pattern */}
          <View style={styles.headerPattern}>
            {/* Header pattern dots for visual interest */}
            {[...Array(8)].map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.patternDot,
                  {
                    top: 12 + (index % 4) * 24,
                    left: 15 + Math.floor(index / 4) * 90,
                    opacity: 0.1 - (index * 0.01),
                    width: 35 + (index % 3) * 8,
                    height: 35 + (index % 3) * 8,
                  }
                ]} 
              />
            ))}
          </View>
          
          <View style={styles.container}>
            {/* Back button */}
            {onBackPress && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.6} // More responsive
              >
                <View style={styles.iconBackground}>
                  <FontAwesome5 
                    name="arrow-right" 
                    size={CHAT_STYLES.HEADER_ICON_SIZE - 1} 
                    color={COLORS.white} 
                    solid // Use solid icon for better visibility
                  />
                </View>
              </TouchableOpacity>
            )}
            
            {/* AI Doctor Info */}
            <View style={styles.doctorInfo}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarInner}>
                  <FontAwesome5 
                    name="robot" 
                    size={CHAT_STYLES.HEADER_ICON_SIZE + 2} // Larger icon 
                    color={COLORS.white} 
                    solid 
                  />
                </View>
                
                {/* Animated status ring */}
                <Animated.View 
                  style={[
                    styles.statusRing, 
                    { 
                      opacity: Animated.multiply(statusOpacity, pulseAnim),
                      transform: [{ scale: pulseAnim }]
                    }
                  ]} 
                />
                
                {/* Inner glow */}
                <Animated.View 
                  style={[
                    styles.innerGlow,
                    { opacity: Animated.multiply(statusOpacity, 0.85) } // More visible glow
                  ]} 
                />
              </View>
              
              <View style={styles.infoContainer}>
                <Text style={styles.doctorName}>{CHAT_TEXT.AI_NAME}</Text>
                <Animated.View 
                  style={[
                    styles.statusContainer,
                    { opacity: statusOpacity }
                  ]}
                >
                  <Animated.View 
                    style={[
                      styles.statusDot,
                      { 
                        opacity: pulseAnim,
                        transform: [{ scale: Animated.add(0.8, Animated.multiply(pulseAnim, 0.4)) }] // Add a pulse to the dot
                      }
                    ]} 
                  />
                  <Text style={styles.statusText}>آنلاین</Text>
                </Animated.View>
              </View>
            </View>
            
            {/* Menu Button */}
            <TouchableOpacity
              style={styles.menuButton}
              activeOpacity={0.6} // More responsive
              onPress={handleMenuPress}
            >
              <View style={styles.iconBackground}>
                <FontAwesome5 
                  name="ellipsis-v" 
                  size={CHAT_STYLES.HEADER_ICON_SIZE - 1} 
                  color={COLORS.white} 
                  solid // Use solid icon for better visibility
                />
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Bottom highlight for extra depth */}
          <View style={styles.bottomHighlight} />
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#3C78F0', // Match gradient start color
    zIndex: 10,
  },
  gradient: {
    shadowColor: '#1A3A80',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 20,
    position: 'relative',
    zIndex: 10,
    borderBottomLeftRadius: 16, // More pronounced rounding
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternDot: {
    position: 'absolute',
    borderRadius: 25,
    backgroundColor: COLORS.white,
  },
  bottomHighlight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Subtle highlight line at bottom
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: CHAT_STYLES.HEADER_PADDING_VERTICAL + 2, // Slightly more vertical padding
    paddingHorizontal: 16,
    height: CHAT_STYLES.HEADER_HEIGHT + 4, // Slightly taller header
  },
  backButton: {
    padding: 6, // Larger touch target
  },
  iconBackground: {
    width: 44, // Larger icon background
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.22)', // Slightly more opaque
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // More visible border
    ...Platform.select({
      ios: {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  doctorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14, // Adjusted spacing
  },
  avatarContainer: {
    width: 52, // Larger avatar container
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 16,
  },
  avatarInner: {
    width: 48, // Larger avatar
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Slightly more opaque
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.42)', // More visible border
    ...Platform.select({
      ios: {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6, // More visible shadow
        shadowRadius: 6,
      },
    }),
  },
  innerGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.18)', // More visible glow
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, // More intense glow
    shadowRadius: 12, // Larger glow radius
  },
  statusRing: {
    position: 'absolute',
    width: 62, // Larger ring
    height: 62,
    borderRadius: 31,
    borderWidth: 2.5, // Thicker border
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
    shadowColor: '#4CAF50', // Add glow to the ring
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  infoContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20, // Larger font size
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.25)', // More pronounced text shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: -0.3, // Tighter text for premium feel
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusDot: {
    width: 9, // Slightly larger dot
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#4CAF50',
    marginLeft: 6,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9, // More visible glow
    shadowRadius: 5,
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'right',
    fontWeight: '600', // Bolder text
    textShadowColor: 'rgba(0, 0, 0, 0.15)', // Add subtle text shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuButton: {
    padding: 6, // Larger touch target
  },
});

export default ChatHeader; 