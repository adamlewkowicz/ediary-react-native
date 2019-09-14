import React from 'react';
import { Defs, Stop, LinearGradient } from 'react-native-svg'
import { AreaChart, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { DateDay } from '../../types';

const Gradient = ({ index }: any) => (
  <Defs key={index}>
    <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
      <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} stopOpacity={0.8}/>
      <Stop offset={'100%'} stopColor={'rgb(134, 65, 244)'} stopOpacity={0.2}/>
    </LinearGradient>
  </Defs>
);

interface DiarySummaryChartProps {
  values: number[]
  labels: (string | DateDay)[]
}
export const DiarySummaryChart = (props: DiarySummaryChartProps) => {
  return (
    <AreaChart
      style={{ height: 200 }}
      data={props.values}
      contentInset={{ top: 20, bottom: 20 }}
      svg={{ fill: 'url(#gradient)' }}
      curve={shape.curveNatural}
    >
      <Grid />
      <Gradient />
    </AreaChart>
  );
}