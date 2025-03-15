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
  
  // Start the pulse animation
  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1500,
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) onBackPress();
  };
  
  const handleMenuPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Menu functionality would go here
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#2C6BED', '#1850C4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.headerPattern}>
          {/* Header pattern dots for visual interest */}
          {[...Array(6)].map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.patternDot,
                {
                  top: 15 + (index % 3) * 25,
                  left: 20 + Math.floor(index / 3) * 100,
                  opacity: 0.07 - (index * 0.01)
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
              activeOpacity={0.7}
            >
              <View style={styles.iconBackground}>
                <FontAwesome5 
                  name="arrow-right" 
                  size={CHAT_STYLES.HEADER_ICON_SIZE - 2} 
                  color={COLORS.white} 
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
                  size={CHAT_STYLES.HEADER_ICON_SIZE} 
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
                  { opacity: Animated.multiply(statusOpacity, 0.7) }
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
                    { opacity: pulseAnim }
                  ]} 
                />
                <Text style={styles.statusText}>آنلاین</Text>
              </Animated.View>
            </View>
          </View>
          
          {/* Menu Button */}
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.7}
            onPress={handleMenuPress}
          >
            <View style={styles.iconBackground}>
              <FontAwesome5 
                name="ellipsis-v" 
                size={CHAT_STYLES.HEADER_ICON_SIZE - 2} 
                color={COLORS.white} 
              />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.gradientStart,
    zIndex: 10,
  },
  gradient: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    position: 'relative',
    zIndex: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: CHAT_STYLES.HEADER_PADDING_VERTICAL,
    paddingHorizontal: 16,
    height: CHAT_STYLES.HEADER_HEIGHT,
  },
  backButton: {
    padding: 4,
  },
  iconBackground: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  doctorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 16,
  },
  avatarInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
  },
  innerGlow: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  statusRing: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
  },
  infoContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginLeft: 6,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'right',
    fontWeight: '500',
  },
  menuButton: {
    padding: 4,
  },
});

export default ChatHeader; 