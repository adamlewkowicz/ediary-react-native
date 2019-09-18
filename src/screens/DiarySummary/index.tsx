import React, { useState, useEffect, useMemo } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { H1, Text, Block, TitleSecondary } from '../../components/Elements';
import { DiarySummaryChart } from '../../components/DiarySummaryChart';
import { Meal } from '../../database/entities';
import { connect } from 'react-redux';
import { StoreState, Selectors } from '../../store';
import { calcMacroNeedsLeft } from '../../common/utils';
import { DateDay, MacroElements } from '../../types';
import styled from 'styled-components/native';
import { MACRO_ELEMENTS } from '../../common/consts';
import { elementTitlesLong, baseMacro } from '../../common/helpers';
import { RatioInfo } from '../../components/RatioInfo';
import { useFocusState } from 'react-navigation-hooks';

interface DiarySummaryProps extends MapStateProps, NavigationScreenProps {}
const DiarySummary = (props: DiarySummaryProps) => {
  const [macroSummary, setMacroSummary] = useState<MacroElements>(() => ({ ...baseMacro }));
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const { isFocused } = useFocusState();

  async function handleMacroSummaryFetch() {
    const result = await Meal.getMacroSummary(props.todayDay);
    setMacroSummary(result.average);
    setHistoryRecords(result.data.map(record => ({
      value: record.kcal,
      date: new Date(record.day as any)
    })));
  }

  useEffect(() => {
    handleMacroSummaryFetch();
  }, [isFocused]);

  const macroNeeds = useMemo(() => 
    calcMacroNeedsLeft(macroSummary, props.macroNeeds),
    [macroSummary, props.macroNeeds] 
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
              ratio={macroNeeds[element].ratio}
              value={macroNeeds[element].diff}
              margin="0 8px 0 0"
              size="tiny"
            />
            <Text size="big" margin="0 5px 0 0">
              {Math.round(macroSummary[element])}
            </Text>
            <Text size="regular" priority={3}>
              / {props.macroNeeds[element]}
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

interface MapStateProps {
  macroNeeds: Selectors.MacroNeeds
  todayDay: DateDay
}

const mapStateToProps = (state: StoreState): MapStateProps => ({
  macroNeeds: Selectors.macroNeeds(state),
  todayDay: state.application.todayDay,
});
const DiarySummaryConnected = connect(mapStateToProps)(DiarySummary);

export { DiarySummaryConnected as DiarySummary };

type HistoryRecord = {
  value: number
  date: Date
}