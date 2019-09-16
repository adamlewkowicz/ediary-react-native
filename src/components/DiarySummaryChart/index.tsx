import React from 'react';
import { Defs, Stop, LinearGradient } from 'react-native-svg'
import { AreaChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import { DateDay } from '../../types';
import { View } from 'react-native';
import dayjs from 'dayjs';
import { theme } from '../../common/theme';

const Gradient = ({ index }: any) => (
  <Defs key={index}>
    <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
      <Stop offset={'0%'} stopColor={theme.gradient.kcal[0]} stopOpacity={0.8}/>
      <Stop offset={'100%'} stopColor={theme.gradient.kcal[1]} stopOpacity={0.2}/>
    </LinearGradient>
  </Defs>
);

interface DiarySummaryChartProps {
  values: number[]
  labels: (string | DateDay)[]
  records: {
    value: number
    label: (string | DateDay)
  }[]
}
export const DiarySummaryChart = (props: DiarySummaryChartProps) => {

  const axesSvg = { fontSize: 10, fill: theme.color.gray20, fontFamily: theme.fontWeight.regular };
  const verticalContentInset = { top: 10, bottom: 10 }
  const xAxisHeight = 30

  return (
    <View style={{ height: 200, flexDirection: 'row', marginBottom: 20 }}>
      <YAxis
        data={props.records.map(record => record.value)}
        style={{ marginBottom: xAxisHeight, minWidth: 30 }}
        contentInset={verticalContentInset}
        svg={axesSvg}
        numberOfTicks={5}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <AreaChart
          style={{ flex: 1 }}
          data={props.records.map(record => record.value)}
          contentInset={{ top: 15, bottom: 15 }}
          svg={{ fill: 'url(#gradient)' }}
          curve={shape.curveNatural}
        >
          <Grid svg={{ stroke: theme.color.gray10 }} />
          <Gradient />
        </AreaChart>
        <XAxis
          data={props.records}
          svg={{
            fill: 'black',
            fontSize: 8,
            fontWeight: 'bold',
            rotation: 20,
            originY: 30,
            y: 5,
            fontFamily: theme.fontWeight.regular
          }}
          xAccessor={ ({ item }) => item.label }
          scale={ scale.scaleTime }
          numberOfTicks={ 6 }
          style={{ marginHorizontal: -15, height: 20 }}
          contentInset={{ left: 10, right: 25 }}
          formatLabel={ (value) => dayjs(value).format('ddd - DD.MM')}
        />
      </View>
    </View>
  );
}