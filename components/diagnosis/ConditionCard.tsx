import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, LAYOUT } from '../../constants';
import { DIAGNOSIS_TEXT } from '../../constants/diagnosisConstants';
import { toPersianNumber } from '../../utils/diagnosisUtils';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface ConditionCardProps {
  condition: {
    id: string;
    name: string;
    probability: number;
    severity: string;
    description: string;
    color: string;
  };
  isTopCondition?: boolean;
  onPress?: (id: string) => void;
}

const ConditionCard: React.FC<ConditionCardProps> = ({
  condition,
  isTopCondition = false,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(isTopCondition);
  const [animationValue] = useState(new Animated.Value(0));
  
  // Animation config for smooth expansion/collapse
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    Animated.timing(animationValue, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  // Format the probability as Persian number
  const formattedProbability = toPersianNumber(condition.probability);
  
  // Calculate the max width of the probability bar
  const maxBarWidth = 80; // from DIAGNOSIS_UI.MAX_PROBABILITY_BAR_WIDTH
  const barWidth = (condition.probability / 100) * maxBarWidth;
  
  // Calculate the rotation for the arrow
  const arrowRotation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[
      styles.container,
      isTopCondition && styles.topConditionContainer,
    ]}>
      {/* Card Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.titleContainer}>
          <Text style={[
            styles.conditionName,
            isTopCondition && styles.topConditionName,
          ]}>
            {condition.name}
          </Text>
          
          <View style={styles.probabilityContainer}>
            <Text style={styles.probabilityLabel}>
              احتمال:
            </Text>
            <Text style={[styles.probabilityValue, { color: condition.color }]}>
              {formattedProbability}٪
            </Text>
            
            <View style={styles.probabilityBarContainer}>
              <View
                style={[
                  styles.probabilityBar,
                  { width: barWidth, backgroundColor: condition.color },
                ]}
              />
            </View>
          </View>
        </View>
        
        <Animated.View
          style={[
            styles.arrowContainer,
            { transform: [{ rotate: arrowRotation }] },
          ]}
        >
          <FontAwesome5
            name="chevron-down"
            size={16}
            color={COLORS.textSecondary}
          />
        </Animated.View>
      </TouchableOpacity>
      
      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.description}>
            {condition.description}
          </Text>
          
          {/* View Details Button */}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => onPress && onPress(condition.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.detailsButtonText}>
              {DIAGNOSIS_TEXT.VIEW_DETAILS}
            </Text>
            <FontAwesome5
              name="arrow-left"
              size={14}
              color={COLORS.primary}
              style={styles.detailsButtonIcon}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: LAYOUT.borderRadius,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  topConditionContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  topConditionName: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  probabilityLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
    textAlign: 'right',
  },
  probabilityValue: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
    textAlign: 'right',
  },
  probabilityBarContainer: {
    width: 80,
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  probabilityBar: {
    height: '100%',
    borderRadius: 3,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginBottom: 16,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  detailsButtonIcon: {
    marginRight: 8,
  },
});

export default ConditionCard; 