import React, { useState, useMemo } from 'react';
import { Text, Block, TitleSecondary } from '../../components/legacy/Elements';
import { DiarySummaryChart } from '../../components/molecules/DiarySummaryChart';
import { Meal } from '../../database/entities';
import { useSelector } from 'react-redux';
import { Selectors } from '../../store';
import { MacroElements } from '../../types';
import styled from 'styled-components/native';
import { MACRO_ELEMENTS, MACRO } from '../../common/consts';
import { RatioInfo } from '../../components/legacy/RatioInfo';
import { useFocusEffect } from '@react-navigation/native';
import * as Utils from '../../utils';
import { H1 } from '../../components';

interface DiarySummaryScreenProps {}

export const DiarySummaryScreen = (props: DiarySummaryScreenProps) => {
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
      <Description>Średnie dzienne spożycie</Description>
      {MACRO_ELEMENTS.map(element => (
        <MacroElementContainer
          key={element}
          accessibilityLabel="Średnia wartość makroskładniku"
        >
          <Text priority={0}>
            {ELEMENT_TITLES[element]}{' '}
            ({element === 'kcal' ? 'kcal' : 'g'})
          </Text>
          <Block align="flex-end">
            <StyledRatioInfo
              allowedDiff={15}
              ratio={macroNeeds[element].percentage}
              value={macroNeeds[element].left}
            />
            <Text size="h2" margin="0 5px 0 0">
              {macroSummary[element].toFixed(0)}
            </Text>
            <Text size="regular" priority={3}>
              / {macroNeeds[element].needed.toFixed(0)}
            </Text>
          </Block>
        </MacroElementContainer>
      ))}
    </Container>
  );
}

const Header = styled(H1)`
  margin: 5px 0;
`

const Description = styled(TitleSecondary)`
  margin: 0 0 10px 0;
`

const Container = styled.ScrollView`
  padding: 15px;
  background: ${props => props.theme.color.primaryLight};
  min-height: 100%;
`

const MacroElementContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
`

const StyledRatioInfo = styled(RatioInfo)`
  margin: 0 8px 0 0;
  font-size: ${props => props.theme.fontSize.small};
`

const CHART_DATE_FORMAT = 'ddd D/M';

type HistoryRecord = {
  value: number
  date: Date
}

const ELEMENT_TITLES = {
  carbs: 'Węglowodany',
  prots: 'Białka',
  fats: 'Tłuszcze',
  kcal: 'Kalorie',
} as const;