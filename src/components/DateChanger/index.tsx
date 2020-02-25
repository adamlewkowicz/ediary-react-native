import React from 'react';
import styled from 'styled-components/native';
import dayjs from 'dayjs';
import { DatePickerAndroid, DatePickerAndroidDateSetAction } from 'react-native';
import { Block } from '../Elements';
import { RightArrowIcon } from '../Icons';

interface DateChangerProps {
  value: Date
  onChange: (date: Date) => void
}

export const DateChanger = (props: DateChangerProps) => {
  const dayjsDate = dayjs(props.value);

  async function handleDateChange() {
    try {
      const result = await DatePickerAndroid.open({
        date: props.value
      });

      if (result.action === 'dateSetAction') {
        const { year, month, day } = result as DatePickerAndroidDateSetAction;
        const date = new Date(year, month, day);
  
        props.onChange(date);
      }
    } catch {}
  }

  const handleDayChange = (direction: 'prev' | 'next') => {
    const numericDirection = direction === 'prev' ? -1 : 1;
    const date = dayjsDate.add(numericDirection, 'day').toDate();

    props.onChange(date);
  }

  return (
    <Block marginVertical={8} align="center" space="space-between">
      <DayChangeButton
        accessibilityLabel="Poprzedni dzień"
        onPress={() => handleDayChange('prev')}
      >
        <ArrowIconLeft {...ARROW_ICON_STYLE} />
      </DayChangeButton>
      <CalendarButton onPress={handleDateChange}>
        <Title>{dayjsDate.format('dddd')}</Title>
        <DateInfo>{dayjsDate.format('DD MMMM YYYY')}</DateInfo>
      </CalendarButton>
      <DayChangeButton
        accessibilityLabel="Następny dzień"
        onPress={() => handleDayChange('next')}
      >
        <ArrowIconRight {...ARROW_ICON_STYLE} />
      </DayChangeButton>
    </Block>
  );
}

const DayChangeButton = styled.TouchableOpacity`
  padding: 20px;
`

const ArrowIconRight = styled(RightArrowIcon)``

const ArrowIconLeft = styled(ArrowIconRight)`
  transform: rotate(180deg);
`

const CalendarButton = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  margin: 30px 0;
`

const Title = styled.Text`
  font-size: 25px;
  font-family: ${props => props.theme.fontWeight.regular};
  font-weight: bold;
`

const DateInfo = styled.Text`
  margin-top: 8px;
  font-family: ${props => props.theme.fontWeight.regular};
`

const ARROW_ICON_STYLE = {
  fill: '#17A7F2',
  width: 26,
  height: 26,
}