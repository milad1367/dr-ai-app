import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, LAYOUT } from '../../constants';
import { PROFILE_LAYOUT } from '../../constants/profileConstants';
import { formatDate, formatHealthStatus } from '../../utils/profileUtils';

interface ProfileInfoItemProps {
  icon: string;
  label: string;
  value: string | null;
  valueColor?: string;
  isLast?: boolean;
}

const ProfileInfoItem: React.FC<ProfileInfoItemProps> = ({
  icon,
  label,
  value,
  valueColor,
  isLast = false
}) => {
  return (
    <View style={[
      styles.infoItem,
      !isLast && styles.itemBorder
    ]}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name={icon} size={18} color={COLORS.primary} solid />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={[
          styles.itemValue,
          valueColor && { color: valueColor }
        ]}>
          {value || '—'}
        </Text>
      </View>
    </View>
  );
};

interface ProfileInfoCardProps {
  dateOfBirth: string | null;
  lastCheckupDate: string | null;
  healthStatus: string;
}

// Type definition for the return value of formatHealthStatus
interface HealthStatusFormatted {
  text: string;
  color: string;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  dateOfBirth,
  lastCheckupDate,
  healthStatus
}) => {
  const formattedBirthDate = formatDate(dateOfBirth || '');
  const formattedCheckupDate = formatDate(lastCheckupDate || '');
  const { text: statusText, color: statusColor } = formatHealthStatus(healthStatus) as HealthStatusFormatted;
  
  return (
    <View style={styles.container}>
      <ProfileInfoItem 
        icon="calendar-alt" 
        label="تاریخ تولد" 
        value={formattedBirthDate}
      />
      <ProfileInfoItem 
        icon="clinic-medical" 
        label="آخرین معاینه" 
        value={formattedCheckupDate}
      />
      <ProfileInfoItem 
        icon="heartbeat" 
        label="وضعیت سلامتی" 
        value={statusText}
        valueColor={statusColor}
        isLast={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: PROFILE_LAYOUT.CARD_BORDER_RADIUS,
    marginVertical: PROFILE_LAYOUT.SECTION_MARGIN,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PROFILE_LAYOUT.ITEM_PADDING,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mediumGray,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
    // Support RTL layout
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  itemLabel: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 4,
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  itemValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
});

export default ProfileInfoCard; 