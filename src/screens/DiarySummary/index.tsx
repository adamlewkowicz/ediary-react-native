import React, { useState } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { Title } from '../../components/Elements';
import { DiarySummaryChart } from '../../components/DiarySummaryChart';

interface DiarySummaryProps extends NavigationScreenProps {}
export const DiarySummary = (props: DiarySummaryProps) => {
  const [macroHistory, setMacroHistory] = useState([]);

  return (
    <View>
      <Title>Podsumowanie</Title>
      <DiarySummaryChart data={macroHistory} />
    </View>
  );
}