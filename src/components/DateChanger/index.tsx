import React from 'react';
import styled from 'styled-components/native';
import dayjs from 'dayjs';
import { DatePickerAndroid, DatePickerAndroidDateSetAction } from 'react-native';

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

  return (
    <Container onPress={handleDateChange}>
      <Title>{dayjsDate.format('dddd')}</Title>
      <DateInfo>{dayjsDate.format('dddd DD MMMM')}</DateInfo>
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  margin: 30px 0;
`

const Title = styled.Text`
  font-size: 25px;
  font-family: 'DMSans-Regular';
  font-weight: bold;
`

const DateInfo = styled.Text`
  margin-top: 8px;
  font-family: 'DMSans-Regular';
`