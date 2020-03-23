import React from 'react';
import styled from 'styled-components/native';
import { WheatIcon, SteakIcon, DropIcon, FireIcon } from '../Icons';
import { TextMeta } from '../Elements';
import { theme } from '../../common/theme';
import { ViewProps } from 'react-native';
import { utils } from '../../utils';

interface NutritionBoxProps extends ViewProps {
  value: number
  element: 'carbs' | 'prots' | 'fats' | 'kcal'
}

export const NutritionBox = ({
  value,
  element,
  ...props
}: NutritionBoxProps) => {
  const GenericIcon = NutritionIcon[element];
  
  return (
    <Container {...props}>
      <GenericIcon
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={theme.color[element]}
      />
      <TextMeta
        value={utils.toLocaleString(value)}
        meta={element === 'kcal' ? 'kcal' : 'g'}
        valueFontSize={theme.fontSize.regular}
        metaFontSize={theme.fontSize.tiny}
        marginTop="7px"
      />
    </Container>
  );
}

const NutritionIcon = {
  carbs: WheatIcon,
  prots: SteakIcon,
  fats: DropIcon,
  kcal: FireIcon
}

const ICON_SIZE = 20;

const Container = styled.View`
  align-items: center;
  min-width: 51px;
`