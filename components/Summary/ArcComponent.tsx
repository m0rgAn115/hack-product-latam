// ArcComponent.tsx
import React from 'react';
import { View, Text } from 'react-native';
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
  return (
    <SegmentedArc
      segments={segments}
      fillValue={Math.round(fillValue)}
      isAnimated
      animationDelay={800}
      showArcRanges={false}
      radius={radius}
      filledArcWidth={8}
      emptyArcWidth={8}
      capInnerColor="#856FE5"
    >
      {(metaData: MetaData) => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontFamily: 'DMSans_400Regular', color: '#67677A' }}>
            {metaData.lastFilledSegment.data.label}
          </Text>
          <Text style={{ fontSize: 48, fontFamily: 'DMSans_700Bold' }}>
            {points}
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'DMSans_400Regular', color: '#6347EB' }}>
            {newPoints > 0
              ? `+${newPoints} puntos`
              : newPoints < 0
              ? `-${newPoints} puntos`
              : ''}
          </Text>
        </View>
      )}
    </SegmentedArc>
  );
};

export default ArcComponent;