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

interface ChatHeaderProps {
  onBackPress?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onBackPress }) => {
  // Animated values for status pulse effect
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  
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
    
    animate();
    
    return () => {
      pulseAnim.stopAnimation();
    };
  }, []);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.overlayPattern} />
        
        <View style={styles.container}>
          {/* Back button */}
          {onBackPress && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <View style={styles.iconBackground}>
                <FontAwesome5 name="arrow-right" size={18} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          )}
          
          {/* AI Doctor Info */}
          <View style={styles.doctorInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarInner}>
                <FontAwesome5 name="robot" size={20} color={COLORS.white} solid />
              </View>
              
              {/* Animated status ring */}
              <Animated.View 
                style={[
                  styles.statusRing, 
                  { 
                    opacity: pulseAnim,
                    transform: [{ scale: pulseAnim }]
                  }
                ]} 
              />
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.doctorName}>{CHAT_TEXT.AI_NAME}</Text>
              <View style={styles.statusContainer}>
                <Animated.View 
                  style={[
                    styles.statusDot,
                    { opacity: pulseAnim }
                  ]} 
                />
                <Text style={styles.statusText}>آنلاین</Text>
              </View>
            </View>
          </View>
          
          {/* Menu Button */}
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            <View style={styles.iconBackground}>
              <FontAwesome5 name="ellipsis-v" size={18} color={COLORS.white} />
            </View>
          </TouchableOpacity>
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
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    position: 'relative',
    zIndex: 10,
  },
  overlayPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
  },
  statusRing: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
  },
  infoContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
    textAlign: 'right',
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
  },
  statusText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
  },
  menuButton: {
    padding: 4,
  },
});

export default ChatHeader; 