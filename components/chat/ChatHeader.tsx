import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Platform,
  I18nManager,
} from 'react-native';
import { COLORS } from '../../constants';
import { CHAT_TEXT } from '../../constants/chatConstants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_STYLES, getShadow } from './ChatStyles';
import * as Haptics from 'expo-haptics';

// Updated medical teal/blue colors
const MEDICAL_COLORS = {
  primary: '#00A8B5', // Teal primary color
  secondary: '#0078A8', // Deeper blue secondary color
  light: '#E5F8FA', // Very light teal for backgrounds
  highlight: '#00C6D4', // Bright teal for highlights
  text: '#2A4054', // Dark blue-gray for text
  background: '#FFFFFF', // Clean white background
};

interface ChatHeaderProps {
  onBackPress?: () => void;
  title?: string;
  isRTL?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onBackPress,
  title = "🩺 چت با دکتر هوش مصنوعی",
  isRTL = true
}) => {
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
          colors={[MEDICAL_COLORS.primary, MEDICAL_COLORS.secondary]}
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
          
          <View style={[
            styles.container,
            isRTL && styles.rtlContainer
          ]}>
            {/* Back button - in RTL, this points left */}
            {onBackPress && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.6}
              >
                <View style={styles.iconBackground}>
                  <FontAwesome5 
                    name={isRTL ? "arrow-left" : "arrow-right"}
                    size={CHAT_STYLES.HEADER_ICON_SIZE - 1} 
                    color={COLORS.white} 
                    solid
                  />
                </View>
              </TouchableOpacity>
            )}
            
            {/* Title Section */}
            <View style={[
              styles.titleContainer,
              isRTL && styles.rtlTitleContainer
            ]}>
              <Text style={[
                styles.titleText,
                isRTL && styles.rtlText
              ]}>
                {title}
              </Text>
              
              {/* Online status indicator */}
              <Animated.View 
                style={[
                  styles.statusContainer,
                  isRTL && styles.rtlStatusContainer,
                  { opacity: statusOpacity }
                ]}
              >
                <Animated.View 
                  style={[
                    styles.statusDot,
                    { 
                      opacity: pulseAnim,
                      transform: [{ scale: Animated.add(0.8, Animated.multiply(pulseAnim, 0.4)) }]
                    }
                  ]} 
                />
                <Text style={[
                  styles.statusText,
                  isRTL && styles.rtlText
                ]}>
                  {isRTL ? "آنلاین" : "Online"}
                </Text>
              </Animated.View>
            </View>
            
            {/* Menu Button */}
            <TouchableOpacity
              style={styles.menuButton}
              activeOpacity={0.6}
              onPress={handleMenuPress}
            >
              <View style={styles.iconBackground}>
                <FontAwesome5 
                  name="ellipsis-v" 
                  size={CHAT_STYLES.HEADER_ICON_SIZE - 1} 
                  color={COLORS.white} 
                  solid
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
    backgroundColor: MEDICAL_COLORS.primary,
    zIndex: 10,
  },
  gradient: {
    shadowColor: MEDICAL_COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 20,
    position: 'relative',
    zIndex: 10,
    borderBottomLeftRadius: 16,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: CHAT_STYLES.HEADER_PADDING_VERTICAL + 2,
    paddingHorizontal: 16,
  },
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 10,
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  rtlTitleContainer: {
    alignItems: 'flex-end',
    marginLeft: 0,
    marginRight: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 2,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rtlStatusContainer: {
    flexDirection: 'row-reverse',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4AE66E',
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuButton: {
    padding: 6,
  },
});

export default ChatHeader; 