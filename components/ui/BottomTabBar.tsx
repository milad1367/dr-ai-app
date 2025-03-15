import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Animated,
  useWindowDimensions, 
  I18nManager,
  Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, LAYOUT, TEXT } from '../../constants';
import { useRouter, usePathname } from 'expo-router';

interface TabItem {
  key: string;
  label: string;
  icon: string;
  route: "/" | "/chat" | "/profile" | "/diagnosis";
}

const tabItems: TabItem[] = [
  {
    key: 'home',
    label: TEXT.HOME,
    icon: 'home',
    route: '/',
  },
  {
    key: 'chat',
    label: TEXT.CHAT,
    icon: 'comment-medical',
    route: '/chat',
  },
  {
    key: 'diagnosis',
    label: TEXT.DIAGNOSIS || 'تشخیص',
    icon: 'heartbeat',
    route: '/diagnosis',
  },
  {
    key: 'profile',
    label: TEXT.PROFILE,
    icon: 'user',
    route: '/profile',
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BottomTabBar: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();

  const itemWidth = width / tabItems.length;

  // Configure right-to-left layout support
  const isRTL = I18nManager.isRTL;

  return (
    <View style={styles.container}>
      <BlurView intensity={Platform.OS === 'ios' ? 30 : 80} tint="light" style={styles.blurContainer}>
        <View style={styles.tabBarContainer}>
          {tabItems.map((item) => {
            const isActive = pathname === item.route;
            const tabScale = new Animated.Value(isActive ? 1 : 0.8);
            
            const onPress = () => {
              Animated.spring(tabScale, {
                toValue: 1,
                speed: 12,
                bounciness: 8,
                useNativeDriver: true,
              }).start();
              
              router.push(item.route);
            };

            return (
              <AnimatedPressable
                key={item.key}
                style={[
                  styles.tabItem,
                  { width: itemWidth },
                  { transform: [{ scale: tabScale }] }
                ]}
                onPress={onPress}
              >
                <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                  <FontAwesome5 
                    name={item.icon} 
                    size={20} 
                    color={isActive ? COLORS.white : COLORS.primary} 
                    solid 
                  />
                </View>
                <Text 
                  style={[
                    styles.label, 
                    isActive ? styles.activeLabel : styles.inactiveLabel
                  ]}
                >
                  {item.label}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    zIndex: 1,
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: LAYOUT.borderRadius,
    borderTopRightRadius: LAYOUT.borderRadius,
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.85)',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  activeIconContainer: {
    backgroundColor: COLORS.primary,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  inactiveLabel: {
    color: COLORS.lightText,
    fontWeight: '500',
  },
});

export default BottomTabBar; 