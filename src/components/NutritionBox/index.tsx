import React from 'react';
import styled from 'styled-components/native';
import { WheatIcon, SteakIcon, DropIcon, FireIcon } from '../Icons';
import { TextMeta } from '../Elements';
import { theme } from '../../common/theme';
import { toLocaleString } from '../../common/utils';
import { ViewProps } from 'react-native';

const nutritionIcon = {
  carbs: WheatIcon,
  prots: SteakIcon,
  fats: DropIcon,
  kcal: FireIcon
}

interface NutritionBoxProps extends ViewProps {
  value: number
  element: 'carbs' | 'prots' | 'fats' | 'kcal'
}
export const NutritionBox = ({
  value,
  element,
  ...props
}: NutritionBoxProps) => {
  const GenericIcon = nutritionIcon[element];
  const ICON_SIZE = 20;
  
  return (
    <Container {...props}>
      <GenericIcon
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={theme.color[element]}
      />
      <TextMeta
        value={toLocaleString(value)}
        meta={element === 'kcal' ? 'kcal' : 'g'}
        valueFontSize={theme.fontSize.regular}
        metaFontSize={11}
        marginTop="7px"
      />
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
  min-width: 51px;
`