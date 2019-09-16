import React, { useState, useEffect, useMemo } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { Title } from '../../components/Elements';
import { DiarySummaryChart } from '../../components/DiarySummaryChart';
import { Meal } from '../../database/entities';
import { useSelector } from 'react-redux';
import { StoreState } from '../../store';
import { GetMacroHistoryResult } from '../../database/entities/Meal/types';
import dayjs from 'dayjs';
import { getDayFromDate } from '../../common/utils';
import { DateDay } from '../../types';

interface DiarySummaryProps extends NavigationScreenProps {}
export const DiarySummary = (props: DiarySummaryProps) => {
  const appDateDay = useSelector((state: StoreState) => state.application.day);
  const [dateDay, setDateDay] = useState<DateDay>(() => {
    const date = dayjs(appDateDay as any);
    return getDayFromDate(date);
  });
  const [macroHistory, setMacroHistory] = useState<GetMacroHistoryResult[]>([]);

  useEffect(() => {
    Meal.getMacroHistory(dateDay)
      .then(result => setMacroHistory(result))
      .catch(console.error);
  }, [appDateDay]);

  const summaryValues = useMemo(() =>
    macroHistory.map(record => record.kcal),
    [macroHistory]
  );
  const summaryLabels = useMemo(() => 
    macroHistory.map(record => record.day),
    [macroHistory]
  );

  return (
    <View>
      <Title>Podsumowanie</Title>
      <DiarySummaryChart
        records={macroHistory.map((record, index) => ({
          value: record.kcal,
          label: new Date(record.day as any),
        }))}
        values={summaryValues}
        labels={summaryLabels}
      />
    </View>
  );
}