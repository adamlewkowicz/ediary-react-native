import React, { useState } from 'react';
import styled from 'styled-components/native';
import dayjs from 'dayjs';
import { RightArrowIcon, TextPrimary, H1 } from '../';
import { theme } from '../../common/theme';
import DateTimePicker, { BaseProps as DatePickerBaseProps } from '@react-native-community/datetimepicker';

interface DateChangerProps {
  value: Date
  onChange: (date: Date) => void
}

export const DateChanger = (props: DateChangerProps) => {
  const dayjsDate = dayjs(props.value);
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = (): void => setIsOpened(true);

  const handleOnChange: DatePickerBaseProps['onChange'] = (event, date): void => {
    setIsOpened(false);
    if (date) {
      props.onChange(date);
    }
  }

  const handleDayChange = (direction: 'prev' | 'next'): void => {
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
      <CalendarButton
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel="Zmień datę"
      >
        <Title>{dayjsDate.format(DAYJS_DAY)}</Title>
        <DateInfo>{dayjsDate.format(DAYJS_MAIN_DATE)}</DateInfo>
      </CalendarButton>
      <DayChangeButton
        accessibilityLabel="Następny dzień"
        onPress={() => handleDayChange('next')}
      >
        <ArrowIconRight {...ARROW_ICON_STYLE} />
      </DayChangeButton>
      {isOpened && (
        <DateTimePicker
          value={props.value}
          mode="date"
          display="calendar"
          textColor={theme.color.primary}
          onChange={handleOnChange}
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const DayChangeButton = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.base};
`

const ArrowIconRight = styled(RightArrowIcon)``

const ArrowIconLeft = styled(ArrowIconRight)`
  transform: rotate(180deg);
`

const CalendarButton = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  margin: ${props => props.theme.spacing.baseVertical};
`

const Title = styled(H1)`
  font-size: 27px;
`

const DateInfo = styled(TextPrimary)`
  font-family: ${props => props.theme.fontWeight.light};
`

export const DateChangerMemo = React.memo(DateChanger);

const ARROW_ICON_STYLE = {
  fill: theme.color.highlight,
  width: 26,
  height: 26,
}

const DAYJS_DAY = 'dddd';

const DAYJS_MAIN_DATE = 'DD MMMM YYYY';