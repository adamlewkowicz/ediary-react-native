import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SelectionBox } from '../../components/SelectionBox';
import { Block } from '../../components/Elements';
import { WomanIcon, ManIcon } from '../../components/Icons';
import { themeProps } from '../../common/theme';

export const ProfileCreator = () => {
  const [male, setMale] = useState(true);

  return (
    <Container>
      <Block row space="space-around">
        <SelectionBox 
          value={male}
          onChange={() => setMale(true)}
          title="Mężczyzna"
          icon={(
            <ManIcon
              fill={male ? themeProps.focusColor : 'rgba(1,1,1,.7)'}
              width={45}
              height={45}
            />
          )}
        />
        <SelectionBox
          value={!male}
          onChange={() => setMale(false)}
          title="Kobieta"
          icon={(
            <WomanIcon
              fill={!male ? themeProps.focusColor : 'rgba(1,1,1,.7)'}
              width={45}
              height={45}
            />
          )}
        />
      </Block>
    </Container>
  );
}

const Container = styled.View`

`