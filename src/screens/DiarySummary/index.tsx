import React, { useState, useMemo } from 'react';
import { H1, Text, Block, TitleSecondary } from '../../components/Elements';
import { DiarySummaryChart } from '../../components/DiarySummaryChart';
import { Meal } from '../../database/entities';
import { useSelector } from 'react-redux';
import { StoreState, Selectors } from '../../store';
import { calcMacroNeedsLeft } from '../../common/utils';
import { MacroElements, NavigationScreenProps } from '../../types';
import styled from 'styled-components/native';
import { MACRO_ELEMENTS } from '../../common/consts';
import { elementTitlesLong, baseMacro } from '../../common/helpers';
import { RatioInfo } from '../../components/RatioInfo';
import { DiarySummaryNavigationProp } from '../../navigation/MainStack';
import { useFocusEffect } from '@react-navigation/native';

interface DiarySummaryProps extends NavigationScreenProps<DiarySummaryNavigationProp> {}

export const DiarySummary = (props: DiarySummaryProps) => {
  const [macroSummary, setMacroSummary] = useState<MacroElements>(() => ({ ...baseMacro }));
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const macroNeeds = useSelector<StoreState, Selectors.MacroNeeds>(
    Selectors.macroNeeds
  );
  const todayDay = useSelector((state: StoreState) => state.application.todayDay);

  async function handleMacroSummaryFetch() {
    const result = await Meal.getMacroSummary(todayDay);
    setMacroSummary(result.average);
    setHistoryRecords(result.data.map(record => ({
      value: record.kcal,
      date: new Date(record.day as any)
    })));
  }

  useFocusEffect(() => {
    handleMacroSummaryFetch();
  });

  const macroNeedsLeft = useMemo(() => 
    calcMacroNeedsLeft(macroSummary, macroNeeds),
    [macroSummary, macroNeeds] 
  );

  return (
    <Container>
      <H1 margin="5px 0">Podsumowanie</H1>
      <TitleSecondary margin="0 0 10px 0">
        Dzienne spożycie kalorii
      </TitleSecondary>
      <DiarySummaryChart
        dateFormat="ddd D/M"
        data={historyRecords}
      />
      <H1 margin="5px 0">Makroskładniki</H1>
      <TitleSecondary margin="0 0 10px 0">
        Średnie dzienne spożycie
      </TitleSecondary>
      {MACRO_ELEMENTS.map(element => (
        <Block
          key={element}
          space="space-between"
          align="flex-end"
          marginVertical={12}
          accessibilityLabel="Średnia wartość makroskładniku"
        >
          <Text priority={0}>
            {elementTitlesLong[element]}{' '}
            ({element === 'kcal' ? 'kcal' : 'g'})
          </Text>
          <Block align="flex-end">
            <RatioInfo
              allowedDiff={15}
              ratio={macroNeedsLeft[element].ratio}
              value={macroNeedsLeft[element].diff}
              margin="0 8px 0 0"
              size="tiny"
            />
            <Text size="big" margin="0 5px 0 0">
              {Math.round(macroSummary[element])}
            </Text>
            <Text size="regular" priority={3}>
              / {macroNeeds[element]}
            </Text>
          </Block>
        </Block>
      ))}
    </Container>
  );
}

const Container = styled.ScrollView`
  padding: 15px;
  background: #fff;
  min-height: 100%;
`

type HistoryRecord = {
  value: number
  date: Date
}