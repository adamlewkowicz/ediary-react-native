import React from 'react';
import styled from 'styled-components/native';
import { WheatIcon, SteakIcon, DropIcon, FireIcon } from '../Icons';
import { TextMeta } from '../Elements';
import { nutritionColorSolid } from '../../common/theme';
import { toLocaleString } from '../../common/utils';

const nutritionIcon = {
  carbs: WheatIcon,
  prots: SteakIcon,
  fats: DropIcon,
  kcal: FireIcon
}

interface NutritionBoxProps {
  value: number
  element: 'carbs' | 'prots' | 'fats' | 'kcal'
}
export const NutritionBox = (props: NutritionBoxProps) => {
  const GenericIcon = nutritionIcon[props.element];
  return (
    <Container>
      <GenericIcon
        width={22}
        height={22}
        fill={nutritionColorSolid[props.element]}
      />
      <TextMeta
        value={toLocaleString(props.value)}
        meta={props.element === 'kcal' ? 'kcal' : 'g'}
        valueFontSize={16}
        metaFontSize={13}
        marginTop="9px"
      />
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
  min-width: 51px;
`