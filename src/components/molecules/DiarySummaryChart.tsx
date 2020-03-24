import React from 'react';
import { Defs, Stop, LinearGradient } from 'react-native-svg'
import { Grid } from 'react-native-svg-charts';
import * as SvgCharts from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import dayjs from 'dayjs';
import { theme } from '../../common/theme';
import styled from 'styled-components/native';

const GRADIENT_ID = 'diary-summary-chart';
const X_AXIS_HEIGHT = 30;

const YAxisContentInset = { top: 10, bottom: 10 };
const YAxisSvg = {
  fontSize: 10,
  fill: theme.color.gray20,
  fontFamily: theme.fontWeight.regular,
};
const XAxisSvg = {
  fill: 'black',
  fontFamily: theme.fontWeight.regular,
  fontSize: 8,
  fontWeight: 'bold',
  rotation: 20,
  originY: X_AXIS_HEIGHT,
  y: 5,
};
const AreaChartSvg = { fill: `url(#${GRADIENT_ID})` };
const AreaChartContentInset = { top: 15, bottom: 15 };
const GridSvg = { stroke: theme.color.gray10 };
const XAxisContentInset = { left: 10, right: 30 };

interface DiarySummaryChartProps {
  dateFormat: string
  data: {
    value: number
    date: Date
  }[]
}

export const DiarySummaryChart = (props: DiarySummaryChartProps) => {
  return (
    <Container>
      <YAxis
        data={props.data.map(record => record.value)}
        contentInset={YAxisContentInset}
        svg={YAxisSvg}
        numberOfTicks={5}
      />
      <ChartContainer>
        <AreaChart
          data={props.data.map(record => record.value)}
          contentInset={AreaChartContentInset}
          svg={AreaChartSvg}
          curve={shape.curveNatural}
        >
          <Grid svg={GridSvg} />
          <Gradient />
        </AreaChart>
        <XAxis
          data={props.data}
          svg={XAxisSvg as any}
          xAccessor={({ item }: any) => item.date}
          scale={scale.scaleTime}
          contentInset={XAxisContentInset}
          formatLabel={value => dayjs(value).format(props.dateFormat)}
        />
      </ChartContainer>
    </Container>
  );
}

const Gradient = ({ index }: { index?: number }) => (
  <Defs key={index}>
    <LinearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="0%" y2="100%">
      <Stop offset="0%" stopColor={theme.gradient.kcal[0]} stopOpacity={0.8}/>
      <Stop offset="100%" stopColor={theme.gradient.kcal[1]} stopOpacity={0.2}/>
    </LinearGradient>
  </Defs>
);

const Container = styled.View`
  height: 200px;
  flex-direction: row;
  margin-bottom: 20px;
`

const YAxis = styled(SvgCharts.YAxis)`
  margin-bottom: ${X_AXIS_HEIGHT};
  min-width: 30px;
`

const ChartContainer = styled.View`
  flex: 1;
  margin-left: 10px;
`

const XAxis = styled(SvgCharts.XAxis)`
  margin-horizontal: -15px;
  height: 20px;
`

const AreaChart = styled(SvgCharts.AreaChart)`
  flex: 1;
`