import React, { useState, useEffect, useMemo } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { H1, Text, Block, TitleSecondary } from '../../components/Elements';
import { DiarySummaryChart } from '../../components/DiarySummaryChart';
import { Meal } from '../../database/entities';
import { useSelector, connect } from 'react-redux';
import { StoreState, Selectors } from '../../store';
import { GetMacroHistoryResult } from '../../database/entities/Meal/types';
import dayjs from 'dayjs';
import { getDayFromDate, calcMacroNeedsLeft } from '../../common/utils';
import { DateDay, MacroElements } from '../../types';
import styled from 'styled-components/native';
import { MACRO_ELEMENTS } from '../../common/consts';
import { elementTitlesLong, baseMacro } from '../../common/helpers';
import { RatioInfo } from '../../components/RatioInfo';

interface DiarySummaryProps extends MapStateProps, NavigationScreenProps {}
const DiarySummary = (props: DiarySummaryProps) => {
  const appDateDay = useSelector((state: StoreState) => state.application.day);
  const [dateDay, setDateDay] = useState<DateDay>(() => {
    const date = dayjs(appDateDay as any);
    return getDayFromDate(date);
  });
  const [macroHistory, setMacroHistory] = useState<GetMacroHistoryResult[]>([]);
  const [macroSummary, setMacroSummary] = useState<MacroElements>(() => ({ ...baseMacro }));

  useEffect(() => {
    Meal.getMacroSummary(dateDay)
      .then(result => {
        setMacroHistory(result.data);
        setMacroSummary(result.average);
      })
      .catch(console.error);
  }, [appDateDay]);

  const records = useMemo(() =>
    macroHistory.map(record => ({
      value: record.kcal,
      date: new Date(record.day as any)
    })),
    [macroHistory]
  );

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
        dateFormat="ddd - DD.MM"
        data={records}
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
}

const mapStateToProps = (state: StoreState): MapStateProps => ({
  macroNeeds: Selectors.macroNeeds(state)
});
const DiarySummaryConnected = connect(mapStateToProps)(DiarySummary);

export { DiarySummaryConnected as DiarySummary }; 