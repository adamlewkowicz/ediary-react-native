import React, { useState, useMemo } from 'react';
import { Meal } from '../../database/entities';
import { useSelector } from 'react-redux';
import { Selectors } from '../../store';
import { MacroElements } from '../../types';
import styled from 'styled-components/native';
import { MACRO } from '../../common/consts';
import { useFocusEffect } from '@react-navigation/native';
import * as Utils from '../../utils';
import {
  H1,
  H3,
  MacroConsumptionInfo,
  DiarySummaryChart,
} from '../../components';

export const DiarySummaryScreen = () => {
  const [macroSummary, setMacroSummary] = useState<MacroElements>(() => ({ ...MACRO }));
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const userMacroNeeds = useSelector(Selectors.getUserMacroNeeds);
  const todayDay = useSelector(Selectors.getAppDay);

  async function handleMacroSummaryFetch() {
    const result = await Meal.getMacroSummary(todayDay);
    const nextHistoryRecords = result.data.map(record => ({
      value: record.kcal,
      date: new Date(record.day as any)
    }));

    setMacroSummary(result.average);
    setHistoryRecords(nextHistoryRecords);
  }

  useFocusEffect(() => {
    handleMacroSummaryFetch();
  });

  const macroNeeds = useMemo(() => 
    Utils.calculateMacroNeeds(macroSummary, userMacroNeeds),
    [macroSummary, userMacroNeeds] 
  );

  return (
    <Container>
      <Header>Podsumowanie</Header>
      <Description>Dzienne spożycie kalorii</Description>
      <DiarySummaryChart
        dateFormat={CHART_DATE_FORMAT}
        data={historyRecords}
      />
      <Header>Makroskładniki</Header>
      <Description>Średnie dzienne spożycie makroskładników</Description>
      <MacroConsumptionInfo
        title="Węglowodany"
        unit="g"
        value={macroSummary.carbs}
        macroNeed={macroNeeds.carbs}
      />
      <MacroConsumptionInfo
        title="Białko"
        unit="g"
        value={macroSummary.prots}
        macroNeed={macroNeeds.prots}
      />
      <MacroConsumptionInfo
        title="Tłuszcze"
        unit="g"
        value={macroSummary.fats}
        macroNeed={macroNeeds.fats}
      />
      <MacroConsumptionInfo
        title="Kalorie"
        unit="kcal"
        value={macroSummary.kcal}
        macroNeed={macroNeeds.kcal}
      />
    </Container>
  );
}

const Header = styled(H1)`
  margin-top: ${props => props.theme.spacing.small};
`

const Description = styled(H3)`
  margin: 0 0 10px 0;
  color: ${props => props.theme.color.tertiary};
`

const Container = styled.ScrollView`
  padding-horizontal: ${props => props.theme.spacing.small};
  background: ${props => props.theme.color.primaryLight};
`

const CHART_DATE_FORMAT = 'ddd D/M';

type HistoryRecord = {
  value: number
  date: Date
}