import React from 'react';
import styled from 'styled-components/native';

interface PhraseSelectorProps {
  value: string
  phrase: string
  fontSize?: number
  marginBottom?: number
}
export const PhraseSelector = ({
  value,
  phrase,
  fontSize,
  marginBottom,
}: PhraseSelectorProps) => {

  const loweredValue = value.toLowerCase();
  const loweredPhrase = phrase.toLowerCase();

  const phraseStart = loweredValue.indexOf(loweredPhrase);
  const phraseEnd = phraseStart + phrase.length;

  if (phraseStart === -1) {
    return (
      <TextNormal
        fontSize={fontSize}
        marginBottom={marginBottom}
      >
        {value}
      </TextNormal>
    );
  }

  return (
    <Container marginBottom={marginBottom}>
      <TextNormal fontSize={fontSize}>
        {value.slice(0, phraseStart)}
      </TextNormal>
      <TextBold fontSize={fontSize}>
        {value.slice(phraseStart, phraseEnd)}
      </TextBold>
      <TextNormal fontSize={fontSize}>
        {value.slice(phraseEnd)}
      </TextNormal>
    </Container>
  );
}

const Container = styled.View<{
  marginBottom?: number
}>`
  margin-bottom: ${props => props.marginBottom || 0};
  flex-direction: row;
  max-width: 100%;
`

const TextNormal = styled.Text<{
  fontSize?: number
  marginBottom?: number
}>`
  margin-bottom: ${props => props.marginBottom || 0};
  font-size: ${props => props.fontSize || props.theme.fontSize.regular};
  font-family: ${props => props.theme.fontWeight.regular};
`

const TextBold = styled(TextNormal)<{
  fontSize?: number
}>`
  font-size: ${props => props.fontSize || props.theme.fontSize.regular};
  font-family: ${props => props.theme.fontWeight.bold};
`