import React from 'react';
import { Grid } from 'react-native-svg-charts';
import * as SvgCharts from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import dayjs from 'dayjs';
import { THEME } from '../../common/theme';
import styled, {  } from 'styled-components/native';
import { SvgGradientDef } from '../atoms';

interface DiarySummaryChartProps {
  dateFormat?: string
  data: {
    value: number
    date: Date
  }[]
}

export const DiarySummaryChart = (props: DiarySummaryChartProps) => {
  const { dateFormat = 'ddd D' } = props;

  const handleFormatLabel = (value: string): string => {
    return dayjs(value).format(dateFormat);
  }

  return (
    <Container>
      <RangeYAxis
        data={props.data.map(record => record.value)}
        contentInset={RangeYAxisContentInset}
        svg={RangeYAxisStyle}
        numberOfTicks={6}
      />
      <ChartContainer>
        <AreaChart
          data={props.data.map(record => record.value)}
          contentInset={AreaChartContentInset}
          svg={AreaChartStyle}
          curve={shape.curveBasis}
        >
          <Grid svg={GridSvgStyle} />
          <SvgGradientDef
            id={GRADIENT_ID}
            colors={THEME.gradient.kcal}
            stopOpacity={[0.8, 0.2]}
          />
        </AreaChart>
        <DateXAxis
          data={props.data}
          svg={DateXAxisStyle as any}
          xAccessor={({ item }: any) => item.date}
          scale={scale.scaleTime}
          contentInset={DateXAxisContentInset}
          formatLabel={handleFormatLabel}
        />
      </ChartContainer>
    </Container>
  );
}

const GRADIENT_ID = 'diary-summary-chart';

const X_AXIS_HEIGHT = 30;

const Container = styled.View`
  height: 200px;
  flex-direction: row;
  margin-bottom: 20px;
`

const RangeYAxis = styled(SvgCharts.YAxis)`
  margin-bottom: ${X_AXIS_HEIGHT}px;
  min-width: 30px;
`

const ChartContainer = styled.View`
  flex: 1;
  margin-left: 10px;
`

const DateXAxis = styled(SvgCharts.XAxis)`
  margin-horizontal: -15px;
  height: 20px;
`

const AreaChart = styled(SvgCharts.AreaChart)`
  flex: 1;
`

const RangeYAxisContentInset = {
  top: 10,
  bottom: 10,
};

const RangeYAxisStyle = {
  fontSize: 10,
  fill: THEME.color.tertiary,
  fontFamily: THEME.fontWeight.regular,
};

const DateXAxisStyle = {
  fill: THEME.color.primary,
  fontFamily: THEME.fontWeight.regular,
  fontSize: 8,
  fontWeight: 'bold',
  rotation: 20,
  originY: X_AXIS_HEIGHT,
  y: 5,
};

const AreaChartStyle = {
  fill: `url(#${GRADIENT_ID})`
};

const AreaChartContentInset = {
  top: 15,
  bottom: 15,
};

const GridSvgStyle = {
  stroke: THEME.color.quaternary
};

const DateXAxisContentInset = {
  left: 10,
  right: 30,
};