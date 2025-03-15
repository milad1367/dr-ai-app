import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, LAYOUT } from '../../constants';
import { getSeverityColor, getSeverityLabel } from '../../utils/diagnosisUtils';

interface SymptomItemProps {
  symptom: {
    id: string;
    name: string;
    severity: string;
    duration: string;
  };
}

const SymptomItem: React.FC<SymptomItemProps> = ({ symptom }) => {
  // Get the severity color and label
  const severityColor = getSeverityColor(symptom.severity);
  const severityLabel = getSeverityLabel(symptom.severity);
  
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.symptomName}>
          {symptom.name}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
            <Text style={styles.severityText}>
              {severityLabel}
            </Text>
          </View>
          
          <Text style={styles.durationText}>
            {symptom.duration}
          </Text>
        </View>
      </View>
      
      <View style={[styles.severityIndicator, { backgroundColor: severityColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: LAYOUT.borderRadiusSmall,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  symptomName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'right',
    marginBottom: 6,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  severityText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  severityIndicator: {
    width: 4,
    backgroundColor: COLORS.primary,
  },
});

export default SymptomItem; 