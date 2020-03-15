import React from 'react';
import styled from 'styled-components/native';
import dayjs from 'dayjs';
import { DatePickerAndroid, DatePickerAndroidDateSetAction } from 'react-native';
import { RightArrowIcon } from '../Icons';
import { TextPrimary, H1 } from '../../_components';
import { theme } from '../../common/theme';

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
    <Container>
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
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

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

const Title = styled(H1)`
  font-size: 27px;

`

const DateInfo = styled(TextPrimary)`
  font-family: ${props => props.theme.fontWeight.light};
`

const ARROW_ICON_STYLE = {
  fill: theme.color.highlight,
  width: 26,
  height: 26,
}