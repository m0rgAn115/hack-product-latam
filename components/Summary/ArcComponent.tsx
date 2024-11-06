// ArcComponent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SegmentedArc } from '@shipt/segmented-arc-for-react-native';

interface ArcComponentProps {
  segments: any[];
  fillValue: number;
  points: number;
  newPoints: number;
  radius: number;
}

interface MetaData {
  lastFilledSegment: {
    data: {
      label: string;
    };
  };
  fillValue: number;
}

const ArcComponent: React.FC<ArcComponentProps> = ({
  segments,
  fillValue,
  points,
  newPoints,
  radius,
}) => {
  const formattedFillValue = Math.round(fillValue);
  const pointsText = newPoints !== 0 ? `${newPoints > 0 ? '+' : ''}${newPoints} puntos` : '';
  
  return (
    <SegmentedArc
      segments={segments}
      fillValue={formattedFillValue}
      isAnimated
      animationDelay={800}
      showArcRanges={false}
      radius={radius}
      filledArcWidth={8}
      emptyArcWidth={8}
      capInnerColor="#856FE5"
    >
      {(metaData: MetaData) => (
        <View style={styles.centeredContainer}>
          <Text style={styles.segmentLabel}>
            {metaData.lastFilledSegment.data.label}
          </Text>
          <Text style={styles.points}>
            {points}
          </Text>
          {pointsText && (
            <Text style={styles.newPoints}>
              {pointsText}
            </Text>
          )}
        </View>
      )}
    </SegmentedArc>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentLabel: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
    color: '#67677A',
    opacity: 0.8,
  },
  points: {
    fontSize: 48,
    fontFamily: 'DMSans_700Bold',
  },
  newPoints: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: '#6347EB',
  },
});

export default ArcComponent;
