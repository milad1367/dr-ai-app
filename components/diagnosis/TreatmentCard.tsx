import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, LAYOUT } from '../../constants';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface TreatmentCardProps {
  treatment: {
    id: string;
    name: string;
    description: string;
  };
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Toggle expansion with animation
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleExpanded}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <FontAwesome5
          name="prescription-bottle-alt"
          size={18}
          color={COLORS.primary}
          style={styles.icon}
        />
        <Text style={styles.treatmentName}>
          {treatment.name}
        </Text>
        <FontAwesome5
          name={expanded ? "chevron-up" : "chevron-down"}
          size={14}
          color={COLORS.textSecondary}
          style={styles.arrowIcon}
        />
      </View>
      
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.description}>
            {treatment.description}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: LAYOUT.borderRadiusSmall,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  icon: {
    marginLeft: 12,
  },
  treatmentName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'right',
  },
  arrowIcon: {
    marginRight: 6,
  },
  expandedContent: {
    padding: 12,
    paddingTop: 0,
    paddingRight: 42, // Align with text in header
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
});

export default TreatmentCard; 