import React, { useState, useEffect, useMemo } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { Title } from '../../components/Elements';
import { DiarySummaryChart } from '../../components/DiarySummaryChart';
import { Meal } from '../../database/entities';
import { useSelector } from 'react-redux';
import { StoreState } from '../../store';
import { GetMacroSummaryResult } from '../../database/entities/Meal/types';

interface DiarySummaryProps extends NavigationScreenProps {}
export const DiarySummary = (props: DiarySummaryProps) => {
  const appDateDay = useSelector((state: StoreState) => state.application.day);
  const [macroSummary, setMacroSummary] = useState<GetMacroSummaryResult[]>([]);

  useEffect(() => {
    Meal.getMacroSummary(appDateDay)
      .then(result => setMacroSummary(result))
      .catch(console.error);
  }, [appDateDay]);

  const summaryValues = useMemo(() =>
    macroSummary.map(record => record.kcal),
    [macroSummary]
  );
  const summaryLabels = useMemo(() => 
    macroSummary.map(record => record.day),
    [macroSummary]
  );

  return (
    <View>
      <Title>Podsumowanie</Title>
      <DiarySummaryChart
        values={summaryValues}
        labels={summaryLabels}
      />
    </View>
  );
}