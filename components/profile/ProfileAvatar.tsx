import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { AVATAR } from '../../constants/profileConstants';
import { getInitials } from '../../utils/profileUtils';

interface ProfileAvatarProps {
  name: string;
  avatarUrl: string | null;
  size?: number;
  showEditButton?: boolean;
  onEditPress?: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  name,
  avatarUrl,
  size = AVATAR.SIZE,
  showEditButton = false,
  onEditPress,
}) => {
  const avatarScale = useRef(new Animated.Value(0.8)).current;
  const editButtonOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animate avatar appearing
    Animated.spring(avatarScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    
    if (showEditButton) {
      Animated.timing(editButtonOpacity, {
        toValue: 1,
        duration: 300,
        delay: 400,
        useNativeDriver: true,
      }).start();
    }
  }, []);
  
  const initials = getInitials(name);
  
  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ scale: avatarScale }] }
    ]}>
      {avatarUrl ? (
        <Image 
          source={{ uri: avatarUrl }} 
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2 }
          ]}
          resizeMode="cover"
        />
      ) : (
        <View style={[
          styles.initialsContainer,
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            backgroundColor: AVATAR.DEFAULT_BG_COLOR,
          }
        ]}>
          <Text style={[
            styles.initials,
            { fontSize: size * 0.4 }
          ]}>
            {initials}
          </Text>
        </View>
      )}
      
      {showEditButton && (
        <Animated.View style={[
          styles.editButtonContainer,
          { 
            opacity: editButtonOpacity,
            right: size * 0.05,
            bottom: size * 0.05,
          }
        ]}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={onEditPress}
            activeOpacity={0.8}
          >
            <FontAwesome5 
              name="pencil-alt" 
              size={size * 0.15} 
              color={COLORS.white} 
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderWidth: AVATAR.BORDER_WIDTH,
    borderColor: COLORS.white,
    // Add shadow
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: AVATAR.BORDER_WIDTH,
    borderColor: COLORS.white,
    // Add shadow
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  initials: {
    color: COLORS.white,
    fontWeight: '700',
  },
  editButtonContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    // Add shadow
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default ProfileAvatar; 