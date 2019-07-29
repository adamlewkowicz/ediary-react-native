import React from 'react';
import styled from 'styled-components/native';
import dayjs from 'dayjs';

interface DateChangerProps {
  date: Date
}
export const DateChanger = ({
  date
}: DateChangerProps) => {
  const dayjsDate = dayjs(date);

  return (
    <Container>
      <Title>Dzisiaj</Title>
      <DateInfo>{dayjsDate.format('dddd DD MMMM')}</DateInfo>
    </Container>
  );
}

const Container = styled.View`
  display: flex;
  align-items: center;
  margin: 25px 0;
`

const Title = styled.Text`
  font-size: 25px;
  font-weight: bold;
`

const DateInfo = styled.Text`
  margin-top: 8px;
  
`